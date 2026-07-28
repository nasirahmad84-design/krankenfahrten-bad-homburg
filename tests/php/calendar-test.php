<?php
declare(strict_types=1);

require_once __DIR__ . '/../../public/api/lib/calendar.php';

function calendar_test_assert(bool $condition, string $message): void
{
    if (!$condition) throw new RuntimeException($message);
}

function calendar_test_value(string $ics, string $property): string
{
    $unfolded = str_replace("\r\n ", '', $ics);
    if (!preg_match('/^' . preg_quote($property, '/') . ':(.*)$/m', $unfolded, $match)) {
        throw new RuntimeException($property . ' fehlt.');
    }
    return rtrim($match[1], "\r");
}

function calendar_test_options(array $overrides = []): array
{
    return array_merge([
        'calendar_event_duration_minutes' => 60,
        'calendar_reminder_minutes' => 30,
        'calendar_uid_salt' => str_repeat('c', 64),
        'generated_at' => new DateTimeImmutable('2026-07-20T10:00:00Z'),
    ], $overrides);
}

$ride = [
    'name' => 'Erika Müller',
    'phone' => '06172 123456',
    'email' => 'erika@example.com',
    'date' => '2026-08-03',
    'time' => '09:30',
    'pickup' => 'Hauptstraße 1, Bad Homburg',
    'destination' => 'Klinik; Haus B',
    'reason' => 'Arzt- oder Kliniktermin',
    'journey' => 'Hin- und Rückfahrt',
    'notes' => "Rollator\\mitbringen\nBitte klingeln",
];

$summer = build_ride_request_ics($ride, calendar_test_options());
calendar_test_assert(str_starts_with($summer, "BEGIN:VCALENDAR\r\nVERSION:2.0\r\n"), 'VCALENDAR-Anfang ist ungültig.');
calendar_test_assert(str_ends_with($summer, "END:VEVENT\r\nEND:VCALENDAR\r\n"), 'VCALENDAR-Ende ist ungültig.');
calendar_test_assert(substr_count($summer, 'BEGIN:VEVENT') === 1, 'Es wurde mehr als ein Ereignis erzeugt.');
calendar_test_assert(substr_count($summer, 'END:VEVENT') === 1, 'VEVENT-Struktur ist ungültig.');
calendar_test_assert(calendar_test_value($summer, 'DTSTART') === '20260803T073000Z', 'Sommerzeit wurde falsch nach UTC umgerechnet.');
calendar_test_assert(calendar_test_value($summer, 'DTEND') === '20260803T083000Z', 'Standarddauer ist falsch.');
calendar_test_assert(str_contains($summer, "BEGIN:VALARM\r\nTRIGGER:-PT30M\r\n"), '30-Minuten-Erinnerung fehlt.');
$unfoldedSummer = str_replace("\r\n ", '', $summer);
calendar_test_assert(str_contains($unfoldedSummer, 'SUMMARY:Krankenfahrt – Erika Müller – Arzt- oder Kliniktermin'), 'SUMMARY ist unvollständig.');
calendar_test_assert(str_contains($unfoldedSummer, 'LOCATION:Hauptstraße 1\\, Bad Homburg'), 'Abholadresse fehlt als LOCATION.');
calendar_test_assert(str_contains($unfoldedSummer, 'Telefon: 06172 123456'), 'Telefon fehlt in DESCRIPTION.');
calendar_test_assert(str_contains($unfoldedSummer, 'Ziel: Klinik\\; Haus B'), 'Ziel fehlt in DESCRIPTION.');
calendar_test_assert(str_contains($unfoldedSummer, 'Fahrt: Hin- und Rückfahrt'), 'Rückfahrthinweis fehlt.');

$winterRide = $ride;
$winterRide['date'] = '2026-12-03';
$winter = build_ride_request_ics($winterRide, calendar_test_options());
calendar_test_assert(calendar_test_value($winter, 'DTSTART') === '20261203T083000Z', 'Winterzeit wurde falsch nach UTC umgerechnet.');

$duration = build_ride_request_ics($ride, calendar_test_options(['calendar_event_duration_minutes' => 90]));
calendar_test_assert(calendar_test_value($duration, 'DTEND') === '20260803T090000Z', 'Konfigurierte Dauer wurde nicht angewendet.');
$noAlarm = build_ride_request_ics($ride, calendar_test_options(['calendar_reminder_minutes' => 0]));
calendar_test_assert(!str_contains($noAlarm, 'BEGIN:VALARM'), 'Deaktivierte Erinnerung wurde dennoch erzeugt.');

