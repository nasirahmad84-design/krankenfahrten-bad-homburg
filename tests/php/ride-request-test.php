<?php
declare(strict_types=1);

require_once __DIR__ . '/../../public/api/lib/validation.php';
require_once __DIR__ . '/../../public/api/lib/security.php';
require_once __DIR__ . '/../../public/api/lib/mail.php';
require_once __DIR__ . '/../../public/api/vendor/autoload.php';

function test_assert(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

function test_smtp_config(): array
{
    return [
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
        'mail_from_name' => 'Testversand',
        'calendar_event_duration_minutes' => 60,
        'calendar_reminder_minutes' => 30,
        'calendar_uid_salt' => bin2hex(random_bytes(32)),
    ];
}

$now = new DateTimeImmutable('2026-07-20T10:00:00+00:00');
$valid = [
    'name' => 'Erika Muster',
    'phone' => '06172 123456',
    'email' => 'erika@example.com',
    'date' => '2026-07-21',
    'time' => '09:30',
    'pickup' => 'Basler Str. 3',
    'destination' => 'Musterstraße 1',
    'reason' => 'Arzt- oder Kliniktermin',
    'journey' => 'Hin- und Rückfahrt',
    'notes' => '<script>Test</script>',
    'consent' => true,
];
$result = validate_ride_request($valid, $now);
test_assert($result['errors'] === [], 'Gültige Anfrage wurde abgelehnt.');
test_assert(validate_ride_request([], $now)['errors'] !== [], 'Pflichtfeldprüfung fehlt.');
$invalidEmail = $valid;
$invalidEmail['email'] = "test@example.com\r\nBcc: bad@example.com";
test_assert(isset(validate_ride_request($invalidEmail, $now)['errors']['email']), 'Header-Injection wurde nicht abgelehnt.');
$tooLong = $valid;
$tooLong['notes'] = str_repeat('x', 1001);
test_assert(isset(validate_ride_request($tooLong, $now)['errors']['notes']), 'Überlänge wurde nicht abgelehnt.');
test_assert(valid_submission_time(1000, 6000), 'Gültige Formularzeit wurde abgelehnt.');
test_assert(!valid_submission_time(5900, 6000), 'Zu schnelle Übermittlung wurde akzeptiert.');
test_assert(valid_submission_time(5000, 6000, 1000, 5000), 'Grenzwert der Formularzeit wurde abgelehnt.');
test_assert(!valid_submission_time(5500, 6000, 1000, 5000), 'Zu kurze Formularzeit wurde akzeptiert.');
test_assert(!valid_submission_time(0, 6000, 1000, 5000), 'Fehlende Formularzeit wurde akzeptiert.');
test_assert(valid_same_origin(['HTTP_ORIGIN' => 'https://example.com'], 'https://example.com'), 'Same-Origin wurde abgelehnt.');
test_assert(!valid_same_origin(['HTTP_ORIGIN' => 'https://evil.example'], 'https://example.com'), 'Fremde Origin wurde akzeptiert.');

$rateDir = sys_get_temp_dir() . '/krankenfahrten-test-' . bin2hex(random_bytes(4));
$rateConfig = ['rate_limit_salt' => str_repeat('s', 32), 'rate_limit_dir' => $rateDir, 'rate_limit_count' => 2, 'rate_limit_window' => 600];
test_assert(check_rate_limit(['REMOTE_ADDR' => '127.0.0.1'], $rateConfig, 1000)['allowed'], 'Erste Anfrage wurde begrenzt.');
test_assert(check_rate_limit(['REMOTE_ADDR' => '127.0.0.1'], $rateConfig, 1001)['allowed'], 'Zweite Anfrage wurde begrenzt.');
test_assert(!check_rate_limit(['REMOTE_ADDR' => '127.0.0.1'], $rateConfig, 1002)['allowed'], 'Rate Limit wurde nicht ausgelöst.');

$mailText = build_ride_request_mail_text($result['values'], $now);
test_assert(str_contains($mailText, 'keine bestätigte Buchung'), 'Verbindlichkeitshinweis fehlt.');
test_assert(str_starts_with($mailText, "Kalenderdatei:\nDie beigefügte ICS-Datei"), 'Kalenderhinweis fehlt.');
test_assert(str_contains($mailText, '<script>Test</script>'), 'Textinhalt wurde unerwartet verändert.');
test_assert(class_exists(\PHPMailer\PHPMailer\PHPMailer::class), 'PHPMailer-Autoloader funktioniert nicht.');

$smtpConfig = test_smtp_config();
$capturedPayload = null;
$capturedSmtp = null;
$successfulSender = static function (array $payload, array $smtp) use (&$capturedPayload, &$capturedSmtp): bool {
    $capturedPayload = $payload;
    $capturedSmtp = $smtp;
    return true;
};
test_assert(send_ride_request_email($result['values'], $smtpConfig, $successfulSender), 'Mailer-Injektion schlug fehl.');
test_assert($capturedPayload['reply_to'] === 'erika@example.com', 'Gültiges Reply-To fehlt.');
test_assert($capturedPayload['to'] === 'intern@example.test', 'Empfänger stammt nicht aus der Serverkonfiguration.');
test_assert($capturedSmtp['smtp_secure'] === 'tls', 'STARTTLS-Konfiguration ging verloren.');
test_assert(str_ends_with($capturedPayload['calendar_filename'], '.ics'), 'ICS-Dateiname fehlt.');
test_assert(str_contains($capturedPayload['calendar_content'], 'BEGIN:VCALENDAR'), 'ICS-Inhalt fehlt.');

$message = new \PHPMailer\PHPMailer\PHPMailer(true);
configure_phpmailer_message($message, $capturedPayload);
$attachments = $message->getAttachments();
test_assert(count($attachments) === 1, 'PHPMailer erhielt nicht genau einen Anhang.');
test_assert($attachments[0][3] === \PHPMailer\PHPMailer\PHPMailer::ENCODING_BASE64, 'ICS-Anhang verwendet nicht Base64.');
test_assert($attachments[0][4] === 'text/calendar; charset=UTF-8; method=PUBLISH', 'ICS-MIME-Type ist falsch.');
test_assert($attachments[0][5] === true, 'ICS-Anhang wurde nicht aus dem Arbeitsspeicher erzeugt.');
test_assert(str_ends_with($attachments[0][2], '.ics'), 'PHPMailer-Anhang hat keine ICS-Endung.');
test_assert(!send_ride_request_email($result['values'], $smtpConfig, static fn(): bool => false), 'SMTP-Fehler wurde als Erfolg behandelt.');
test_assert(!send_ride_request_email($result['values'], $smtpConfig, static function (): bool {
    throw new RuntimeException('Interner Transportfehler');
}), 'SMTP-Ausnahme wurde als Erfolg behandelt.');

$invalidReply = $result['values'];
$invalidReply['email'] = "reply@example.com\r\nBcc: bad@example.com";
$replyPayload = null;
test_assert(send_ride_request_email($invalidReply, $smtpConfig, static function (array $payload) use (&$replyPayload): bool {
    $replyPayload = $payload;
    return true;
}), 'Versand ohne Reply-To schlug fehl.');
test_assert($replyPayload['reply_to'] === null, 'Ungültiges Reply-To wurde übernommen.');

$missingPassword = $smtpConfig;
unset($missingPassword['smtp_password']);
test_assert(!send_ride_request_email($result['values'], $missingPassword, $successfulSender), 'Fehlendes Passwort wurde akzeptiert.');
$placeholderPassword = $smtpConfig;
$placeholderPassword['smtp_password'] = SMTP_PASSWORD_PLACEHOLDER;
test_assert(!send_ride_request_email($result['values'], $placeholderPassword, $successfulSender), 'Passwort-Platzhalter wurde akzeptiert.');
$invalidPort = $smtpConfig;
$invalidPort['smtp_port'] = 25;
test_assert(!send_ride_request_email($result['values'], $invalidPort, $successfulSender), 'Unverschlüsselter SMTP-Port wurde akzeptiert.');
$invalidEncryption = $smtpConfig;
$invalidEncryption['smtp_secure'] = 'none';
test_assert(!send_ride_request_email($result['values'], $invalidEncryption, $successfulSender), 'Unverschlüsselter SMTP-Transport wurde akzeptiert.');
$mismatchedEncryption = $smtpConfig;
$mismatchedEncryption['smtp_port'] = 465;
test_assert(!send_ride_request_email($result['values'], $mismatchedEncryption, $successfulSender), 'Nicht passende Port-/TLS-Kombination wurde akzeptiert.');
$smtpsConfig = $smtpConfig;
$smtpsConfig['smtp_port'] = 465;
$smtpsConfig['smtp_secure'] = 'smtps';
test_assert(send_ride_request_email($result['values'], $smtpsConfig, $successfulSender), 'SMTPS auf Port 465 wurde abgelehnt.');
$invalidFrom = $smtpConfig;
$invalidFrom['mail_from'] = "mailer@example.test\r\nBcc: bad@example.com";
test_assert(!send_ride_request_email($result['values'], $invalidFrom, $successfulSender), 'Ungültiger Absender wurde akzeptiert.');
$invalidTo = $smtpConfig;
$invalidTo['mail_to'] = 'kein-postfach';
test_assert(!send_ride_request_email($result['values'], $invalidTo, $successfulSender), 'Ungültiger Empfänger wurde akzeptiert.');
$missingConfig = ['mail_transport' => 'smtp'];
test_assert(!send_ride_request_email($result['values'], $missingConfig, $successfulSender), 'Unvollständige SMTP-Konfiguration wurde akzeptiert.');
$missingCalendarSalt = $smtpConfig;
unset($missingCalendarSalt['calendar_uid_salt']);
$senderCalled = false;
test_assert(!send_ride_request_email($result['values'], $missingCalendarSalt, static function () use (&$senderCalled): bool {
    $senderCalled = true;
    return true;
}), 'Versand ohne gültige ICS wurde akzeptiert.');
test_assert(!$senderCalled, 'Mailer wurde trotz beschädigter ICS-Erstellung aufgerufen.');
$legacyConfig = $smtpConfig;
$legacyConfig['mail_transport'] = 'mail';
test_assert(!send_ride_request_email($result['values'], $legacyConfig, $successfulSender), 'Legacy-mail()-Fallback ist noch aktiv.');

foreach (glob($rateDir . '/*') ?: [] as $file) unlink($file);
@rmdir($rateDir);
echo "PHP-Funktionstests erfolgreich\n";
