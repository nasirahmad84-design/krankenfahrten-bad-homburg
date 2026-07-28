<?php
declare(strict_types=1);

require_once __DIR__ . '/calendar.php';

const SMTP_PASSWORD_PLACEHOLDER = 'HIER-NUR-AUF-DEM-SERVER-EINTRAGEN';

/**
 * The optional sender is a test seam. It receives the normalized mail payload
 * and SMTP configuration and must return true only when delivery succeeded.
 */
function send_ride_request_email(array $data, array $config, ?callable $sender = null): bool
{
    $smtp = validated_smtp_config($config);
    if ($smtp === null) return false;

    try {
        $payload = [
            'to' => $smtp['mail_to'],
            'from' => $smtp['mail_from'],
            'from_name' => $smtp['mail_from_name'],
            'reply_to' => validated_config_email($data['email'] ?? null),
            'subject' => 'Neue Fahrtanfrage über krankenfahrten-bad-homburg.de',
            'body' => build_ride_request_mail_text($data),
            'calendar_content' => build_ride_request_ics($data, $config),
            'calendar_filename' => build_ride_request_ics_filename($data),
        ];
    } catch (Throwable) {
        return false;
    }

    if ($sender !== null) {
        try {
            return $sender($payload, $smtp) === true;
        } catch (Throwable) {
            return false;
        }
    }

    return send_with_phpmailer($payload, $smtp);
}

function send_with_phpmailer(array $payload, array $smtp): bool
{
    $autoload = dirname(__DIR__) . '/vendor/autoload.php';
    if (!is_file($autoload) || !extension_loaded('openssl')) return false;

    try {
        require_once $autoload;
        if (!class_exists(\PHPMailer\PHPMailer\PHPMailer::class)) return false;

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
        configure_phpmailer_message($mailer, $payload);

        return $mailer->send();
    } catch (Throwable) {
        return false;
    }
}

function configure_phpmailer_message(\PHPMailer\PHPMailer\PHPMailer $mailer, array $payload): void
{
    $mailer->setFrom($payload['from'], $payload['from_name']);
    $mailer->addAddress($payload['to']);
    if ($payload['reply_to'] !== null) $mailer->addReplyTo($payload['reply_to']);
    $mailer->isHTML(false);
    $mailer->Subject = $payload['subject'];
    $mailer->Body = $payload['body'];
    $mailer->addStringAttachment(
        $payload['calendar_content'],
        $payload['calendar_filename'],
        \PHPMailer\PHPMailer\PHPMailer::ENCODING_BASE64,
        'text/calendar; charset=UTF-8; method=PUBLISH',
    );
}

function validated_smtp_config(array $config): ?array
{
    if (($config['mail_transport'] ?? null) !== 'smtp' || ($config['smtp_auth'] ?? null) !== true) return null;

    $host = normalized_header_value($config['smtp_host'] ?? null, 253);
    $username = normalized_header_value($config['smtp_username'] ?? null, 254);
    $fromName = normalized_header_value($config['mail_from_name'] ?? null, 120);
    $to = validated_config_email($config['mail_to'] ?? null);
    $from = validated_config_email($config['mail_from'] ?? null);
    $password = $config['smtp_password'] ?? null;
    $port = filter_var($config['smtp_port'] ?? null, FILTER_VALIDATE_INT);
    $timeout = filter_var($config['smtp_timeout'] ?? null, FILTER_VALIDATE_INT);
    $secure = $config['smtp_secure'] ?? null;

    if (
        $host === null
        || filter_var($host, FILTER_VALIDATE_DOMAIN, FILTER_FLAG_HOSTNAME) === false
        || $username === null
        || $fromName === null
        || $to === null
        || $from === null
        || !is_string($password)
        || trim($password) === ''
        || hash_equals(SMTP_PASSWORD_PLACEHOLDER, $password)
        || !is_int($port)
        || !is_int($timeout)
        || $timeout < 1
        || $timeout > 60
        || !is_string($secure)
    ) {
        return null;
    }

    $validEncryption = ($port === 587 && $secure === 'tls') || ($port === 465 && $secure === 'smtps');
    if (!$validEncryption) return null;

    return [
        'smtp_host' => $host,
        'smtp_port' => $port,
        'smtp_secure' => $secure,
        'smtp_username' => $username,
        'smtp_password' => $password,
        'smtp_timeout' => $timeout,
        'mail_to' => $to,
        'mail_from' => $from,
        'mail_from_name' => $fromName,
    ];
}

function build_ride_request_mail_text(array $data, ?DateTimeImmutable $requestedAt = null): string
{
    $requestedAt = $requestedAt ?? new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin'));
    $rows = [
        'Name' => $data['name'] ?? '',
        'Telefon' => $data['phone'] ?? '',
        'E-Mail' => $data['email'] ?: 'Nicht angegeben',
        'Fahrtdatum' => $data['date'] ?? '',
        'Uhrzeit' => $data['time'] ?? '',
        'Abholadresse' => $data['pickup'] ?? '',
        'Zieladresse' => $data['destination'] ?? '',
        'Fahrtart' => $data['reason'] ?? '',
        'Hin- und Rückfahrt' => $data['journey'] ?: 'Nicht angegeben',
        'Zusätzliche Hinweise' => $data['notes'] ?: 'Keine',
        'Zeitpunkt der Anfrage' => $requestedAt->format(DateTimeInterface::ATOM),
    ];
    $lines = [
        'Kalenderdatei:',
        'Die beigefügte ICS-Datei kann direkt in den Kalender übernommen werden.',
        '',
        'Diese Anfrage ist noch keine bestätigte Buchung.',
        '',
    ];
    foreach ($rows as $label => $value) $lines[] = $label . ': ' . (string) $value;
    return implode("\n", $lines);
}

function validated_config_email(mixed $value): ?string
{
    $value = normalized_header_value($value, 254);
    if ($value === null) return null;
    return filter_var($value, FILTER_VALIDATE_EMAIL) ? $value : null;
}

function normalized_header_value(mixed $value, int $maximumLength): ?string
{
    if (!is_string($value) || str_contains($value, "\r") || str_contains($value, "\n")) return null;
    $value = trim($value);
    if ($value === '' || strlen($value) > $maximumLength) return null;
    return $value;
}
