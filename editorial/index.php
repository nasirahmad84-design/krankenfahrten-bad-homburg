<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/auth.php';

editorial_send_security_headers();
editorial_start_session();

$now = time();
$config = editorial_load_config();
$notice = null;
$error = null;

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    if (!editorial_valid_csrf($_SESSION, $_POST['csrf_token'] ?? null)) {
        $error = 'Die Sitzung ist abgelaufen. Bitte versuche es erneut.';
    } else {
        $action = $_POST['action'] ?? '';
        if ($action === 'request_code') {
            if ($config !== null && editorial_issue_code($_SESSION, $_SERVER, $config, $now)) {
                $notice = 'Wenn der Versand möglich war, wurde ein neuer Code an das hinterlegte Postfach gesendet.';
            } else {
                $error = 'Der Code konnte derzeit nicht versendet werden. Bitte versuche es später erneut.';
            }
        } elseif ($action === 'verify_code') {
            $salt = $config !== null ? editorial_login_salt($config) : null;
            $code = is_string($_POST['code'] ?? null) ? trim($_POST['code']) : '';
            if ($salt !== null && editorial_verify_code($_SESSION, $code, $salt, $now)) {
                session_regenerate_id(true);
                header('Location: /redaktion/', true, 303);
                exit;
            }
            $error = 'Der Code ist ungültig oder abgelaufen.';
        } elseif ($action === 'logout' && editorial_is_authenticated($_SESSION, $now)) {
            editorial_logout();
            header('Location: /redaktion/', true, 303);
            exit;
        }
    }
}

$authenticated = editorial_is_authenticated($_SESSION, $now);
$csrfToken = editorial_csrf_token($_SESSION);

