<?php
declare(strict_types=1);

function outreach_db(array $config): PDO
{
    $dir = $config['outreach_data_directory'] ?? '';
    $real = is_string($dir) ? realpath($dir) : false;
    $root = realpath($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__, 2));
    if (!$real || !$root || $real === $root || str_starts_with($real . '/', $root . '/') || !is_writable($real)) {
        throw new RuntimeException('Ein beschreibbares Outreach-Datenverzeichnis außerhalb des Webroots muss serverseitig eingerichtet werden.');
    }
    umask(0077);
    $db = new PDO('sqlite:' . $real . '/outreach.sqlite');
    outreach_schema($db);
    return $db;
}

function outreach_schema(PDO $db): void
{
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000');
    $db->exec("CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY, organisation TEXT NOT NULL, category TEXT NOT NULL, pool TEXT NOT NULL,
        email TEXT NOT NULL DEFAULT '', address TEXT NOT NULL DEFAULT '', website TEXT NOT NULL DEFAULT '',
        source TEXT NOT NULL UNIQUE, researched_at INTEGER NOT NULL, verified_at INTEGER,
        permission TEXT NOT NULL DEFAULT 'none', evidence TEXT NOT NULL DEFAULT '', stage TEXT NOT NULL DEFAULT 'candidate'
    );
    CREATE TABLE IF NOT EXISTS suppression (email TEXT PRIMARY KEY, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS templates (id INTEGER PRIMARY KEY, name TEXT NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS campaigns (id INTEGER PRIMARY KEY, name TEXT NOT NULL, pool TEXT NOT NULL,
        start_date TEXT NOT NULL, days INTEGER NOT NULL, subject TEXT NOT NULL, body TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft', approved_at INTEGER, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS deliveries (id INTEGER PRIMARY KEY, campaign_id INTEGER NOT NULL REFERENCES campaigns(id),
        contact_id INTEGER NOT NULL REFERENCES contacts(id), email TEXT NOT NULL, organisation TEXT NOT NULL,
        subject TEXT NOT NULL, body TEXT NOT NULL, due_at INTEGER NOT NULL, state TEXT NOT NULL DEFAULT 'pending',
        unsubscribe_token TEXT NOT NULL UNIQUE, attempted_at INTEGER, sent_at INTEGER,
        UNIQUE(campaign_id, email));
    CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY, action TEXT NOT NULL, entity_id INTEGER, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);");
    if ((int)$db->query('SELECT COUNT(*) FROM templates')->fetchColumn() === 0) {
        $intro = "Guten Tag an das Team von {{organisation}},\n\n";
        outreach_sql($db, 'INSERT INTO templates(name,subject,body) VALUES (?,?,?)', ['Information', 'Informationen zu Krankenfahrten in Bad Homburg', $intro . "gern informieren wir Sie über Krankenfahrten Bad Homburg. Wir organisieren sitzende Fahrten zu Arztterminen, Kliniken und Behandlungen in Bad Homburg und Umgebung.\n\nWenn Sie eine konkrete Fahrt abstimmen möchten, antworten Sie uns gern mit einem Rückrufwunsch. Bitte senden Sie dabei keine Diagnosen oder Patientendaten.\n\nInformationen: https://krankenfahrten-bad-homburg.de/leistungen/"]);
        outreach_sql($db, 'INSERT INTO templates(name,subject,body) VALUES (?,?,?)', ['Angebotsgespräch', 'Fahrtbedarf persönlich abstimmen', $intro . "gern besprechen wir mit Ihnen den organisatorischen Bedarf für sitzende Krankenfahrten. Umfang, Verfügbarkeit und Kosten stimmen wir anhand des konkreten Auftrags ab.\n\nWann passt Ihnen ein kurzes Gespräch? Eine Antwort mit einem Rückrufwunsch genügt. Bitte übermitteln Sie keine Patientendaten.\n\nhttps://krankenfahrten-bad-homburg.de/kontakt/"]);
    }
}

function outreach_sql(PDO $db, string $sql, array $values = []): PDOStatement
{
    $stmt = $db->prepare($sql);
    $stmt->execute($values);
    return $stmt;
}

function outreach_audit(PDO $db, string $action, ?int $id = null): void
{
    outreach_sql($db, 'INSERT INTO audit(action,entity_id,created_at) VALUES (?,?,?)', [$action, $id, time()]);
}

function outreach_text(mixed $value, int $max, bool $required = true): string
{
    if (!is_string($value) || strlen($value) > $max || ($required && trim($value) === '') || str_contains($value, "\0")) throw new InvalidArgumentException('Bitte alle Pflichtfelder innerhalb der erlaubten Länge ausfüllen.');
    return trim($value);
}

function outreach_url(string $value, bool $required = true): string
{
    if (!$required && $value === '') return '';
    if (!filter_var($value, FILTER_VALIDATE_URL) || !in_array(parse_url($value, PHP_URL_SCHEME), ['http', 'https'], true)) throw new InvalidArgumentException('Eine vollständige http(s)-Quellenadresse ist erforderlich.');
    return $value;
}

function outreach_contact(PDO $db, array $data): void
{
    $id = (int)($data['id'] ?? 0);
    $email = strtolower(outreach_text($data['email'] ?? '', 254, false));
    if ($email !== '' && (!filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $email))) throw new InvalidArgumentException('Ungültige E-Mail-Adresse.');
    $permission = $data['permission'] ?? 'none';
    if (!in_array($permission, ['none', 'consent', 'customer_exception'], true)) throw new InvalidArgumentException('Ungültige Versandgrundlage.');
    $evidence = outreach_text($data['evidence'] ?? '', 2000, false);
    $verified = isset($data['verified']);
    if ($permission !== 'none' && (!$verified || $email === '' || strlen($evidence) < 20)) throw new InvalidArgumentException('Versandfreigabe benötigt geprüfte Adresse und Nachweis mit Datum, Herkunft und Umfang.');
    if ($permission === 'customer_exception' && !isset($data['customer_checks'])) throw new InvalidArgumentException('Für die Bestandskunden-Ausnahme müssen alle vier Voraussetzungen bestätigt werden.');
    $stage = $data['stage'] ?? 'candidate';
    if (!in_array($stage, ['candidate','qualified','replied','partner','not_interested'], true)) throw new InvalidArgumentException('Unbekannter Pipeline-Status.');
    $values = [outreach_text($data['organisation'] ?? '', 200), outreach_text($data['category'] ?? '', 100), outreach_text($data['pool'] ?? '', 100), $email,
        outreach_text($data['address'] ?? '', 500, false), outreach_url(outreach_text($data['website'] ?? '', 1000, false), false), outreach_url(outreach_text($data['source'] ?? '', 1000)),
        $verified ? time() : null, $permission, $evidence, $stage];
    if ($id) {
        outreach_sql($db, 'UPDATE contacts SET organisation=?,category=?,pool=?,email=?,address=?,website=?,source=?,verified_at=?,permission=?,evidence=?,stage=? WHERE id=?', [...$values, $id]);
    } else {
        outreach_sql($db, 'INSERT INTO contacts(organisation,category,pool,email,address,website,source,verified_at,permission,evidence,stage,researched_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [...$values,time()]);
        $id = (int)$db->lastInsertId();
    }
    if ($stage === 'not_interested' && $email !== '') outreach_suppress($db, $email);
    outreach_audit($db, 'contact_saved', $id);
}

function outreach_suppress(PDO $db, string $email): void
{
    outreach_sql($db, 'INSERT OR IGNORE INTO suppression(email,created_at) VALUES (?,?)', [strtolower($email),time()]);
    outreach_sql($db, "UPDATE deliveries SET state='suppressed' WHERE email=? AND state='pending'", [strtolower($email)]);
    outreach_audit($db, 'address_suppressed');
}

function outreach_eligible(PDO $db, array $contact, int $now): bool
{
    return filter_var($contact['email'], FILTER_VALIDATE_EMAIL) !== false
        && in_array($contact['permission'], ['consent','customer_exception'], true)
        && (int)$contact['verified_at'] >= $now - 90 * 86400
        && strlen($contact['evidence']) >= 20
        && in_array($contact['stage'], ['qualified','partner'], true)
        && !outreach_sql($db,'SELECT 1 FROM suppression WHERE email=?',[$contact['email']])->fetchColumn();
}

function outreach_template(string $subject, string $body): void
{
    outreach_text($subject, 200);
    outreach_text($body, 10000);
    if (preg_match('/[\r\n]/', $subject)) throw new InvalidArgumentException('Betreff muss einzeilig sein.');
    preg_match_all('/\{\{(.*?)\}\}/s', $subject . $body, $matches);
    foreach ($matches[1] as $key) if ($key !== 'organisation') throw new InvalidArgumentException('Erlaubter Platzhalter: {{organisation}}.');
}

function outreach_campaign(PDO $db, array $data, int $now): int
{
    $date = outreach_text($data['start_date'] ?? '', 10);
    $start = DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone('Europe/Berlin'));
    if (!$start || $start->format('Y-m-d') !== $date || $date < (new DateTimeImmutable('@'.$now))->setTimezone(new DateTimeZone('Europe/Berlin'))->format('Y-m-d')) throw new InvalidArgumentException('Startdatum muss heute oder in der Zukunft liegen.');
    $days = filter_var($data['days'] ?? 3, FILTER_VALIDATE_INT);
    if (!$days || $days < 1 || $days > 14) throw new InvalidArgumentException('Erlaubt sind 1–14 Tage.');
    $subject = outreach_text($data['subject'] ?? '', 200);
    $body = outreach_text($data['body'] ?? '', 10000);
    outreach_template($subject, $body);
    $pool = outreach_text($data['pool'] ?? '', 100);
    $contacts = outreach_sql($db,'SELECT * FROM contacts WHERE pool=? ORDER BY id',[$pool])->fetchAll(PDO::FETCH_ASSOC);
    $contacts = array_values(array_filter($contacts, fn($c) => outreach_eligible($db,$c,$now)));
    if (!$contacts) throw new InvalidArgumentException('Der Pool enthält keine versandberechtigten, geprüften Kontakte.');
    // One recipient per campaign even when organisations share an inbox.
    $unique = [];
    foreach ($contacts as $contact) $unique[$contact['email']] ??= $contact;
    $contacts = array_values($unique);
    if (count($contacts) > $days * 50) throw new InvalidArgumentException('Maximal 50 Empfänger pro Kampagnentag. Bitte Pool verkleinern oder Zeitraum verlängern.');
    $db->beginTransaction();
    try {
        outreach_sql($db,'INSERT INTO campaigns(name,pool,start_date,days,subject,body,created_at) VALUES (?,?,?,?,?,?,?)', [outreach_text($data['name'] ?? '',200),$pool,$date,$days,$subject,$body,$now]);
        $id = (int)$db->lastInsertId();
        foreach ($contacts as $i => $contact) {
            $due = $start->modify('+'.($i % $days).' days')->setTime(9, 0)->getTimestamp();
            $replace = ['{{organisation}}' => $contact['organisation']];
            $renderedSubject = strtr($subject, $replace);
            if (preg_match('/[\r\n]/', $renderedSubject)) throw new InvalidArgumentException('Organisation darf keinen mehrzeiligen Betreff erzeugen.');
            outreach_sql($db,'INSERT INTO deliveries(campaign_id,contact_id,email,organisation,subject,body,due_at,unsubscribe_token) VALUES (?,?,?,?,?,?,?,?)', [$id,$contact['id'],$contact['email'],$contact['organisation'],$renderedSubject,strtr($body,$replace),$due,bin2hex(random_bytes(32))]);
        }
        outreach_audit($db,'campaign_draft_created',$id);
        $db->commit();
        return $id;
    } catch (Throwable $e) { $db->rollBack(); throw $e; }
}

