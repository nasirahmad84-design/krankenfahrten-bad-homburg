import {writeFileSync} from 'node:fs';
const token=process.env.OUTREACH_TEST_RUNNER_TOKEN;
const base=process.env.TEST_SITE_URL;
if (!token || !/^[a-f0-9]{64}$/.test(token) || base !== 'https://test.krankenfahrten-bad-homburg.de') throw new Error('Test-Konfiguration fehlt oder falsches Ziel.');
const settings={outreach_send_enabled:true,outreach_daily_limit:1,outreach_runner_token:token,
  outreach_test_recipient:'nahmad@outlook.de',outreach_public_base_url:base+'/redaktion',
  outreach_sender_footer:'Krankenfahrten Bad Homburg · Mubasher Ahmad\nBasler Str. 3, 61352 Bad Homburg, Deutschland\nTelefon: 0175 4142222 · anfrage@krankenfahrten-bad-homburg.de\nhttps://krankenfahrten-bad-homburg.de/impressum/\nhttps://krankenfahrten-bad-homburg.de/datenschutz/\nInterner Funktionstest auf ausdrücklichen Wunsch des Empfängers. Keine Firmenkampagne.'};
const encoded=Buffer.from(JSON.stringify(settings)).toString('base64');
writeFileSync('out-editorial/outreach-config.php',`<?php
declare(strict_types=1);
$storage=dirname(__DIR__,2).'/.private-kfbh-outreach-test';
if (!is_dir($storage) && !mkdir($storage,0700,true)) throw new RuntimeException('Privater Speicher nicht verfügbar.');
if (!is_file($storage.'/.htaccess')) file_put_contents($storage.'/.htaccess',"Require all denied\\n");
$config=json_decode(base64_decode('${encoded}',true),true,32,JSON_THROW_ON_ERROR);
$config['outreach_data_directory']=$storage;
return $config;
`,{mode:0o600});
console.log('Isolierte Outreach-Testkonfiguration erzeugt; Versand nur an freigegebene Testadresse, max. 1/Tag.');
