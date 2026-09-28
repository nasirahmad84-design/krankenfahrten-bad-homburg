<?php
declare(strict_types=1);
require_once __DIR__.'/lib/auth.php';
require_once __DIR__.'/lib/outreach.php';
editorial_send_security_headers();
header('Content-Type: application/json; charset=UTF-8');
if (($_SERVER['REQUEST_METHOD']??'')!=='POST') { http_response_code(405); header('Allow: POST'); exit; }
$config=editorial_load_config()??[];
$secret=$config['outreach_runner_token']??'';
$given=$_SERVER['HTTP_AUTHORIZATION']??$_SERVER['REDIRECT_HTTP_AUTHORIZATION']??'';
if (!is_string($secret) || strlen($secret)<32 || !hash_equals('Bearer '.$secret,$given)) { http_response_code(403); exit; }
try {
    $db=outreach_db($config);
    // Prevent concurrent workers and pause/unsubscribe racing a send.
    $lock=fopen($config['outreach_data_directory'].'/send.lock','c');
    if (!$lock || !flock($lock,LOCK_EX|LOCK_NB)) { http_response_code(409); exit; }
    $input=json_decode(file_get_contents('php://input'),true)??[];
    $action=$input['action']??'run';
    if (in_array($action,['setup_test','test_status','research_test'],true) && ($config['outreach_test_recipient']??'')!=='nahmad@outlook.de') throw new RuntimeException('Nur isolierter Testmodus.');
    if ($action==='setup_test') {
        $existing=outreach_sql($db,"SELECT value FROM settings WHERE key='internal_test_campaign'")->fetchColumn();
        if (!$existing) {
            outreach_contact($db,['organisation'=>'Nasir Ahmad – interner Funktionstest','category'=>'Interner Test','pool'=>'Interner Test',
                'email'=>$config['outreach_test_recipient'],'source'=>'https://krankenfahrten-bad-homburg.de/#interner-outreach-test',
                'permission'=>'consent','evidence'=>'Explizite Nutzerfreigabe am 28.09.2026 im Projektchat: Testmail an nahmad@outlook.de. Keine Freigabe für Werbung.',
                'verified'=>'1','stage'=>'qualified']);
            $id=outreach_campaign($db,['name'=>'Interner Outreach-Funktionstest','pool'=>'Interner Test',
                'start_date'=>(new DateTimeImmutable('now',new DateTimeZone('Europe/Berlin')))->format('Y-m-d'),'days'=>1,
                'subject'=>'Outreach funktioniert – interner Test Krankenfahrten Bad Homburg',
                'body'=>"Hallo Nasir,\n\ndas ist die von dir freigegebene Testmail aus dem neuen Modul Kontakte & Kampagnen.\n\nDie Nachricht wurde über eine freigegebene Kampagne aus der Testumgebung versendet. Firmenkontakte werden nicht angeschrieben.\n\nWir prüfen dabei Personalisierung, Versandhistorie und Abmeldung. Der Abmeldelink kann deshalb beim späteren Öffnen bereits als getestet und abgemeldet gelten.\n\nViele Grüße\nKrankenfahrten Bad Homburg"],time());
            outreach_campaign_status($db,$id,'approve');
            outreach_sql($db,"INSERT INTO settings(key,value) VALUES ('internal_test_campaign',?)",[(string)$id]);
        }
        $result=['status'=>'test_ready'];
    } elseif ($action==='test_status') {
        $id=outreach_sql($db,"SELECT value FROM settings WHERE key='internal_test_campaign'")->fetchColumn();
        $d=outreach_sql($db,'SELECT state,unsubscribe_token FROM deliveries WHERE campaign_id=?',[$id?:0])->fetch(PDO::FETCH_ASSOC);
        $result=['status'=>$d['state']??'missing','unsubscribe_url'=>$d?rtrim($config['outreach_public_base_url'],'/').'/outreach-unsubscribe.php?token='.$d['unsubscribe_token']:null];
    } elseif ($action==='diagnostics') {
        $result=['status'=>'diagnostics','pdo_sqlite'=>extension_loaded('pdo_sqlite'),'openssl'=>extension_loaded('openssl')];
        try {
            $mailer=outreach_mailer($config);
            $result['smtp_config']='valid';
            $result['smtp_connect']=$mailer->smtpConnect();
            $mailer->smtpClose();
        } catch (Throwable $e) {
            $result['exception_class']=get_class($e);
            $message=$e->getMessage();
            $result['reason']=str_contains($message,'SMTP-Konfiguration')?'smtp_config':(str_contains($message,'authenticate')?'smtp_auth':(str_contains($message,'connect')?'smtp_connect':(str_contains($message,'undefined function')?'missing_function':(str_contains($message,'Class')?'missing_class':'other'))));
        }
        $id=outreach_sql($db,"SELECT value FROM settings WHERE key='internal_test_campaign'")->fetchColumn();
        $result['test_state']=outreach_sql($db,'SELECT state FROM deliveries WHERE campaign_id=?',[$id?:0])->fetchColumn();
    } elseif ($action==='research_test') {
        require_once __DIR__.'/lib/outreach-research.php';
        $result=['status'=>'researched','imported'=>outreach_discover($db,'Kliniken','Kliniken – Recherche')];
    } elseif ($action==='run') {
        $result=outreach_run($db,$config,time());
    } else { throw new RuntimeException('Unbekannte Aktion.'); }
    if ($result['status']==='needs_review') http_response_code(503);
    echo json_encode($result,JSON_THROW_ON_ERROR);
    flock($lock,LOCK_UN); fclose($lock);
} catch (Throwable) { http_response_code(503); echo '{"error":"Outreach derzeit nicht verfügbar"}'; }