function outreach_campaign_status(PDO $db, int $id, string $action): void
{
    $map = ['approve'=>['draft','scheduled'], 'pause'=>['scheduled','paused'], 'resume'=>['paused','scheduled'], 'cancel'=>['paused','cancelled']];
    if (!isset($map[$action])) throw new InvalidArgumentException('Unbekannte Kampagnenaktion.');
    [$before,$after] = $map[$action];
    outreach_sql($db,'UPDATE campaigns SET status=?, approved_at=COALESCE(approved_at,?) WHERE id=? AND status=?',[$after,time(),$id,$before]);
    outreach_audit($db,'campaign_'.$action,$id);
}

function outreach_reconcile(PDO $db, int $id, string $state, string $note): void
{
    if (!in_array($state,['sent','failed'],true) || strlen(trim($note))<20 || strlen($note)>1000) throw new InvalidArgumentException('Bitte SMTP-/Postfachprüfung und Ergebnis dokumentieren (20–1000 Zeichen).');
    $result=outreach_sql($db,"UPDATE deliveries SET state=?,sent_at=CASE WHEN ?='sent' THEN attempted_at ELSE NULL END WHERE id=? AND state='unknown'",[$state,$state,$id]);
    if ($result->rowCount()!==1) throw new InvalidArgumentException('Diese Zustellung ist nicht mehr ungeklärt.');
    outreach_audit($db,'delivery_reconciled_'.$state.': '.trim($note),$id);
}

