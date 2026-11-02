<?php
declare(strict_types=1);

require_once __DIR__ . '/mail.php';

const BLOG_ALERT_REPOSITORY = 'nasirahmad84-design/krankenfahrten-bad-homburg';
const BLOG_ALERT_WORKFLOW = 'Geplanter Blog-Queue-Release';

function valid_blog_alert_token(mixed $token, array $alertConfig): bool
{
    $expectedHash = $alertConfig['token_sha256'] ?? null;
    return is_string($token)
        && strlen($token) === 64
        && ctype_xdigit($token)
        && is_string($expectedHash)
        && preg_match('/^[a-f0-9]{64}$/', $expectedHash) === 1
        && hash_equals($expectedHash, hash('sha256', strtolower($token)));
}

function validate_blog_alert_event(mixed $input): ?array
{
    if (!is_array($input)) return null;

    $repository = normalized_alert_value($input['repository'] ?? null, 120);
    $workflow = normalized_alert_value($input['workflow'] ?? null, 120);
    $runUrl = normalized_alert_value($input['runUrl'] ?? null, 500);
    $runId = normalized_alert_value($input['runId'] ?? null, 30);
    $conclusion = normalized_alert_value($input['conclusion'] ?? null, 40);
    $eventName = normalized_alert_value($input['eventName'] ?? null, 80);
    $headSha = normalized_alert_value($input['headSha'] ?? null, 64);

    if ($repository !== BLOG_ALERT_REPOSITORY || $workflow !== BLOG_ALERT_WORKFLOW) return null;
    if ($runId === null || preg_match('/^[0-9]+$/', $runId) !== 1) return null;
    if ($runUrl === null || $runUrl !== "https://github.com/" . BLOG_ALERT_REPOSITORY . "/actions/runs/" . $runId) return null;
    if ($conclusion === null || !in_array($conclusion, ['failure', 'cancelled', 'timed_out', 'action_required', 'stale', 'startup_failure', 'test'], true)) return null;
    if ($eventName === null || $headSha === null || preg_match('/^[a-f0-9]{7,64}$/i', $headSha) !== 1) return null;

    return compact('repository', 'workflow', 'runUrl', 'runId', 'conclusion', 'eventName', 'headSha');
}

function send_blog_alert_email(array $event, array $smtpConfig, array $alertConfig, ?callable $sender = null): bool
{
    $smtp = validated_smtp_config($smtpConfig);
    $recipient = validated_config_email($alertConfig['recipient'] ?? null);
    if ($smtp === null || $recipient === null) return false;

    $payload = [
        'to' => $recipient,
        'from' => $smtp['mail_from'],
        'from_name' => $smtp['mail_from_name'],
        'reply_to' => null,
        'subject' => $event['conclusion'] === 'test'
            ? '[Krankenfahrten] Test der Blog-Alarmierung'
            : '[Krankenfahrten] Blog-Veröffentlichung fehlgeschlagen',
        'body' => build_blog_alert_text($event),
    ];

    if ($sender !== null) {
        try {
            return $sender($payload, $smtp) === true;
        } catch (Throwable) {
            return false;
        }
    }

    return send_blog_alert_with_phpmailer($payload, $smtp);
}

// Persist successful delivery under a lock; publisher and health share one incident.
function send_deduplicated_blog_alert(array $event, array $smtpConfig, array $alertConfig, ?callable $sender = null, ?string $directory = null, ?int $now = null): bool
{
    if ($event['conclusion'] === 'test') return send_blog_alert_email($event, $smtpConfig, $alertConfig, $sender);
    $directory ??= sys_get_temp_dir() . '/kfbh-blog-alert-' . substr(hash('sha256', __DIR__), 0, 16);
    $now ??= time();
    $component = str_starts_with($event['eventName'], 'Google-Business-Pipeline') ? 'google' : 'blog';
    $key = hash('sha256', $event['repository'] . ':' . $event['headSha'] . ':' . $component);
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) return false;
    $handle = @fopen($directory . '/' . $key . '.json', 'c+');
    if ($handle === false) return false;
    @chmod($directory . '/' . $key . '.json', 0600);
    try {
        if (!flock($handle, LOCK_EX)) return false;
        $previous = json_decode(stream_get_contents($handle) ?: '{}', true);
        $sentAt = is_array($previous) ? ($previous['sentAt'] ?? null) : null;
        if (is_int($sentAt) && $now >= $sentAt && $now - $sentAt < 86400) return true;
        if (!send_blog_alert_email($event, $smtpConfig, $alertConfig, $sender)) return false;
        $state = json_encode(['sentAt' => $now, 'runId' => $event['runId']]);
        rewind($handle);
        return ftruncate($handle, 0) && fwrite($handle, $state) === strlen($state) && fflush($handle);
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function send_blog_alert_with_phpmailer(array $payload, array $smtp): bool
{
    $autoload = dirname(__DIR__) . '/vendor/autoload.php';
    if (!is_file($autoload) || !extension_loaded('openssl')) return false;

    try {
        require_once $autoload;
        $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
        $mailer->isSMTP();
        $mailer->SMTPDebug = \PHPMailer\PHPMailer\SMTP::DEBUG_OFF;
        $mailer->SMTPAutoTLS = false;
        $mailer->Host = $smtp['smtp_host'];
        $mailer->Port = $smtp['smtp_port'];
        $mailer->SMTPAuth = true;
        $mailer->Username = $smtp['smtp_username'];
        $mailer->Password = $smtp['smtp_password'];
        $mailer->Timeout = $smtp['smtp_timeout'];
        $mailer->SMTPSecure = $smtp['smtp_secure'] === 'tls'
            ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS
            : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mailer->CharSet = \PHPMailer\PHPMailer\PHPMailer::CHARSET_UTF8;
        $mailer->Encoding = \PHPMailer\PHPMailer\PHPMailer::ENCODING_QUOTED_PRINTABLE;
        $mailer->setFrom($payload['from'], $payload['from_name']);
        $mailer->addAddress($payload['to']);
        $mailer->isHTML(false);
        $mailer->Subject = $payload['subject'];
        $mailer->Body = $payload['body'];
        return $mailer->send();
    } catch (Throwable) {
        return false;
    }
}

function build_blog_alert_text(array $event): string
{
    $intro = $event['conclusion'] === 'test'
        ? 'Die serverseitige Alarmierung für den Blog-Publisher funktioniert.'
        : 'Der automatische Blog-Publisher wurde nicht erfolgreich abgeschlossen.';

    return implode("\n", [
        $intro,
        '',
        'Workflow: ' . $event['workflow'],
        'Ergebnis: ' . $event['conclusion'],
        'Auslöser: ' . $event['eventName'],
        'Run-ID: ' . $event['runId'],
        'Commit: ' . $event['headSha'],
        'Details: ' . $event['runUrl'],
        'Alle Abläufe: https://github.com/' . BLOG_ALERT_REPOSITORY . '/actions',
        'Publisher und Gesundheitsprüfung können denselben Fehler melden. Wiederholungen zum selben Stand werden für 24 Stunden gebündelt.',
        '',
        'Diese Nachricht wurde automatisch versendet. Es wurden keine Artikel- oder Formulardaten übertragen.',
    ]);
}

function normalized_alert_value(mixed $value, int $maximumLength): ?string
{
    if (!is_string($value) || str_contains($value, "\r") || str_contains($value, "\n")) return null;
    $value = trim($value);
    if ($value === '' || strlen($value) > $maximumLength) return null;
    return $value;
}
