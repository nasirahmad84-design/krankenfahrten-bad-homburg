<?php
declare(strict_types=1);

const CALENDAR_UID_SALT_PLACEHOLDER = 'NUR-AUF-DEM-SERVER-EINTRAGEN';

function build_ride_request_ics(array $data, array $options = []): string
{
    $calendar = validated_calendar_options($options);
    $ride = validated_calendar_ride_data($data);

    $berlin = new DateTimeZone('Europe/Berlin');
    $start = DateTimeImmutable::createFromFormat('!Y-m-d H:i', $ride['date'] . ' ' . $ride['time'], $berlin);
    if (!$start || $start->format('Y-m-d H:i') !== $ride['date'] . ' ' . $ride['time']) {
        throw new InvalidArgumentException('Ungültiger Kalenderzeitpunkt.');
    }

    $utc = new DateTimeZone('UTC');
    $end = $start->modify('+' . $calendar['duration_minutes'] . ' minutes');
    $generatedAt = $calendar['generated_at'] ?? new DateTimeImmutable('now', $utc);
    $generatedAt = $generatedAt->setTimezone($utc);
    $uidSource = implode("\x1F", [$ride['name'], $ride['date'], $ride['time'], $ride['pickup'], $ride['destination']]);
    $uid = hash_hmac('sha256', $uidSource, $calendar['uid_salt']) . '@krankenfahrten-bad-homburg.de';

    $description = implode("\n", [
        'Diese Anfrage ist noch keine bestätigte Buchung.',
        '',
        'Fahrgast: ' . $ride['name'],
        'Telefon: ' . $ride['phone'],
        'E-Mail: ' . ($ride['email'] !== '' ? $ride['email'] : 'Nicht angegeben'),
        'Abholung: ' . $ride['pickup'],
        'Ziel: ' . $ride['destination'],
        'Fahrtanlass: ' . $ride['reason'],
        'Fahrt: ' . ($ride['journey'] !== '' ? $ride['journey'] : 'Nicht angegeben'),
        'Zusätzliche Hinweise: ' . ($ride['notes'] !== '' ? $ride['notes'] : 'Keine'),
    ]);

    $lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Krankenfahrten Bad Homburg//Fahrtanfrage//DE',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:' . $uid,
        'DTSTAMP:' . $generatedAt->format('Ymd\THis\Z'),
        'DTSTART:' . $start->setTimezone($utc)->format('Ymd\THis\Z'),
        'DTEND:' . $end->setTimezone($utc)->format('Ymd\THis\Z'),
        'SUMMARY:' . escape_ics_text('Krankenfahrt – ' . $ride['name'] . ' – ' . $ride['reason']),
        'LOCATION:' . escape_ics_text($ride['pickup']),
        'DESCRIPTION:' . escape_ics_text($description),
    ];

    if ($calendar['reminder_minutes'] > 0) {
        array_push(
            $lines,
            'BEGIN:VALARM',
            'TRIGGER:-PT' . $calendar['reminder_minutes'] . 'M',
            'ACTION:DISPLAY',
            'DESCRIPTION:Krankenfahrt vorbereiten',
            'END:VALARM',
        );
    }

    $lines[] = 'END:VEVENT';
    $lines[] = 'END:VCALENDAR';

    return implode("\r\n", array_map('fold_ics_line', $lines)) . "\r\n";
}

