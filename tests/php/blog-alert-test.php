<?php
declare(strict_types=1);

require_once __DIR__ . '/../../public/api/lib/blog-alert.php';

function alert_test_assert(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

$token = bin2hex(random_bytes(32));
$alertConfig = [
    'token_sha256' => hash('sha256', $token),
    'recipient' => 'nahmad@example.test',
];
$smtpConfig = [
    'mail_transport' => 'smtp',
    'smtp_host' => 'smtp.example.test',
    'smtp_port' => 587,
    'smtp_secure' => 'tls',
    'smtp_auth' => true,
    'smtp_username' => 'mailer@example.test',
    'smtp_password' => bin2hex(random_bytes(16)),
    'smtp_timeout' => 15,
    'mail_to' => 'intern@example.test',
    'mail_from' => 'mailer@example.test',
    'mail_from_name' => 'Krankenfahrten Test',
];
$event = validate_blog_alert_event([
    'repository' => BLOG_ALERT_REPOSITORY,
    'workflow' => BLOG_ALERT_WORKFLOW,
    'runUrl' => 'https://github.com/' . BLOG_ALERT_REPOSITORY . '/actions/runs/123456',
    'runId' => '123456',
    'conclusion' => 'failure',
    'eventName' => 'schedule',
    'headSha' => str_repeat('a', 40),
]);

alert_test_assert(valid_blog_alert_token($token, $alertConfig), 'Gültiger Alarm-Token wurde abgelehnt.');
alert_test_assert(!valid_blog_alert_token(str_repeat('0', 64), $alertConfig), 'Ungültiger Alarm-Token wurde akzeptiert.');
alert_test_assert($event !== null, 'Gültiges Workflow-Ereignis wurde abgelehnt.');
alert_test_assert(validate_blog_alert_event(['repository' => 'fremd/repo']) === null, 'Fremdes Repository wurde akzeptiert.');

$captured = null;
alert_test_assert(send_blog_alert_email($event, $smtpConfig, $alertConfig, static function (array $payload) use (&$captured): bool {
    $captured = $payload;
    return true;
}), 'Testtransport wurde nicht ausgeführt.');
alert_test_assert($captured['to'] === 'nahmad@example.test', 'Alarmempfänger stammt nicht aus der geschützten Konfiguration.');
alert_test_assert(str_contains($captured['subject'], 'fehlgeschlagen'), 'Fehlerbetreff fehlt.');
alert_test_assert(str_contains($captured['body'], '/actions/runs/123456'), 'Run-Link fehlt im Alarmtext.');
alert_test_assert(!array_key_exists('calendar_content', $captured), 'Alarmmail darf keinen Kalenderanhang enthalten.');

$invalidRecipient = $alertConfig;
$invalidRecipient['recipient'] = "bad@example.test\r\nBcc: evil@example.test";
alert_test_assert(!send_blog_alert_email($event, $smtpConfig, $invalidRecipient, static fn(): bool => true), 'Header-Injection im Empfänger wurde akzeptiert.');
alert_test_assert(!send_blog_alert_email($event, [], $alertConfig, static fn(): bool => true), 'Fehlende SMTP-Konfiguration wurde akzeptiert.');

echo "Blog-Alarm-Funktionstests erfolgreich\n";
