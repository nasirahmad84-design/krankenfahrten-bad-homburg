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