function editorial_escape(mixed $value): string
{
    return htmlspecialchars((string) ($value ?? ''), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function editorial_date(mixed $value): string
{
    if (!is_string($value) || preg_match('/^\d{4}-\d{2}-\d{2}$/D', $value) !== 1) return editorial_escape($value);
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('Europe/Berlin'));
    if (!$date) return editorial_escape($value);
    $months = [1 => 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    return $date->format('d.') . ' ' . $months[(int) $date->format('n')] . ' ' . $date->format('Y');
}

function editorial_status_badge(string $status): string
{
    $labels = [
        'draft_ready' => 'Freigabe ausstehend',
        'approved_for_publish' => 'Zur Veröffentlichung freigegeben',
        'blocked' => 'Blockiert',
        'rejected' => 'Abgelehnt',
    ];
    $modifier = $status === 'approved_for_publish' ? 'approved' : (in_array($status, ['blocked', 'rejected'], true) ? 'blocked' : 'pending');
    return '<span class="status-badge status-' . $modifier . '">' . editorial_escape($labels[$status] ?? $status) . '</span>';
}

function editorial_link_text(string $text): string
{
    $escaped = editorial_escape($text);
    return preg_replace_callback(
        '#https://[^\s&lt;]+#',
        static fn(array $match): string => '<a href="' . editorial_escape(html_entity_decode($match[0], ENT_QUOTES, 'UTF-8')) . '" target="_blank" rel="noopener noreferrer">' . $match[0] . '</a>',
        $escaped,
    ) ?? $escaped;
}

function editorial_research_brief(string $markdown): string
{
    $output = [];
    $listOpen = false;
    foreach (preg_split('/\R/', $markdown) ?: [] as $rawLine) {
        $line = trim($rawLine);
        if ($line === '') {
            if ($listOpen) $output[] = '</ul>';
            $listOpen = false;
        } elseif (str_starts_with($line, '# ')) {
            continue;
        } elseif (str_starts_with($line, '## ')) {
            if ($listOpen) $output[] = '</ul>';
            $listOpen = false;
            $output[] = '<h3>' . editorial_escape(substr($line, 3)) . '</h3>';
        } elseif (str_starts_with($line, '- ')) {
            if (!$listOpen) $output[] = '<ul>';
            $listOpen = true;
            $output[] = '<li>' . editorial_link_text(substr($line, 2)) . '</li>';
        } else {
            if ($listOpen) $output[] = '</ul>';
            $listOpen = false;
            $output[] = '<p>' . editorial_link_text($line) . '</p>';
        }
    }
    if ($listOpen) $output[] = '</ul>';
    return implode("\n", $output);
}

function editorial_page_start(string $title, bool $authenticated, string $csrfToken): void
{
    ?><!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title><?= editorial_escape($title) ?> | Redaktionscockpit</title>
  <link rel="stylesheet" href="/redaktion/assets/editorial.css">
</head>
<body>
  <a class="skip-link" href="#main">Zum Inhalt springen</a>
  <header class="site-header">
    <div class="shell header-inner">
      <a class="brand" href="/redaktion/" aria-label="Zur Redaktionsübersicht"><img src="/redaktion/assets/logo.svg" alt="Krankenfahrten Bad Homburg" width="210" height="60"></a>
      <div class="header-actions">
        <div class="header-label"><strong>Redaktionscockpit</strong><span>Interne Vorschau · Testdomain</span></div>
        <?php if ($authenticated): ?>
          <form method="post" action="/redaktion/" class="logout-form">
            <input type="hidden" name="csrf_token" value="<?= editorial_escape($csrfToken) ?>">
            <input type="hidden" name="action" value="logout">
            <button type="submit" class="text-button">Abmelden</button>
          </form>
        <?php endif; ?>
      </div>
    </div>
  </header>
  <main id="main">
<?php
}

function editorial_page_end(): void
{
    ?></main>
  <footer class="site-footer"><div class="shell"><p>Interne Arbeitsansicht. Entwürfe sind nicht zur Veröffentlichung freigegeben, solange ihr Status dies nicht ausdrücklich ausweist.</p></div></footer>
</body>
</html><?php
}

function editorial_render_login(?array $config, string $csrfToken, ?string $notice, ?string $error): void
{
    editorial_page_start('Anmeldung', false, $csrfToken);
    $recipient = $config !== null && is_string($config['mail_to'] ?? null) ? editorial_mask_email($config['mail_to']) : 'das hinterlegte Postfach';
    $codePending = isset($_SESSION['otp_hash'], $_SESSION['otp_expires_at']) && is_int($_SESSION['otp_expires_at']) && $_SESSION['otp_expires_at'] >= time();
    ?>
    <section class="login-section">
      <div class="shell login-shell">
        <div class="login-card">
          <p class="eyebrow">Geschützter Bereich</p>
          <h1>Redaktionscockpit öffnen</h1>
          <p class="lead">Der Zugang erfolgt mit einem einmaligen sechsstelligen Code an <?= editorial_escape($recipient) ?>.</p>
          <?php if ($notice): ?><div class="flash flash-success" role="status"><?= editorial_escape($notice) ?></div><?php endif; ?>
          <?php if ($error): ?><div class="flash flash-error" role="alert"><?= editorial_escape($error) ?></div><?php endif; ?>

          <?php if ($codePending): ?>
            <form method="post" action="/redaktion/" class="login-form">
              <input type="hidden" name="csrf_token" value="<?= editorial_escape($csrfToken) ?>">
              <input type="hidden" name="action" value="verify_code">
              <label for="code">Anmeldecode</label>
              <input id="code" name="code" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" required autofocus>
              <button type="submit" class="button">Anmelden</button>
            </form>
            <form method="post" action="/redaktion/" class="resend-form">
              <input type="hidden" name="csrf_token" value="<?= editorial_escape($csrfToken) ?>">
              <input type="hidden" name="action" value="request_code">
              <button type="submit" class="text-button">Code erneut senden</button>
            </form>
          <?php else: ?>
            <form method="post" action="/redaktion/" class="login-form">
              <input type="hidden" name="csrf_token" value="<?= editorial_escape($csrfToken) ?>">
              <input type="hidden" name="action" value="request_code">
              <button type="submit" class="button">Einmalcode anfordern</button>
            </form>
          <?php endif; ?>
          <p class="login-note">Der Code gilt 10 Minuten und nur einmal. Für die Anmeldung wird ausschließlich ein technisch notwendiges, sitzungsbezogenes Cookie gesetzt.</p>
        </div>
      </div>
    </section>
    <?php
    editorial_page_end();
}

function editorial_render_index(array $runs, string $csrfToken): void
{
    editorial_page_start('Artikelübersicht', true, $csrfToken);
    $pending = count(array_filter($runs, static fn(array $run): bool => ($run['status']['status'] ?? '') === 'draft_ready'));
    ?>
    <section class="hero compact-hero"><div class="shell narrow">
      <p class="eyebrow">Interne Redaktion</p><h1>Vorbereitete Ratgeberartikel</h1>
      <p class="lead">Hier kannst du alle Artikel vollständig lesen, Quellen und Kernaussagen prüfen und anschließend eine Freigabe erteilen.</p>
      <div class="summary-strip" aria-label="Redaktionsstatus"><div><strong><?= count($runs) ?></strong><span>Artikel im Batch</span></div><div><strong><?= $pending ?></strong><span>Freigaben ausstehend</span></div><div><strong>2×</strong><span>pro Woche geplant</span></div></div>
    </div></section>
    <section class="section"><div class="shell">
      <div class="section-heading"><div><p class="eyebrow">Redaktionsplan</p><h2>Montag und Donnerstag</h2></div><p>Die Sortierung folgt dem geplanten Veröffentlichungsdatum. Ein Entwurf bleibt technisch gesperrt, bis die Betreiberfreigabe im Repository dokumentiert ist.</p></div>
      <div class="article-grid">
      <?php foreach ($runs as $run): $article = $run['article']; $status = $run['status']; ?>
        <article class="article-card">
          <div class="card-meta"><?= editorial_status_badge((string) $status['status']) ?><time datetime="<?= editorial_escape($status['scheduledDate']) ?>"><?= editorial_date($status['scheduledDate']) ?></time></div>
          <p class="eyebrow"><?= editorial_escape($article['format']) ?> · <?= (int) $article['readingTimeMinutes'] ?> Minuten</p>
          <h2><a href="/redaktion/artikel/<?= editorial_escape($article['slug']) ?>/"><?= editorial_escape($article['title']) ?></a></h2>
          <p><?= editorial_escape($article['description']) ?></p>
          <dl class="compact-facts"><div><dt>Quellen</dt><dd><?= count($article['sources']) ?></dd></div><div><dt>Geprüfte Claims</dt><dd><?= ($status['claimGate'] ?? '') === 'passed' ? 'bestanden' : 'offen' ?></dd></div></dl>
          <a class="button" href="/redaktion/artikel/<?= editorial_escape($article['slug']) ?>/">Artikel vollständig prüfen</a>
        </article>
      <?php endforeach; ?>
      </div>
    </div></section>
    <section class="section section-muted"><div class="shell narrow"><div class="decision-box"><p class="eyebrow">Freigabe</p><h2>So gibst du Artikel frei</h2><p>Lies die Artikel einzeln. Nenne anschließend im Codex-Chat entweder die gewünschten Titel oder schreibe eindeutig: <strong>„Alle acht Artikel freigegeben.“</strong></p><p>Die Freigabe wird erst danach versioniert. Diese Ansicht verändert selbst keine Inhalte und veröffentlicht nichts.</p></div></div></section>
    <?php
    editorial_page_end();
}

function editorial_render_article(array $run, string $csrfToken): void
{
    $article = $run['article'];
    $status = $run['status'];
    $sourceLookup = [];
    foreach ($article['sources'] as $source) $sourceLookup[$source['id']] = $source;
    editorial_page_start($article['title'], true, $csrfToken);
    ?>
    <div class="shell breadcrumb"><a href="/redaktion/">← Alle Artikel</a></div>
    <article><header class="article-hero"><div class="shell reading-column">
      <div class="card-meta"><?= editorial_status_badge((string) $status['status']) ?><span>Geplant: <time datetime="<?= editorial_escape($status['scheduledDate']) ?>"><?= editorial_date($status['scheduledDate']) ?></time></span></div>
      <p class="eyebrow"><?= editorial_escape($article['format']) ?> · <?= (int) $article['readingTimeMinutes'] ?> Minuten</p>
      <h1><?= editorial_escape($article['title']) ?></h1><p class="lead"><?= editorial_escape($article['intro']) ?></p>
      <dl class="review-meta"><div><dt>Redaktionell geprüft</dt><dd><?= editorial_date($article['reviewedAt']) ?></dd></div><div><dt>Erneut prüfen bis</dt><dd><?= editorial_date($status['revalidateAfter']) ?></dd></div><div><dt>SEO-Prüfung</dt><dd><?= ($status['seoGate'] ?? '') === 'passed' ? 'Bestanden' : 'Offen' ?></dd></div></dl>
    </div></header>
    <div class="shell reading-column article-body">
      <aside class="key-points" aria-labelledby="key-points-title"><h2 id="key-points-title">Das Wichtigste in Kürze</h2><ul><?php foreach ($article['summary'] as $item): ?><li><?= editorial_escape($item) ?></li><?php endforeach; ?></ul></aside>
      <?php foreach ($article['sections'] as $section): ?>
        <section class="article-section" id="<?= editorial_escape($section['id']) ?>"><h2><?= editorial_escape($section['title']) ?></h2>
          <?php foreach ($section['paragraphs'] as $paragraph): ?><p><?= editorial_escape($paragraph) ?></p><?php endforeach; ?>
          <?php if (!empty($section['bullets'])): ?><ul><?php foreach ($section['bullets'] as $bullet): ?><li><?= editorial_escape($bullet) ?></li><?php endforeach; ?></ul><?php endif; ?>
          <div class="source-chips" aria-label="Quellen dieses Abschnitts"><?php foreach ($section['sourceIds'] ?? [] as $sourceId): if (isset($sourceLookup[$sourceId])): ?><a href="#source-<?= editorial_escape($sourceId) ?>"><?= editorial_escape($sourceLookup[$sourceId]['publisher']) ?></a><?php endif; endforeach; ?></div>
        </section>
      <?php endforeach; ?>
      <section class="article-section"><h2>Häufige Fragen</h2><div class="faq-list"><?php foreach ($article['faqs'] as $faq): ?><details><summary><?= editorial_escape($faq['question']) ?></summary><p><?= editorial_escape($faq['answer']) ?></p></details><?php endforeach; ?></div></section>
      <section class="article-section sources-section"><h2>Verwendete Primärquellen</h2><ol><?php foreach ($article['sources'] as $source): ?><li id="source-<?= editorial_escape($source['id']) ?>"><a href="<?= editorial_escape($source['url']) ?>" target="_blank" rel="noopener noreferrer"><?= editorial_escape($source['title']) ?></a><span><?= editorial_escape($source['publisher']) ?> · geprüft am <?= editorial_date($source['checkedAt']) ?></span></li><?php endforeach; ?></ol></section>
    </div></article>
    <section class="section section-muted"><div class="shell review-grid">
      <section class="review-panel"><p class="eyebrow">Recherche</p><h2>Recherchebrief</h2><div class="formatted-brief"><?= editorial_research_brief($run['researchBrief']) ?></div></section>
      <section class="review-panel"><p class="eyebrow">Social Media</p><h2>Facebook-Entwurf</h2><div class="social-draft"><?= nl2br(editorial_escape($run['facebookDraft'])) ?></div><p class="microcopy">Der Platzhalter wird nach erfolgreicher Veröffentlichung durch die Live-URL ersetzt.</p></section>
    </div></section>
    <section class="section"><div class="shell"><div class="section-heading"><div><p class="eyebrow">Faktenprüfung</p><h2>Geprüfte Aussagen</h2></div><p>Diese Tabelle verbindet sensible oder geschäftlich relevante Aussagen mit Quelle, Fundstelle und Prüfnotiz.</p></div><div class="table-wrap" tabindex="0" aria-label="Tabelle der geprüften Aussagen"><table><thead><tr><th>Aussage</th><th>Status</th><th>Fundstelle</th><th>Geprüft</th><th>Redaktionsnotiz</th></tr></thead><tbody>
      <?php foreach ($run['claims'] as $claim): ?><tr><td><strong><?= editorial_escape($claim['claim_text']) ?></strong><span><?= editorial_escape($claim['claim_type']) ?></span></td><td><?= ($claim['status'] ?? '') === 'verified' ? 'Verifiziert' : editorial_escape($claim['status']) ?></td><td><?= editorial_escape($claim['source_locator']) ?></td><td><?= editorial_date($claim['checked_at']) ?></td><td><?= editorial_escape($claim['review_note']) ?></td></tr><?php endforeach; ?>
    </tbody></table></div></div></section>
    <section class="section section-decision"><div class="shell reading-column"><div class="decision-box"><p class="eyebrow">Entscheidung</p><h2>Freigabe für „<?= editorial_escape($article['title']) ?>“</h2><p>Wenn Inhalt, Quellen und Leistungsgrenzen für dich passen, nenne diesen Titel im Codex-Chat als freigegeben. Ohne diese ausdrückliche Entscheidung bleibt der Artikel gesperrt.</p><a class="button button-secondary" href="/redaktion/">Zurück zur Übersicht</a></div></div></section>
    <?php
    editorial_page_end();
}

if (!$authenticated) {
    editorial_render_login($config, $csrfToken, $notice, $error);
    exit;
}

$content = require __DIR__ . '/content.php';
$runs = is_array($content['runs'] ?? null) ? $content['runs'] : [];
$requestedSlug = is_string($_GET['article'] ?? null) ? $_GET['article'] : '';
if ($requestedSlug !== '') {
    foreach ($runs as $run) {
        if (($run['article']['slug'] ?? '') === $requestedSlug) {
            editorial_render_article($run, $csrfToken);
            exit;
        }
    }
    http_response_code(404);
}
editorial_render_index($runs, $csrfToken);
