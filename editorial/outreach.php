<?php
declare(strict_types=1);
require_once __DIR__.'/lib/auth.php';
require_once __DIR__.'/lib/outreach.php';
require_once __DIR__.'/lib/outreach-research.php';
editorial_send_security_headers();
editorial_start_session();
if (!editorial_is_authenticated($_SESSION,time())) { header('Location: /redaktion/',true,303); exit; }
$csrf=editorial_csrf_token($_SESSION);
$config=editorial_load_config()??[];
$error=null;
$notice=$_SESSION['outreach_notice']??null;
unset($_SESSION['outreach_notice']);
$db=null;
function oe(mixed $s): string { return htmlspecialchars((string)$s,ENT_QUOTES|ENT_SUBSTITUTE,'UTF-8'); }
function oform(string $action): void { global $csrf; ?><input type="hidden" name="csrf_token" value="<?= oe($csrf) ?>"><input type="hidden" name="action" value="<?= oe($action) ?>"><?php }
function odate(int $time): string { return (new DateTimeImmutable('@'.$time))->setTimezone(new DateTimeZone('Europe/Berlin'))->format('d.m.Y H:i'); }
function ostatus(string $s): string { return ['draft'=>'Entwurf','scheduled'=>'Geplant','paused'=>'Pausiert','cancelled'=>'Abgebrochen','completed'=>'Abgeschlossen','pending'=>'Wartet','sent'=>'SMTP angenommen','unknown'=>'Zustellung unklar – prüfen','blocked'=>'Blockiert','suppressed'=>'Abgemeldet','candidate'=>'Recherche','qualified'=>'Qualifiziert','replied'=>'Antwort erhalten','partner'=>'Partner','not_interested'=>'Kein Interesse'][$s]??$s; }
try {
    $db=outreach_db($config);
    if (($_SERVER['REQUEST_METHOD']??'GET')==='POST') {
        if (!editorial_valid_csrf($_SESSION,$_POST['csrf_token']??null)) throw new InvalidArgumentException('Sitzung abgelaufen. Bitte Seite neu laden.');
        $action=$_POST['action']??'';
        $lock=fopen($config['outreach_data_directory'].'/send.lock','c');
        if (!$lock || !flock($lock,LOCK_EX|LOCK_NB)) throw new RuntimeException('Ein Versand läuft. Bitte in einer Minute erneut versuchen.');
        try {
            switch ($action) {
                case 'contact': outreach_contact($db,$_POST); $message='Kontakt gespeichert.'; break;
                case 'research': $n=outreach_discover($db,(string)($_POST['category']??''),(string)($_POST['pool']??'')); $message="$n neue Recherchekandidaten ergänzt. Bitte Quellen und Zuständigkeit prüfen."; break;
                case 'template':
                    $subject=outreach_text($_POST['subject']??'',200); $body=outreach_text($_POST['body']??'',10000);
                    outreach_template($subject,$body);
                    outreach_sql($db,'INSERT INTO templates(name,subject,body) VALUES (?,?,?)',[outreach_text($_POST['name']??'',100),$subject,$body]);
                    outreach_audit($db,'template_created'); $message='Vorlage gespeichert.'; break;
                case 'campaign':
                    $id=outreach_campaign($db,$_POST,time());
                    $_SESSION['outreach_notice']='Entwurf erstellt. Bitte alle Empfänger und Texte prüfen.';
                    header('Location: /redaktion/outreach.php?campaign='.$id,true,303); exit;
                case 'approve':
                    if (!isset($_POST['confirmed'])) throw new InvalidArgumentException('Bitte Inhalte und Empfänger ausdrücklich bestätigen.');
                    outreach_campaign_status($db,(int)($_POST['id']??0),'approve'); $message='Kampagne freigegeben. Versand erfolgt nur bei aktiviertem Serverversand und eingerichtetem Zeitplan.'; break;
                case 'pause': case 'resume': case 'cancel':
                    outreach_campaign_status($db,(int)($_POST['id']??0),$action); $message='Kampagnenstatus aktualisiert.'; break;
                case 'suppress':
                    $email=strtolower(outreach_text($_POST['email']??'',254));
                    if (!filter_var($email,FILTER_VALIDATE_EMAIL)) throw new InvalidArgumentException('Ungültige Adresse.');
                    outreach_suppress($db,$email); $message='Adresse kampagnenübergreifend gesperrt.'; break;
                case 'reconcile':
                    outreach_reconcile($db,(int)($_POST['id']??0),(string)($_POST['state']??''),(string)($_POST['note']??''));
                    $message='Zustellung nach manueller Prüfung geklärt. Es wird keine neue Mail ausgelöst.'; break;
                default: throw new InvalidArgumentException('Unbekannte Aktion.');
            }
        } finally { flock($lock,LOCK_UN); fclose($lock); }
        $_SESSION['outreach_notice']=$message;
        header('Location: /redaktion/outreach.php',true,303); exit;
    }
} catch (InvalidArgumentException|RuntimeException $e) { $error=$e->getMessage(); }
catch (Throwable) { $error='Der Vorgang konnte nicht gespeichert werden. Bitte Eingaben und Serverkonfiguration prüfen.'; }
$contacts=$db ? $db->query('SELECT * FROM contacts ORDER BY researched_at DESC,id DESC LIMIT 500')->fetchAll(PDO::FETCH_ASSOC):[];
$templates=$db ? $db->query('SELECT * FROM templates ORDER BY id')->fetchAll(PDO::FETCH_ASSOC):[];
$campaigns=$db ? $db->query('SELECT c.*,COUNT(d.id) AS recipients,SUM(d.state=\'sent\') AS sent FROM campaigns c LEFT JOIN deliveries d ON d.campaign_id=c.id GROUP BY c.id ORDER BY c.id DESC LIMIT 100')->fetchAll(PDO::FETCH_ASSOC):[];
$selected=$db ? outreach_sql($db,'SELECT * FROM campaigns WHERE id=?',[(int)($_GET['campaign']??0)])->fetch(PDO::FETCH_ASSOC):false;
$edit=$db ? outreach_sql($db,'SELECT * FROM contacts WHERE id=?',[(int)($_GET['contact']??0)])->fetch(PDO::FETCH_ASSOC):false;
$template=$templates[0]??['subject'=>'','body'=>''];
foreach ($templates as $t) if ((int)$t['id']===(int)($_GET['template']??0)) $template=$t;
$eligible=count(array_filter($contacts,fn($c)=>outreach_eligible($db,$c,time())));
?><!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Kontakte & Kampagnen · Krankenfahrten</title><link rel="stylesheet" href="/redaktion/assets/outreach.css"></head><body>
<header class="topbar"><a href="/redaktion/"><img src="/redaktion/assets/logo.svg" width="180" height="52" alt="Krankenfahrten Bad Homburg"></a><nav aria-label="Backend"><a href="/redaktion/">Redaktion</a><a href="/redaktion/outreach.php" aria-current="page">Kontakte & Kampagnen</a></nav></header>
<main class="outreach"><div class="intro"><div><p class="eyebrow">PARTNER GEWINNEN · REGIONAL</p><h1>Kontakte & Kampagnen</h1><p>Von der passenden Einrichtung zum persönlichen Gespräch.</p></div><a class="button" href="#campaign">Kampagne planen</a></div>
<?php if ($error): ?><p role="alert" class="alert"><?= oe($error) ?></p><?php endif; ?>
<?php if ($notice): ?><p role="status" class="notice"><?= oe($notice) ?></p><?php endif; ?>
<div class="stats"><article><strong><?= count($contacts) ?></strong><span>Kontakte in der Übersicht</span></article><article><strong><?= $eligible ?></strong><span>Versandberechtigt</span></article><article><strong><?= count($campaigns) ?></strong><span>Kampagnen</span></article><article><strong><?= ($config['outreach_send_enabled']??false)===true?'Aktiv':'Aus' ?></strong><span>Serverversand · max. <?= max(1,min(50,(int)($config['outreach_daily_limit']??20))) ?>/Tag</span></article></div>
<?php if ($db): ?>
<?php $lastWorker=(int)outreach_sql($db,"SELECT value FROM settings WHERE key='worker_last'")->fetchColumn(); ?>
<p class="small">Letzte Zeitplanprüfung: <?= $lastWorker?oe(odate($lastWorker)):'Noch kein Aufruf – Automatik ist noch nicht nachgewiesen.' ?></p>
<nav class="tabs" aria-label="Arbeitsbereiche"><a href="#research">1 · Recherchieren</a><a href="#contacts">2 · Qualifizieren</a><a href="#campaign">3 · Planen</a><a href="#pipeline">4 · Verfolgen</a></nav>
<?php if ($selected): $deliveries=outreach_sql($db,'SELECT * FROM deliveries WHERE campaign_id=? ORDER BY due_at,id',[$selected['id']])->fetchAll(PDO::FETCH_ASSOC); ?>
<section class="panel" id="preview"><p class="eyebrow">KAMPAGNENVORSCHAU · <?= oe(ostatus($selected['status'])) ?></p><h2><?= oe($selected['name']) ?></h2><p><?= count($deliveries) ?> Empfänger · <?= (int)$selected['days'] ?> Tage · Jeder Kontakt erhält genau eine Nachricht. Zeitangaben: Europe/Berlin.</p>
<?php foreach ($deliveries as $d): ?><details><summary><?= oe(odate((int)$d['due_at'])) ?> · <?= oe($d['organisation']) ?> · <?= oe(ostatus($d['state'])) ?></summary><p>An: <?= oe($d['email']) ?></p><h3><?= oe($d['subject']) ?></h3><pre><?= oe($d['body']) ?></pre><pre><?= oe($config['outreach_sender_footer']??'Absenderangaben müssen vor dem Versand serverseitig ergänzt werden.') ?></pre><p>Abmeldelink und Hinweis auf Abmeldung per Antwort werden angefügt.</p></details><?php endforeach; ?>
<?php if ($selected['status']==='draft'): ?><form method="post"><?php oform('approve'); ?><input type="hidden" name="id" value="<?= (int)$selected['id'] ?>"><label class="check"><input required type="checkbox" name="confirmed">Ich habe Empfänger, Versandgrundlagen, Termine und personalisierte Texte geprüft und gebe diese Kampagne frei.</label><button>Kampagne freigeben</button></form><?php endif; ?>
<?php foreach ($deliveries as $d): if ($d['state']!=='unknown') continue; ?><details><summary>Unklare Zustellung klären: <?= oe($d['organisation']) ?></summary><form method="post"><?php oform('reconcile'); ?><input type="hidden" name="id" value="<?= (int)$d['id'] ?>"><label>Ergebnis nach Postfach-/SMTP-Prüfung<select name="state"><option value="failed">Nicht versendet – abschließen ohne Wiederholung</option><option value="sent">SMTP-Annahme bestätigt</option></select></label><label>Prüfnachweis<textarea name="note" required minlength="20" maxlength="1000" rows="3"></textarea></label><button>Prüfung dokumentieren</button></form></details><?php endforeach; ?>
<?php foreach (['scheduled'=>['pause'=>'Pausieren'],'paused'=>['resume'=>'Fortsetzen','cancel'=>'Abbrechen']][$selected['status']]??[] as $action=>$label): ?><form class="inline" method="post"><?php oform($action); ?><input type="hidden" name="id" value="<?= (int)$selected['id'] ?>"><button><?= oe($label) ?></button></form><?php endforeach; ?></section>
<?php endif; ?>
<section class="panel" id="research"><h2>Passende Organisationen finden</h2><p>Umkreis von 15 km um Bad Homburg. Das ist der Suchbereich, keine Zusage zum Einsatzgebiet. Ergebnisse sind unbestätigte Kandidaten; Firmen werden zusätzlich auf tatsächlichen Fahrtbedarf geprüft.</p><form method="post" class="grid"><?php oform('research'); ?><label>Schwerpunkt<select name="category"><?php foreach (['Kliniken','Arztpraxen','Pflegeeinrichtungen','Therapie','Unternehmen'] as $v): ?><option><?= oe($v) ?></option><?php endforeach; ?></select></label><label>In Kontaktpool übernehmen<input name="pool" maxlength="100" required placeholder="z. B. Kliniken Hochtaunus"></label><button>Region durchsuchen</button></form><p class="small">Quelle: <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap-Mitwirkende · ODbL</a>. Keine Garantie auf Vollständigkeit; eine Recherche pro Minute, bis zu 150 Treffer. Keine kostenpflichtige KI-Recherche.</p></section>
<section class="panel" id="contacts"><h2>Kontaktpool & Pipeline</h2><p>Recherche → Qualifiziert → Antwort erhalten → Partner. „Kein Interesse“ sperrt die Adresse für weitere Kampagnen.</p>
<div class="table-wrap"><table><thead><tr><th>Organisation / Pool</th><th>Kontakt</th><th>Pipeline</th><th>Versand</th><th>Bearbeiten</th></tr></thead><tbody><?php foreach ($contacts as $c): ?><tr><td><strong><?= oe($c['organisation']) ?></strong><br><?= oe($c['category'].' · '.$c['pool']) ?></td><td><?= oe($c['email']?:'E-Mail fehlt') ?><br><a target="_blank" rel="noopener noreferrer" href="<?= oe($c['source']) ?>">Quelle prüfen</a></td><td><?= oe(ostatus($c['stage'])) ?></td><td><span class="badge"><?= outreach_eligible($db,$c,time())?'Berechtigt':'Nicht freigegeben' ?></span></td><td><a href="?contact=<?= (int)$c['id'] ?>#contact-form">Prüfen</a></td></tr><?php endforeach; ?><?php if (!$contacts): ?><tr><td colspan="5">Noch keine Kontakte. Starte die regionale Recherche oder lege einen Kontakt an.</td></tr><?php endif; ?></tbody></table></div>
<details id="contact-form" <?= $edit?'open':'' ?>><summary><?= $edit?'Kontakt prüfen: '.oe($edit['organisation']):'Kontakt manuell hinzufügen' ?></summary><form method="post"><?php oform('contact'); ?><input type="hidden" name="id" value="<?= (int)($edit['id']??0) ?>"><div class="grid">
<?php foreach (['organisation'=>'Organisation','category'=>'Kategorie','pool'=>'Kontaktpool','email'=>'E-Mail','address'=>'Postanschrift','website'=>'Website','source'=>'Quellen-URL'] as $key=>$label): ?><label><?= oe($label) ?><input name="<?= $key ?>" value="<?= oe($edit[$key]??'') ?>" type="<?= in_array($key,['website','source'])?'url':($key==='email'?'email':'text') ?>" <?= in_array($key,['organisation','category','pool','source'])?'required':'' ?> maxlength="<?= in_array($key,['source','website'])?1000:($key==='address'?500:($key==='email'?254:($key==='organisation'?200:100))) ?>"></label><?php endforeach; ?>
<label>Pipeline<select name="stage"><?php foreach (['candidate','qualified','replied','partner','not_interested'] as $v): ?><option value="<?= $v ?>" <?= ($edit['stage']??'candidate')===$v?'selected':'' ?>><?= oe(ostatus($v)) ?></option><?php endforeach; ?></select></label>
<label>Versandgrundlage<select name="permission"><?php foreach (['none'=>'Keine – nur Recherche','consent'=>'Ausdrückliche Einwilligung','customer_exception'=>'Geprüfte Bestandskunden-Ausnahme'] as $v=>$label): ?><option value="<?= $v ?>" <?= ($edit['permission']??'none')===$v?'selected':'' ?>><?= oe($label) ?></option><?php endforeach; ?></select></label></div>
<label>Nachweis: Datum, Herkunft, Empfängeradresse und erlaubter Inhalt<textarea name="evidence" maxlength="2000" rows="3" placeholder="Keine Gesundheitsdaten eintragen."><?= oe($edit['evidence']??'') ?></textarea></label>
<label class="check"><input type="checkbox" name="verified">Organisation, Zuständigkeit und E-Mail anhand der Originalquelle heute geprüft. Gültig für 90 Tage.</label>
<label class="check"><input type="checkbox" name="customer_checks">Nur bei Bestandskunden: Adresse beim Verkauf erhalten; eigene ähnliche Leistungen; kein Widerspruch; Widerspruchshinweis bei Erhebung und jeder Verwendung.</label><p class="small">Eine öffentlich genannte E-Mail-Adresse ist keine Werbeeinwilligung. <a href="https://www.gesetze-im-internet.de/uwg_2004/__7.html" target="_blank" rel="noopener noreferrer">§ 7 UWG</a>. Die Speicherung von Kontakten und Informationspflichten sind gesondert zu prüfen.</p><button>Kontakt speichern</button></form></details>
<details><summary>Adresse sperren / Rückmeldung erfassen</summary><form method="post"><?php oform('suppress'); ?><label>E-Mail-Adresse<input type="email" name="email" required></label><button>Für alle Kampagnen sperren</button></form><p>Antworten kommen im Absenderpostfach an. Nach Antwort den Kontakt auf „Antwort erhalten“ setzen; nach Ablehnung sperren. Es gibt keinen automatischen Postfacheingang.</p></details></section>
<section class="panel" id="campaign"><h2>Kampagne planen</h2><p>Pool auswählen, Vorlage anpassen, Zeitraum festlegen. Danach erscheinen die konkreten Empfänger und Mailtexte zur Freigabe. Ungeprüfte oder gesperrte Kontakte werden ausgeschlossen.</p><div class="template-links"><?php foreach ($templates as $t): ?><a href="?template=<?= (int)$t['id'] ?>#campaign"><?= oe($t['name']) ?></a><?php endforeach; ?></div>
<form method="post"><?php oform('campaign'); ?><div class="grid"><label>Kampagnenname<input name="name" maxlength="200" required placeholder="Kliniken · Vorstellung September"></label><label>Kontaktpool<select name="pool" required><option value="">Bitte wählen</option><?php foreach ($db->query('SELECT DISTINCT pool FROM contacts ORDER BY pool') as $p): ?><option><?= oe($p['pool']) ?></option><?php endforeach; ?></select></label><label>Startdatum<input type="date" name="start_date" min="<?= date('Y-m-d') ?>" required></label><label>Verteilen auf Tage<input type="number" name="days" min="1" max="14" value="3" required></label></div><label>Betreff<input name="subject" maxlength="200" value="<?= oe($template['subject']) ?>" required></label><label>Mailtext<textarea name="body" rows="10" maxlength="10000" required><?= oe($template['body']) ?></textarea></label><p class="small">{{organisation}} wird ersetzt. Eine Nachricht pro Empfänger; Planung jeweils ab 09:00 Uhr Berliner Zeit, auch am Wochenende. Maximal 50 pro Kampagnentag, zusätzlich gilt das globale Tageslimit. Bereits in den letzten 30 Tagen kontaktierte Adressen werden beim Versand blockiert.</p><button>Empfänger & Texte prüfen</button></form>
<details><summary>Eigene Vorlage anlegen</summary><form method="post"><?php oform('template'); ?><label>Name<input name="name" required maxlength="100"></label><label>Betreff<input name="subject" required maxlength="200"></label><label>Text<textarea name="body" required maxlength="10000" rows="6"></textarea></label><button>Vorlage speichern</button></form></details></section>
<section class="panel" id="pipeline"><h2>Kampagnen verfolgen</h2><div class="table-wrap"><table><thead><tr><th>Kampagne</th><th>Status</th><th>Start</th><th>SMTP angenommen</th><th>Details</th></tr></thead><tbody><?php foreach ($campaigns as $c): ?><tr><td><?= oe($c['name']) ?></td><td><?= oe(ostatus($c['status'])) ?></td><td><?= oe($c['start_date']) ?></td><td><?= (int)$c['sent'] ?> / <?= (int)$c['recipients'] ?></td><td><a href="?campaign=<?= (int)$c['id'] ?>#preview">Öffnen</a></td></tr><?php endforeach; ?></tbody></table></div><p class="small">SMTP-Annahme bestätigt keine Posteingangszustellung. Kein Öffnungs- oder Klicktracking. Unklare Zustellungen werden nicht automatisch wiederholt. Mehr als 24 Stunden überfällige Nachrichten werden zur Prüfung blockiert.</p></section>
<?php else: ?><section class="panel"><h2>Einrichtung erforderlich</h2><p>Der Backend-Code ist vorhanden. Für die Speicherung braucht der Server PDO SQLite und einen privaten, beschreibbaren Datenordner. Bis dahin sind Kontaktverwaltung und Kampagnen deaktiviert.</p></section><?php endif; ?>
</main></body></html>
