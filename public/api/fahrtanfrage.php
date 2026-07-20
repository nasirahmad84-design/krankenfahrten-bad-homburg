<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

require_once __DIR__ . '/lib/validation.php';
require_once __DIR__ . '/lib/security.php';
require_once __DIR__ . '/lib/mail.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(405, ['success' => false, 'type' => 'server', 'message' => 'Methode nicht erlaubt.'], ['Allow: POST']);
$contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 16384) respond(413, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage ist zu groß.']);

$contentType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
if ($contentType === 'application/json') {
    $raw = file_get_contents('php://input', false, null, 0, 16385);
    if ($raw === false || strlen($raw) > 16384) respond(413, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage ist zu groß.']);
    try { $input = json_decode($raw, true, 32, JSON_THROW_ON_ERROR); }
    catch (JsonException) { respond(400, ['success' => false, 'type' => 'validation', 'errors' => ['form' => 'Ungültige Anfrage.']]); }
    if (!is_array($input)) respond(400, ['success' => false, 'type' => 'validation', 'errors' => ['form' => 'Ungültige Anfrage.']]);
} elseif ($contentType === 'application/x-www-form-urlencoded' || $contentType === 'multipart/form-data') {
    $input = $_POST;
} else {
    respond(415, ['success' => false, 'type' => 'server', 'message' => 'Nicht unterstützter Inhaltstyp.']);
}

if (normalize_line($input['website'] ?? '') !== '') respond(200, ['success' => true, 'message' => 'Anfrage wurde übermittelt.']);
$validation = validate_ride_request($input);
if ($validation['errors'] !== []) respond(400, ['success' => false, 'type' => 'validation', 'errors' => $validation['errors']]);
if (!valid_submission_time($input['formStartedAt'] ?? null)) respond(400, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage konnte momentan nicht übermittelt werden.']);

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) respond(500, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage konnte momentan nicht übermittelt werden.']);
$config = require $configPath;
if (!is_array($config)) respond(500, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage konnte momentan nicht übermittelt werden.']);
if (!valid_same_origin($_SERVER, (string) ($config['allowed_origin'] ?? ''))) respond(403, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage konnte momentan nicht übermittelt werden.']);
$rateLimit = check_rate_limit($_SERVER, $config);
if ($rateLimit['error']) respond(500, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage konnte momentan nicht übermittelt werden.']);
if (!$rateLimit['allowed']) respond(429, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage konnte momentan nicht übermittelt werden.']);
if (!send_ride_request_email($validation['values'], $config)) respond(500, ['success' => false, 'type' => 'server', 'message' => 'Die Anfrage konnte momentan nicht übermittelt werden.']);
respond(200, ['success' => true, 'message' => 'Anfrage wurde übermittelt.']);

function respond(int $status, array $payload, array $headers = []): never
{
    http_response_code($status);
    foreach ($headers as $header) header($header);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
