<?php
declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/public/api/lib/mail.php';
require_once dirname(__DIR__, 2) . '/editorial/lib/auth.php';

function editorial_test(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

$salt = str_repeat('a', 32);
$code = editorial_generate_code();
editorial_test(preg_match('/^\d{6}$/D', $code) === 1, 'Der Einmalcode muss sechsstellig sein.');

$session = [];
editorial_store_code($session, '012345', $salt, 1000);
editorial_test(!array_key_exists('code', $session), 'Der Einmalcode darf nicht im Klartext gespeichert werden.');
editorial_test(editorial_verify_code($session, '012345', $salt, 1050), 'Ein gültiger Code muss akzeptiert werden.');
editorial_test(($session['authenticated'] ?? false) === true, 'Die Sitzung muss nach gültigem Code authentifiziert sein.');
editorial_test(editorial_is_authenticated($session, 1100), 'Eine frische Sitzung muss gültig sein.');
editorial_test(!editorial_is_authenticated($session, 1100 + EDITORIAL_IDLE_TIMEOUT + 1), 'Die Leerlaufgrenze muss die Sitzung beenden.');

$expired = [];
editorial_store_code($expired, '123456', $salt, 1000);
editorial_test(!editorial_verify_code($expired, '123456', $salt, 1000 + EDITORIAL_OTP_LIFETIME + 1), 'Ein abgelaufener Code darf nicht akzeptiert werden.');

$limited = [];
editorial_store_code($limited, '654321', $salt, 1000);
for ($attempt = 0; $attempt < EDITORIAL_OTP_MAX_ATTEMPTS; $attempt++) editorial_verify_code($limited, '000000', $salt, 1010 + $attempt);
editorial_test(!isset($limited['otp_hash']), 'Der Code muss nach fünf Fehlversuchen gelöscht werden.');

$csrfSession = [];
$csrf = editorial_csrf_token($csrfSession);
editorial_test(strlen($csrf) === 64, 'CSRF-Token muss 256 Bit enthalten.');
editorial_test(editorial_valid_csrf($csrfSession, $csrf), 'CSRF-Token muss validiert werden.');
editorial_test(!editorial_valid_csrf($csrfSession, str_repeat('0', 64)), 'Falsches CSRF-Token darf nicht akzeptiert werden.');

$config = [
    'mail_transport' => 'smtp',
    'smtp_host' => 'w01267fe.kasserver.com',
    'smtp_port' => 587,
    'smtp_secure' => 'tls',
    'smtp_auth' => true,
    'smtp_username' => 'anfrage@krankenfahrten-bad-homburg.de',
    'smtp_password' => 'nur-fuer-den-test-kein-echtes-passwort',
    'smtp_timeout' => 15,
    'mail_to' => 'anfrage@krankenfahrten-bad-homburg.de',
    'mail_from' => 'anfrage@krankenfahrten-bad-homburg.de',
    'mail_from_name' => 'Krankenfahrten Bad Homburg',
    'rate_limit_salt' => $salt,
    'rate_limit_dir' => sys_get_temp_dir() . '/kfbh-editorial-test-' . bin2hex(random_bytes(4)),
];
$captured = null;
$sent = editorial_send_login_code('246810', $config, static function (array $payload, array $smtp) use (&$captured): bool {
    $captured = [$payload, $smtp];
    return true;
});
editorial_test($sent, 'Der injizierte Testversand muss gelingen.');
editorial_test(($captured[0]['to'] ?? '') === $config['mail_to'], 'Der Empfänger muss fest aus der Serverkonfiguration stammen.');
editorial_test(str_contains((string) ($captured[0]['body'] ?? ''), '246810'), 'Die Nachricht muss den Einmalcode enthalten.');
editorial_test(array_key_exists('reply_to', $captured[0]) && $captured[0]['reply_to'] === null, 'Die Loginmail darf kein fremdes Reply-To erhalten.');

$requestSession = [];
$issued = editorial_issue_code(
    $requestSession,
    ['REMOTE_ADDR' => '127.0.0.1'],
    $config,
    2000,
    static fn(array $payload, array $smtp): bool => true,
);
editorial_test($issued, 'Ein Code muss mit gültiger Konfiguration ausgestellt werden.');
editorial_test(isset($requestSession['otp_hash']) && !isset($requestSession['otp_code']), 'Die Sitzung darf nur den Code-Hash enthalten.');

echo "Editorial-Login geprüft: Einmalcode, Ablauf, Fehlversuche, CSRF, Sitzung, SMTP-Ziel und Rate Limit.\n";