function build_ride_request_ics_filename(array $data): string
{
    $date = $data['date'] ?? null;
    $parsedDate = is_string($date)
        ? DateTimeImmutable::createFromFormat('!Y-m-d', $date, new DateTimeZone('UTC'))
        : false;
    if (!$parsedDate || $parsedDate->format('Y-m-d') !== $date) {
        throw new InvalidArgumentException('Ungültiges Kalenderdatum.');
    }

    $name = $data['name'] ?? '';
    $slug = '';
    if (is_string($name)) {
        $parts = preg_split('/\s+/u', trim($name), -1, PREG_SPLIT_NO_EMPTY) ?: [];
        $lastName = $parts !== [] ? (string) end($parts) : '';
        $lastName = strtr($lastName, [
            'Ä' => 'Ae', 'Ö' => 'Oe', 'Ü' => 'Ue', 'ä' => 'ae', 'ö' => 'oe', 'ü' => 'ue', 'ß' => 'ss',
        ]);
        $lastName = function_exists('mb_strtolower') ? mb_strtolower($lastName, 'UTF-8') : strtolower($lastName);
        $slug = preg_replace('/[^a-z0-9]+/', '-', $lastName) ?? '';
        $slug = substr(trim($slug, '-'), 0, 48);
        $slug = rtrim($slug, '-');
    }

    return 'krankenfahrt-' . $date . ($slug !== '' ? '-' . $slug : '') . '.ics';
}

function validated_calendar_options(array $options): array
{
    $duration = filter_var($options['calendar_event_duration_minutes'] ?? null, FILTER_VALIDATE_INT);
    $reminder = filter_var($options['calendar_reminder_minutes'] ?? null, FILTER_VALIDATE_INT);
    $salt = $options['calendar_uid_salt'] ?? null;
    $generatedAt = $options['generated_at'] ?? null;

    if (
        !is_int($duration)
        || $duration < 15
        || $duration > 1440
        || !is_int($reminder)
        || $reminder < 0
        || $reminder > 1440
        || !is_string($salt)
        || strlen($salt) < 32
        || hash_equals(CALENDAR_UID_SALT_PLACEHOLDER, $salt)
        || ($generatedAt !== null && !$generatedAt instanceof DateTimeInterface)
    ) {
        throw new InvalidArgumentException('Ungültige Kalenderkonfiguration.');
    }

    return [
        'duration_minutes' => $duration,
        'reminder_minutes' => $reminder,
        'uid_salt' => $salt,
        'generated_at' => $generatedAt === null ? null : DateTimeImmutable::createFromInterface($generatedAt),
    ];
}

function validated_calendar_ride_data(array $data): array
{
    $required = ['name', 'phone', 'date', 'time', 'pickup', 'destination', 'reason'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || !is_string($data[$field]) || trim($data[$field]) === '') {
            throw new InvalidArgumentException('Unvollständige Kalenderdaten.');
        }
    }

    if (
        !preg_match('/^\d{4}-\d{2}-\d{2}$/', $data['date'])
        || !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $data['time'])
    ) {
        throw new InvalidArgumentException('Ungültiges Kalenderdatum.');
    }

    $email = $data['email'] ?? '';
    $journey = $data['journey'] ?? '';
    $notes = $data['notes'] ?? '';
    if (
        !is_string($email)
        || !is_string($journey)
        || !is_string($notes)
    ) {
        throw new InvalidArgumentException('Ungültige Kalenderdaten.');
    }
    if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL) === false) $email = '';

    return [
        'name' => trim($data['name']),
        'phone' => trim($data['phone']),
        'email' => trim($email),
        'date' => $data['date'],
        'time' => $data['time'],
        'pickup' => trim($data['pickup']),
        'destination' => trim($data['destination']),
        'reason' => trim($data['reason']),
        'journey' => trim($journey),
        'notes' => trim($notes),
    ];
}

function escape_ics_text(string $value): string
{
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    return str_replace(['\\', ';', ',', "\n"], ['\\\\', '\\;', '\\,', '\\n'], $value);
}

function fold_ics_line(string $line): string
{
    $segments = [];
    $limit = 75;

    while (strlen($line) > $limit) {
        $cut = $limit;
        while ($cut > 0 && (ord($line[$cut]) & 0xC0) === 0x80) $cut--;
        if ($cut === 0) throw new RuntimeException('Ungültige UTF-8-Faltung.');
        $segments[] = substr($line, 0, $cut);
        $line = substr($line, $cut);
        $limit = 74;
    }

    $segments[] = $line;
    return implode("\r\n ", $segments);
}
