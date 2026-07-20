<?php
declare(strict_types=1);

function valid_same_origin(array $server, string $allowedOrigin): bool
{
    $origin = trim((string) ($server['HTTP_ORIGIN'] ?? ''));
    if ($origin === '') return true;
    return hash_equals(rtrim($allowedOrigin, '/'), rtrim($origin, '/'));
}

function valid_submission_time(mixed $startedAt, ?int $nowMilliseconds = null): bool
{
    if (!is_int($startedAt) && !is_float($startedAt) && !is_string($startedAt)) return false;
    if (!is_numeric($startedAt)) return false;
    $started = (int) $startedAt;
    $now = $nowMilliseconds ?? (int) floor(microtime(true) * 1000);
    $age = $now - $started;
    return $started > 0 && $age >= 2500 && $age <= 7200000;
}

function check_rate_limit(array $server, array $config, ?int $now = null): array
{
    $ip = (string) ($server['REMOTE_ADDR'] ?? 'unknown');
    $salt = (string) ($config['rate_limit_salt'] ?? '');
    $directory = (string) ($config['rate_limit_dir'] ?? '');
    $limit = max(1, (int) ($config['rate_limit_count'] ?? 10));
    $window = max(60, (int) ($config['rate_limit_window'] ?? 600));
    $now = $now ?? time();
    if (strlen($salt) < 24 || $directory === '') return ['allowed' => false, 'error' => true];
    if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) return ['allowed' => false, 'error' => true];

    $identifier = hash_hmac('sha256', $ip, $salt);
    $path = rtrim($directory, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . $identifier . '.json';
    $handle = @fopen($path, 'c+');
    if (!$handle || !flock($handle, LOCK_EX)) {
        if (is_resource($handle)) fclose($handle);
        return ['allowed' => false, 'error' => true];
    }
    $raw = stream_get_contents($handle);
    $timestamps = json_decode($raw ?: '[]', true);
    if (!is_array($timestamps)) $timestamps = [];
    $timestamps = array_values(array_filter($timestamps, static fn($timestamp): bool => is_int($timestamp) && $timestamp > $now - $window));
    $allowed = count($timestamps) < $limit;
    if ($allowed) $timestamps[] = $now;
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, json_encode($timestamps, JSON_THROW_ON_ERROR));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
    @chmod($path, 0600);
    return ['allowed' => $allowed, 'error' => false];
}