function outreach_mailer(array $config): \PHPMailer\PHPMailer\PHPMailer
{
    require_once editorial_api_path('lib/mail.php');
    $smtp = validated_smtp_config($config);
    if (!$smtp) throw new RuntimeException('SMTP-Konfiguration fehlt.');
    require_once editorial_api_path('vendor/autoload.php');
    $mail = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPDebug = 0;
    $mail->SMTPAuth = true;
    $mail->SMTPAutoTLS = false;
    $mail->Host = $smtp['smtp_host'];
    $mail->Port = $smtp['smtp_port'];
    $mail->Username = $smtp['smtp_username'];
    $mail->Password = $smtp['smtp_password'];
    $mail->Timeout = min(20,$smtp['smtp_timeout']);
    $mail->SMTPSecure = $smtp['smtp_secure'] === 'tls' ? 'tls' : 'ssl';
    $mail->CharSet = 'UTF-8';
    $mail->Encoding = 'quoted-printable';
    $mail->setFrom($smtp['mail_from'],$smtp['mail_from_name']);
    $mail->addReplyTo($smtp['mail_from']);
    return $mail;
}

function outreach_send(array $item, array $config): bool
{
    $mail=outreach_mailer($config);
    $mail->addAddress($item['email']);
    $url = rtrim($config['outreach_public_base_url'],'/') . '/outreach-unsubscribe.php?token=' . $item['unsubscribe_token'];
    $mail->addCustomHeader('List-Unsubscribe', '<'.$url.'>');
    $mail->Subject = $item['subject'];
    $mail->Body = $item['body'] . "\n\n" . $config['outreach_sender_footer'] . "\n\nKeine weiteren Informationen gewünscht?\n" . $url . "\nOder antworten Sie mit Abmelden.\n";
    return $mail->send();
}

