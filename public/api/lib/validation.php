<?php
declare(strict_types=1);

function validate_ride_request(array $input, ?DateTimeImmutable $now = null): array
{
    $now = $now ?? new DateTimeImmutable('now', new DateTimeZone('UTC'));
    $limits = ['name' => 120, 'phone' => 40, 'email' => 254, 'pickup' => 200, 'destination' => 200, 'reason' => 80, 'journey' => 40, 'notes' => 1000];
    $values = [
        'name' => normalize_line($input['name'] ?? ''),
        'phone' => normalize_line($input['phone'] ?? ''),
        'email' => normalize_line($input['email'] ?? ''),
        'date' => normalize_line($input['date'] ?? ''),
        'time' => normalize_line($input['time'] ?? ''),
        'pickup' => normalize_line($input['pickup'] ?? ''),
        'destination' => normalize_line($input['destination'] ?? ''),
        'reason' => normalize_line($input['reason'] ?? ''),
        'journey' => normalize_line($input['journey'] ?? ''),
        'notes' => normalize_multiline($input['notes'] ?? ''),
    ];
    $errors = [];

    foreach (['name', 'phone', 'pickup', 'destination', 'reason'] as $field) {
        if ($values[$field] === '') $errors[$field] = 'Bitte füllen Sie dieses Pflichtfeld aus.';
        elseif (text_length($values[$field]) > $limits[$field]) $errors[$field] = 'Bitte verwenden Sie höchstens ' . $limits[$field] . ' Zeichen.';
    }
    if ($values['email'] !== '' && (text_length($values['email']) > $limits['email'] || !filter_var($values['email'], FILTER_VALIDATE_EMAIL) || contains_newline($values['email']))) {
        $errors['email'] = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }
    if ($values['phone'] !== '' && !preg_match('/^[+()0-9\s.\/-]{5,40}$/u', $values['phone'])) $errors['phone'] = 'Bitte geben Sie eine gültige Telefonnummer ein.';
    $allowedReasons = ['Arzt- oder Kliniktermin', 'Dialyse', 'Chemo- oder Strahlentherapie', 'Reha oder Therapie', 'Entlassungsfahrt', 'Serienfahrt', 'Sonstiger Fahrtanlass'];
    if (!in_array($values['reason'], $allowedReasons, true)) $errors['reason'] = 'Bitte wählen Sie einen gültigen Anlass aus.';
    if ($values['journey'] !== '' && !in_array($values['journey'], ['Nur Hinfahrt', 'Hin- und Rückfahrt'], true)) $errors['journey'] = 'Bitte wählen Sie eine gültige Fahrt aus.';
    if ($values['notes'] !== '' && text_length($values['notes']) > $limits['notes']) $errors['notes'] = 'Bitte verwenden Sie höchstens 1000 Zeichen.';
    if (!valid_date($values['date'], $now)) $errors['date'] = 'Bitte wählen Sie ein gültiges zukünftiges Fahrtdatum.';
    if (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $values['time'])) $errors['time'] = 'Bitte wählen Sie eine gültige Uhrzeit.';
    if (!isset($input['consent']) || !in_array($input['consent'], [true, 1, '1', 'on'], true)) $errors['consent'] = 'Bitte erteilen Sie die ausdrückliche Einwilligung zur Bearbeitung Ihrer Anfrage.';

    return ['values' => $values, 'errors' => $errors];
}

function normalize_line(mixed $value): string
{
    if (!is_string($value) && !is_numeric($value)) return '';
    $text = preg_replace('/[\r\n\t]+/u', ' ', (string) $value) ?? '';
    return trim(preg_replace('/\s+/u', ' ', $text) ?? '');
}

function normalize_multiline(mixed $value): string
{
    if (!is_string($value)) return '';
    $text = str_replace(["\r\n", "\r"], "\n", $value);
    $text = preg_replace('/[ \t]+/u', ' ', $text) ?? '';
    return trim(preg_replace('/\n{3,}/', "\n\n", $text) ?? '');
}

function text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

function contains_newline(string $value): bool
{
    return str_contains($value, "\r") || str_contains($value, "\n");
}

function valid_date(string $value, DateTimeImmutable $now): bool
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('UTC'));
    if (!$date || $date->format('Y-m-d') !== $value) return false;
    $today = $now->setTimezone(new DateTimeZone('UTC'))->setTime(0, 0);
    return $date >= $today && $date <= $today->modify('+2 years');
}
