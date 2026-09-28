<?php
declare(strict_types=1);

function outreach_discover(PDO $db, string $category, string $pool): int
{
    $filters = [
        'Kliniken' => '["amenity"~"^(hospital|clinic)$"]',
        'Arztpraxen' => '["amenity"="doctors"]',
        'Pflegeeinrichtungen' => '["amenity"~"^(nursing_home|social_facility)$"]',
        'Therapie' => '["healthcare"~"^(physiotherapist|rehabilitation|dialysis)$"]',
        'Unternehmen' => '["office"="company"]',
    ];
    if (!isset($filters[$category])) throw new InvalidArgumentException('Unbekannte Recherchekategorie.');
    outreach_text($pool,100);
    $last = (int)outreach_sql($db,"SELECT value FROM settings WHERE key='research_last'")->fetchColumn();
    if (time()-$last < 60) throw new RuntimeException('Bitte zwischen Recherchen eine Minute warten.');
    outreach_sql($db,"INSERT INTO settings(key,value) VALUES ('research_last',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",[(string)time()]);
    // Fixed geographic scope and endpoint; no arbitrary URL fetching from imported records.
    $query = '[out:json][timeout:10];nwr' . $filters[$category] . '(around:15000,50.2268,8.6182);out tags 150;';
    $curl = curl_init('https://overpass.private.coffee/api/interpreter');
    $buffer = '';
    curl_setopt_array($curl,[CURLOPT_POST=>true,CURLOPT_POSTFIELDS=>http_build_query(['data'=>$query]),
        CURLOPT_CONNECTTIMEOUT=>5,CURLOPT_TIMEOUT=>15,CURLOPT_FOLLOWLOCATION=>false,
        CURLOPT_USERAGENT=>'KrankenfahrtenBadHomburg-Outreach/1.0 (+https://krankenfahrten-bad-homburg.de/)',
        CURLOPT_WRITEFUNCTION=>static function ($handle,string $chunk) use (&$buffer): int {
            if (strlen($buffer)+strlen($chunk)>2000000) return 0;
            $buffer.=$chunk; return strlen($chunk);
        }]);
    $ok = curl_exec($curl);
    $status = curl_getinfo($curl,CURLINFO_RESPONSE_CODE);
    unset($curl);
    if (!$ok || $status !== 200) throw new RuntimeException('Rechercheanbieter derzeit nicht erreichbar. Kontakte können weiterhin manuell erfasst werden.');
    $result = json_decode($buffer,true,32,JSON_THROW_ON_ERROR);
    if (!isset($result['elements']) || isset($result['remark'])) throw new RuntimeException('Recherche unvollständig. Bitte später erneut versuchen.');
    return outreach_import_osm($db,$result['elements'],$category,$pool);
}

function outreach_import_osm(PDO $db, array $elements, string $category, string $pool): int
{
    $count=0;
    foreach (array_slice($elements,0,150) as $element) {
        $tags=$element['tags']??[];
        if (!is_array($tags) || !is_string($tags['name']??null) || !in_array($element['type']??null,['node','way','relation'],true) || !is_int($element['id']??null)) continue;
        $source='https://www.openstreetmap.org/'.$element['type'].'/'.$element['id'];
        $email=strtolower(trim((string)($tags['contact:email']??$tags['email']??'')));
        if (!filter_var($email,FILTER_VALIDATE_EMAIL)) $email='';
        $website=(string)($tags['contact:website']??$tags['website']??'');
        if (!filter_var($website,FILTER_VALIDATE_URL) || !in_array(parse_url($website,PHP_URL_SCHEME),['http','https'],true)) $website='';
        $address=implode(' ',array_filter([$tags['addr:street']??'', $tags['addr:housenumber']??'', $tags['addr:postcode']??'', $tags['addr:city']??'']));
        $stmt=outreach_sql($db,'INSERT OR IGNORE INTO contacts(organisation,category,pool,email,address,website,source,researched_at) VALUES (?,?,?,?,?,?,?,?)',[mb_substr($tags['name'],0,200),$category,$pool,$email,mb_substr($address,0,500),mb_substr($website,0,1000),$source,time()]);
        $count+=$stmt->rowCount();
    }
    outreach_audit($db,'research_imported');
    return $count;
}