function outreach_run(PDO $db, array $config, int $now, ?callable $sender = null): array
{
    outreach_sql($db,"INSERT INTO settings(key,value) VALUES ('worker_last',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",[(string)$now]);
    if (($config['outreach_send_enabled'] ?? false) !== true) return ['sent'=>0,'status'=>'disabled'];
    // Validate transport before claiming a delivery; configuration errors are not SMTP attempts.
    if ($sender === null) outreach_mailer($config);
    $base = $config['outreach_public_base_url'] ?? '';
    if (!is_string($base) || !filter_var($base,FILTER_VALIDATE_URL) || parse_url($base,PHP_URL_SCHEME) !== 'https' || strlen($config['outreach_sender_footer'] ?? '') < 40) throw new RuntimeException('Versand benötigt HTTPS-Abmeldeadresse und vollständige Absenderangaben.');
    $sent = 0;
    for ($i=0; $i<1; $i++) {
        // Claim is committed before network I/O. Ambiguous delivery is never retried automatically.
        $db->exec('BEGIN IMMEDIATE');
        try {
            $limit = max(1,min(50,(int)($config['outreach_daily_limit'] ?? 20)));
            $midnight = (new DateTimeImmutable('@'.$now))->setTimezone(new DateTimeZone('Europe/Berlin'))->setTime(0,0)->getTimestamp();
            $attempts = (int)outreach_sql($db,'SELECT COUNT(*) FROM deliveries WHERE attempted_at>=?',[$midnight])->fetchColumn();
            if ($attempts >= $limit) { $db->exec('COMMIT'); break; }
            $item = outreach_sql($db,"SELECT d.* FROM deliveries d JOIN campaigns c ON c.id=d.campaign_id WHERE c.status='scheduled' AND d.state='pending' AND d.due_at<=? ORDER BY d.due_at,d.id LIMIT 1",[$now])->fetch(PDO::FETCH_ASSOC);
            if (!$item) { $db->exec('COMMIT'); break; }
            $contact = outreach_sql($db,'SELECT * FROM contacts WHERE id=?',[$item['contact_id']])->fetch(PDO::FETCH_ASSOC);
            $recent = outreach_sql($db,'SELECT 1 FROM deliveries WHERE email=? AND attempted_at>?',[$item['email'],$now-30*86400])->fetchColumn();
            $stale = $now - (int)$item['due_at'] > 86400;
            $testRecipient = $config['outreach_test_recipient'] ?? null;
            $wrongTestRecipient = is_string($testRecipient) && strtolower($testRecipient) !== $item['email'];
            if (!$contact || $contact['email'] !== $item['email'] || !outreach_eligible($db,$contact,$now) || $recent || $stale || $wrongTestRecipient) {
                outreach_sql($db,"UPDATE deliveries SET state='blocked' WHERE id=?",[$item['id']]);
                $db->exec('COMMIT'); continue;
            }
            outreach_sql($db,"UPDATE deliveries SET state='unknown',attempted_at=? WHERE id=? AND state='pending'",[$now,$item['id']]);
            $db->exec('COMMIT');
        } catch (Throwable $e) { $db->exec('ROLLBACK'); throw $e; }
        try { $ok = $sender ? $sender($item,$config) === true : outreach_send($item,$config); } catch (Throwable) { $ok = false; }
        if ($ok) {
            outreach_sql($db,"UPDATE deliveries SET state='sent',sent_at=? WHERE id=?",[$now,$item['id']]);
            $sent++;
        }
        outreach_audit($db,$ok ? 'smtp_accepted' : 'delivery_unknown',(int)$item['id']);
        if (!$ok) break;
    }
    $db->exec("UPDATE campaigns SET status='completed' WHERE status='scheduled' AND NOT EXISTS (SELECT 1 FROM deliveries d WHERE d.campaign_id=campaigns.id AND d.state IN ('pending','unknown'))");
    $unknown=(int)$db->query("SELECT COUNT(*) FROM deliveries WHERE state='unknown'")->fetchColumn();
    return ['sent'=>$sent,'status'=>$unknown>0?'needs_review':'checked'];
}
