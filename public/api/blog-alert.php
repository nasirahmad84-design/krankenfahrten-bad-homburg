<?php
declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, max-age=0');

require_once __DIR__ . '/lib/blog-alert.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') blog_alert_respond(405, ['success' => false], ['Allow: POST']);
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 4096) blog_alert_respond(413, ['success' => false]);

$contentType = strtolower(trim(explode(';', (string) ($_SERVER['CONTENT_TYPE'] ?? ''))[0]));
if ($contentType !== 'application/json') blog_alert_respond(415, ['success' => false]);

$alertConfigPath = __DIR__ . '/.blog-alert-config.php';
$smtpConfigPath = __DIR__ . '/config.php';
if (!is_file($alertConfigPath) || !is_file($smtpConfigPath)) blog_alert_respond(500, ['success' => false]);
$alertConfig = require $alertConfigPath;
$smtpConfig = require $smtpConfigPath;
if (!is_array($alertConfig) || !is_array($smtpConfig)) blog_alert_respond(500, ['success' => false]);

$token = $_SERVER['HTTP_X_BLOG_ALERT_TOKEN'] ?? null;
if (!valid_blog_alert_token($token, $alertConfig)) blog_alert_respond(404, ['success' => false]);

$raw = file_get_contents('php://input', false, null, 0, 4097);
if ($raw === false || strlen($raw) > 4096) blog_alert_respond(413, ['success' => false]);
try { $input = json_decode($raw, true, 16, JSON_THROW_ON_ERROR); }
catch (JsonException) { blog_alert_respond(400, ['success' => false]); }

$event = validate_blog_alert_event($input);
if ($event === null) blog_alert_respond(400, ['success' => false]);
if (!send_blog_alert_email($event, $smtpConfig, $alertConfig)) blog_alert_respond(500, ['success' => false]);
blog_alert_respond(204, []);

function blog_alert_respond(int $status, array $payload, array $headers = []): never
{
    http_response_code($status);
    foreach ($headers as $header) header($header);
    if ($status !== 204) echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