$uid = calendar_test_value($summer, 'UID');
$sameUid = calendar_test_value(build_ride_request_ics($ride, calendar_test_options()), 'UID');
calendar_test_assert($uid === $sameUid, 'Identische Daten erzeugen keine stabile UID.');
$otherRide = $ride;
$otherRide['destination'] = 'Andere Klinik';
$otherUid = calendar_test_value(build_ride_request_ics($otherRide, calendar_test_options()), 'UID');
calendar_test_assert($uid !== $otherUid, 'Unterschiedliche Anfragen erzeugen dieselbe UID.');
foreach ([$ride['name'], $ride['phone'], $ride['email']] as $personalValue) {
    calendar_test_assert(!str_contains($uid, $personalValue), 'UID enthält personenbezogene Klartextdaten.');
}
calendar_test_assert((bool) preg_match('/^[a-f0-9]{64}@krankenfahrten-bad-homburg\.de$/', $uid), 'UID-Format ist ungültig.');

$escapedRide = $ride;
$escapedRide['pickup'] = "Weg 1, Haus; Rückseite\\Tor";
$escapedRide['notes'] = "Zeile 1\nZeile 2, mit; Zeichen\\";
$escaped = str_replace("\r\n ", '', build_ride_request_ics($escapedRide, calendar_test_options()));
calendar_test_assert(str_contains($escaped, 'LOCATION:Weg 1\\, Haus\\; Rückseite\\\\Tor'), 'LOCATION wurde nicht korrekt escaped.');
calendar_test_assert(str_contains($escaped, 'Zeile 1\\nZeile 2\\, mit\\; Zeichen\\\\'), 'DESCRIPTION wurde nicht korrekt escaped.');
calendar_test_assert((bool) preg_match('//u', $escaped), 'ICS ist kein gültiges UTF-8.');
calendar_test_assert(str_contains($escaped, 'Erika Müller'), 'UTF-8-Umlaute gingen verloren.');

$longRide = $ride;
$longRide['notes'] = str_repeat('Übermäßig langer Hinweis, ', 12);
$folded = build_ride_request_ics($longRide, calendar_test_options());
calendar_test_assert(str_contains($folded, "\r\n "), 'Lange ICS-Zeile wurde nicht gefaltet.');
foreach (explode("\r\n", rtrim($folded, "\r\n")) as $physicalLine) {
    calendar_test_assert(strlen($physicalLine) <= 75, 'ICS-Zeile überschreitet 75 Oktette.');
    calendar_test_assert((bool) preg_match('//u', $physicalLine), 'UTF-8-Zeichen wurde bei der Faltung getrennt.');
}
$withoutCrLf = str_replace("\r\n", '', $folded);
calendar_test_assert(!str_contains($withoutCrLf, "\r") && !str_contains($withoutCrLf, "\n"), 'ICS enthält keine reinen CRLF-Zeilenenden.');

calendar_test_assert(
    build_ride_request_ics_filename($ride) === 'krankenfahrt-2026-08-03-mueller.ics',
    'Umlaute im Dateinamen wurden nicht transliteriert.',
);
$unsafeName = $ride;
$unsafeName['name'] = "../../\r\nÄrger";
$unsafeFilename = build_ride_request_ics_filename($unsafeName);
calendar_test_assert($unsafeFilename === 'krankenfahrt-2026-08-03-aerger.ics', 'Unsicherer Dateiname wurde nicht bereinigt.');
calendar_test_assert(!str_contains($unsafeFilename, '..') && !str_contains($unsafeFilename, '/') && !str_contains($unsafeFilename, '\\'), 'Path Traversal im Dateinamen.');
$fallbackName = $ride;
$fallbackName['name'] = '---';
calendar_test_assert(build_ride_request_ics_filename($fallbackName) === 'krankenfahrt-2026-08-03.ics', 'Dateinamen-Fallback fehlt.');
calendar_test_assert(strlen(build_ride_request_ics_filename(['date' => '2026-08-03', 'name' => str_repeat('a', 200)])) <= 80, 'Dateiname ist zu lang.');

foreach ([
    ['calendar_event_duration_minutes' => 14],
    ['calendar_event_duration_minutes' => 1441],
    ['calendar_reminder_minutes' => -1],
    ['calendar_reminder_minutes' => 1441],
    ['calendar_uid_salt' => CALENDAR_UID_SALT_PLACEHOLDER],
] as $invalidOption) {
    try {
        build_ride_request_ics($ride, calendar_test_options($invalidOption));
        throw new RuntimeException('Ungültige Kalenderkonfiguration wurde akzeptiert.');
    } catch (InvalidArgumentException) {
    }
}

echo "ICS-Funktionstests erfolgreich\n";
