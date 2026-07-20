<?php
declare(strict_types=1);

function send_ride_request_email(array $data, array $config, ?callable $mailer = null): bool
{
    $to = validated_config_email($config['mail_to'] ?? null);
    $from = validated_config_email($config['mail_from'] ?? null);
    if ($to === null || $from === null) return false;
    $subject = 'Neue Fahrtanfrage über krankenfahrten-bad-homburg.de';
    $message = build_ride_request_mail_text($data);
    $headers = "From: Krankenfahrten Bad Homburg <{$from}>\r\n";
    if (!empty($data['email']) && validated_config_email($data['email']) !== null) $headers .= "Reply-To: {$data['email']}\r\n";
    $headers .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: 8bit";

    if ($mailer !== null) return (bool) $mailer($to, $subject, $message, $headers);
    $transport = (string) ($config['mail_transport'] ?? 'mail');
    $environment = (string) ($config['environment'] ?? 'production');
    if ($environment !== 'production' && $transport === 'mock-success') return true;
    if ($environment !== 'production' && $transport === 'mock-error') return false;
    if ($transport !== 'mail') return false;
    return mail($to, $subject, $message, $headers);
}

function build_ride_request_mail_text(array $data, ?DateTimeImmutable $requestedAt = null): string
{
    $requestedAt = $requestedAt ?? new DateTimeImmutable('now', new DateTimeZone('Europe/Berlin'));
    $rows = [
        'Name' => $data['name'] ?? '', 'Telefon' => $data['phone'] ?? '', 'E-Mail' => $data['email'] ?: 'Nicht angegeben',
        'Fahrtdatum' => $data['date'] ?? '', 'Uhrzeit' => $data['time'] ?? '', 'Abholadresse' => $data['pickup'] ?? '',
        'Zieladresse' => $data['destination'] ?? '', 'Fahrtart' => $data['reason'] ?? '', 'Hin- und Rückfahrt' => $data['journey'] ?: 'Nicht angegeben',
        'Zusätzliche Hinweise' => $data['notes'] ?: 'Keine', 'Zeitpunkt der Anfrage' => $requestedAt->format(DateTimeInterface::ATOM),
    ];
    $lines = ['Diese Anfrage ist noch keine bestätigte Buchung.', ''];
    foreach ($rows as $label => $value) $lines[] = $label . ': ' . (string) $value;
    return implode("\n", $lines);
}

function validated_config_email(mixed $value): ?string
{
    if (!is_string($value) || str_contains($value, "\r") || str_contains($value, "\n")) return null;
    $value = trim($value);
    return filter_var($value, FILTER_VALIDATE_EMAIL) ? $value : null;
}
