<?php
declare(strict_types=1);
require_once __DIR__.'/../../editorial/lib/outreach.php';
require_once __DIR__.'/../../editorial/lib/outreach-research.php';
function check(bool $ok,string $message): void { if (!$ok) throw new RuntimeException($message); }
function rejects(callable $fn,string $message): void { try { $fn(); } catch (Throwable) { return; } throw new RuntimeException($message); }
$db=new PDO('sqlite::memory:'); outreach_schema($db);
$now=time();
$date=(new DateTimeImmutable('@'.$now))->setTimezone(new DateTimeZone('Europe/Berlin'))->format('Y-m-d');
$contact=['organisation'=>'Testklinik','category'=>'Kliniken','pool'=>'XYZ','email'=>'test@example.org','source'=>'https://example.org/kontakt','verified'=>'1','permission'=>'consent','evidence'=>'2026-09-28: dokumentierte Einwilligung für Informationen und Angebote.','stage'=>'qualified'];
outreach_contact($db,$contact);
outreach_contact($db,[...$contact,'source'=>'https://example.org/zweite','organisation'=>'Zweite Einrichtung']);
outreach_contact($db,[...$contact,'source'=>'https://example.org/no-consent','email'=>'excluded@example.org','permission'=>'none']);
rejects(fn()=>outreach_contact($db,[...$contact,'source'=>'https://example.org/bad','evidence'=>'ja']),'Missing evidence accepted');
rejects(fn()=>outreach_contact($db,[...$contact,'source'=>'https://example.org/bad','permission'=>'customer_exception']),'Customer exception without checks');
rejects(fn()=>outreach_template("Subject\nBcc: evil@example.org",'Text'),'Header injection');
rejects(fn()=>outreach_template('Subject','{{diagnose}}'),'Unknown placeholder');
$draft=['name'=>'Drei Tage','pool'=>'XYZ','start_date'=>$date,'days'=>3,'subject'=>'Information für {{organisation}}','body'=>'Guten Tag {{organisation}}, hier sind Informationen.'];
$id=outreach_campaign($db,$draft,$now);
check((int)$db->query('SELECT COUNT(*) FROM deliveries')->fetchColumn()===1,'Dedupe / consent selection');
check($db->query('SELECT subject FROM deliveries')->fetchColumn()==='Information für Testklinik','Personalisation');
$calls=0;
$sender=function()use(&$calls){$calls++;return true;};
$config=['outreach_send_enabled'=>true,'outreach_public_base_url'=>'https://example.org/redaktion','outreach_sender_footer'=>'Testunternehmen, Inhaber Test, Teststraße 1, 12345 Teststadt, E-Mail test@example.org'];
$due=(int)$db->query('SELECT due_at FROM deliveries')->fetchColumn();
outreach_run($db,$config,$due,$sender);
check($calls===0,'Draft sent');
outreach_campaign_status($db,$id,'approve');
outreach_run($db,[...$config,'outreach_send_enabled'=>false],$due,$sender);
check($calls===0,'Disabled worker sent');
outreach_campaign_status($db,$id,'pause');
outreach_run($db,$config,$due,$sender);
check($calls===0,'Paused campaign sent');
outreach_campaign_status($db,$id,'resume');
outreach_run($db,$config,$due,$sender);
outreach_run($db,$config,$due,$sender);
check($calls===1,'Idempotency');
check($db->query('SELECT state FROM deliveries')->fetchColumn()==='sent','Sent state');
$id2=outreach_campaign($db,$draft,$now); outreach_campaign_status($db,$id2,'approve');
outreach_run($db,$config,$due,$sender);
check($calls===1,'Cross-campaign cooldown');
// Import never overwrites approvals, never grants permission, and rejects unsafe links.
$elements=[['type'=>'node','id'=>123,'tags'=>['name'=>'OSM Klinik','email'=>'osm@example.org','website'=>'javascript:alert(1)']]];
check(outreach_import_osm($db,$elements,'Kliniken','Research')===1,'Import');
check(outreach_import_osm($db,$elements,'Kliniken','Research')===0,'Import dedupe');
$imported=$db->query("SELECT * FROM contacts WHERE pool='Research'")->fetch(PDO::FETCH_ASSOC);
check($imported['permission']==='none' && $imported['website']==='' && $imported['verified_at']===null,'Unsafe imported record');
// Unknown SMTP outcomes are terminal pending manual reconciliation.
outreach_contact($db,[...$contact,'email'=>'uncertain@example.org','source'=>'https://example.org/unknown','pool'=>'Unknown']);
$id3=outreach_campaign($db,[...$draft,'pool'=>'Unknown'],$now); outreach_campaign_status($db,$id3,'approve');
$failed=0;$fail=function()use(&$failed){$failed++;throw new RuntimeException('SMTP ambiguous');};
outreach_run($db,$config,$due,$fail);outreach_run($db,$config,$due,$fail);
check($failed===1,'Ambiguous retry');
$unknownId=(int)$db->query("SELECT id FROM deliveries WHERE state='unknown'")->fetchColumn();
outreach_reconcile($db,$unknownId,'failed','SMTP-Protokoll geprüft: keine Übernahme durch Server.');
rejects(fn()=>outreach_reconcile($db,$unknownId,'sent','SMTP-Protokoll erneut geprüft.'),'Duplicate reconciliation');
outreach_contact($db,[...$contact,'email'=>'stop@example.org','source'=>'https://example.org/stop','pool'=>'Stop']);
$id4=outreach_campaign($db,[...$draft,'pool'=>'Stop'],$now);outreach_campaign_status($db,$id4,'approve');
outreach_suppress($db,'stop@example.org');outreach_run($db,$config,$due,$sender);
check($calls===1,'Unsubscribe failed');
outreach_contact($db,[...$contact,'email'=>'changed@example.org','source'=>'https://example.org/changed','pool'=>'Changed']);
$id5=outreach_campaign($db,[...$draft,'pool'=>'Changed'],$now);outreach_campaign_status($db,$id5,'approve');
$db->exec("UPDATE contacts SET permission='none' WHERE pool='Changed'");outreach_run($db,$config,$due,$sender);
check($calls===1,'Revocation ignored');
// Distribution spans calendar days, preserving 09:00 across DST boundaries.
for($i=0;$i<6;$i++) outreach_contact($db,[...$contact,'email'=>"day$i@example.org",'source'=>"https://example.org/day$i",'pool'=>'Dates']);
$future=max($date,'2026-10-24');
$id6=outreach_campaign($db,[...$draft,'pool'=>'Dates','start_date'=>$future],$now);
$dates=outreach_sql($db,'SELECT due_at FROM deliveries WHERE campaign_id=?',[$id6])->fetchAll(PDO::FETCH_COLUMN);
check(count(array_unique($dates))===3,'Three day distribution');
foreach($dates as $stamp)check((new DateTimeImmutable('@'.$stamp))->setTimezone(new DateTimeZone('Europe/Berlin'))->format('H:i')==='09:00','DST scheduling');
// Global cap applies across campaigns and includes unknown attempts.
outreach_campaign_status($db,$id6,'approve');
$db->exec('UPDATE deliveries SET attempted_at=NULL WHERE campaign_id!='.$id6);
$before=$calls;outreach_run($db,[...$config,'outreach_daily_limit'=>1],min($dates),$sender);
outreach_run($db,[...$config,'outreach_daily_limit'=>1],min($dates),$sender);
check($calls===$before+1,'Daily limit ignored');
echo "Outreach geprüft: Berechtigungen, Deduplizierung, Freigabe, Pause, Wiederanlauf, Sperren, Import, Personalisierung, Tageslimit und Kalenderplanung. Keine echte Mail versendet.\n";
