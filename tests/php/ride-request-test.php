<?php
declare(strict_types=1);

require_once __DIR__ . '/../../public/api/lib/validation.php';
require_once __DIR__ . '/../../public/api/lib/security.php';
require_once __DIR__ . '/../../public/api/lib/mail.php';

$now = new DateTimeImmutable('2026-07-20T10:00:00+00:00');
$valid = ['name' => 'Erika Muster', 'phone' => '06172 123456', 'email' => 'erika@example.com', 'date' => '2026-07-21', 'time' => '09:30', 'pickup' => 'Basler Str. 3', 'destination' => 'Musterstraße 1', 'reason' => 'Arzt- oder Kliniktermin', 'journey' => 'Hin- und Rückfahrt', 'notes' => '<script>Test</script>', 'consent' => true];
$result = validate_ride_request($valid, $now);
assert($result['errors'] === []);
assert(validate_ride_request([], $now)['errors'] !== []);
$invalidEmail = $valid; $invalidEmail['email'] = "test@example.com\r\nBcc: bad@example.com";
assert(isset(validate_ride_request($invalidEmail, $now)['errors']['email']));
$tooLong = $valid; $tooLong['notes'] = str_repeat('x', 1001);
assert(isset(validate_ride_request($tooLong, $now)['errors']['notes']));
assert(valid_submission_time(1000, 6000));
assert(!valid_submission_time(5900, 6000));
assert(valid_same_origin(['HTTP_ORIGIN' => 'https://example.com'], 'https://example.com'));
assert(!valid_same_origin(['HTTP_ORIGIN' => 'https://evil.example'], 'https://example.com'));
$rateDir = sys_get_temp_dir() . '/krankenfahrten-test-' . bin2hex(random_bytes(4));
$rateConfig = ['rate_limit_salt' => str_repeat('s', 32), 'rate_limit_dir' => $rateDir, 'rate_limit_count' => 2, 'rate_limit_window' => 600];
assert(check_rate_limit(['REMOTE_ADDR' => '127.0.0.1'], $rateConfig, 1000)['allowed']);
assert(check_rate_limit(['REMOTE_ADDR' => '127.0.0.1'], $rateConfig, 1001)['allowed']);
assert(!check_rate_limit(['REMOTE_ADDR' => '127.0.0.1'], $rateConfig, 1002)['allowed']);
$mailText = build_ride_request_mail_text($result['values'], $now);
assert(str_contains($mailText, 'keine bestätigte Buchung'));
$config = ['mail_to' => 'intern@example.com', 'mail_from' => 'formular@example.com'];
assert(send_ride_request_email($result['values'], $config, static fn(): bool => true));
assert(!send_ride_request_email($result['values'], $config, static fn(): bool => false));
foreach (glob($rateDir . '/*') ?: [] as $file) unlink($file);
@rmdir($rateDir);
echo "PHP-Funktionstests erfolgreich\n";
