<?php
declare(strict_types=1);
require_once __DIR__.'/lib/auth.php';
require_once __DIR__.'/lib/outreach.php';
editorial_send_security_headers();
$token=$_GET['token']??'';
$valid=is_string($token) && preg_match('/^[a-f0-9]{64}$/D',$token);
$done=false;
try {
    $config=editorial_load_config()??[];
    $db=outreach_db($config);
    $email=$valid ? outreach_sql($db,'SELECT email FROM deliveries WHERE unsubscribe_token=?',[$token])->fetchColumn() : false;
    if (!$email) { http_response_code(400); $valid=false; }
    elseif (($_SERVER['REQUEST_METHOD']??'GET')==='POST') {
        $lock=fopen($config['outreach_data_directory'].'/send.lock','c');
        if (!$lock || !flock($lock,LOCK_EX)) throw new RuntimeException('busy');
        outreach_suppress($db,$email);
        flock($lock,LOCK_UN); fclose($lock);
        $done=true;
    }
} catch (Throwable) { http_response_code(503); $valid=false; }
?><!doctype html><html lang="de"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informationen abbestellen</title><link rel="stylesheet" href="/redaktion/assets/outreach.css"><main class="outreach"><h1>Informationen abbestellen</h1>
<?php if ($done): ?><p>Ihre Adresse ist für weitere Kampagnen gesperrt.</p>
<?php elseif ($valid): ?><p>Möchten Sie keine weiteren Informations- und Angebotsmails von Krankenfahrten Bad Homburg erhalten?</p><form method="post"><button>Ja, abmelden</button></form>
<?php else: ?><p>Dieser Link ist ungültig oder derzeit nicht verfügbar. Sie können auch auf die erhaltene Mail mit „Abmelden“ antworten.</p><?php endif; ?></main></html>
