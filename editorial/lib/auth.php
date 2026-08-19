<?php
declare(strict_types=1);

const EDITORIAL_SESSION_NAME = 'KFBH_EDITORIAL';
const EDITORIAL_IDLE_TIMEOUT = 1800;
const EDITORIAL_ABSOLUTE_TIMEOUT = 28800;
const EDITORIAL_OTP_LIFETIME = 600;
const EDITORIAL_OTP_MAX_ATTEMPTS = 5;
const EDITORIAL_OTP_COOLDOWN = 60;

function editorial_send_security_headers(): void
{
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('X-Robots-Tag: noindex, nofollow, noarchive');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    header("Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()");
    header("Content-Security-Policy: default-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; img-src 'self'; style-src 'self'");
}

function editorial_start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) return;
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.use_trans_sid', '0');
    session_name(EDITORIAL_SESSION_NAME);
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/redaktion/',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
}

function editorial_csrf_token(array &$session): string
{
    if (!isset($session['csrf_token']) || !is_string($session['csrf_token']) || strlen($session['csrf_token']) !== 64) {
        $session['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $session['csrf_token'];
}

function editorial_valid_csrf(array $session, mixed $token): bool
{
    return is_string($token)
        && isset($session['csrf_token'])
        && is_string($session['csrf_token'])
        && hash_equals($session['csrf_token'], $token);
}

function editorial_generate_code(): string
{
    return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}

function editorial_code_hash(string $code, string $salt): string
{
    return hash_hmac('sha256', $code, $salt);
}

function editorial_store_code(array &$session, string $code, string $salt, int $now): void
{
    $session['otp_hash'] = editorial_code_hash($code, $salt);
    $session['otp_expires_at'] = $now + EDITORIAL_OTP_LIFETIME;
    $session['otp_attempts'] = 0;
    $session['otp_sent_at'] = $now;
}

function editorial_clear_code(array &$session): void
{
    unset($session['otp_hash'], $session['otp_expires_at'], $session['otp_attempts'], $session['otp_sent_at']);
}

function editorial_verify_code(array &$session, string $code, string $salt, int $now): bool
{
    if (!preg_match('/^\d{6}$/D', $code)) return false;
    if (!isset($session['otp_hash'], $session['otp_expires_at'], $session['otp_attempts'])) return false;
    if (!is_string($session['otp_hash']) || !is_int($session['otp_expires_at']) || !is_int($session['otp_attempts'])) return false;
    if ($session['otp_expires_at'] < $now || $session['otp_attempts'] >= EDITORIAL_OTP_MAX_ATTEMPTS) {
        editorial_clear_code($session);
        return false;
    }

    $session['otp_attempts']++;
    if (!hash_equals($session['otp_hash'], editorial_code_hash($code, $salt))) {
        if ($session['otp_attempts'] >= EDITORIAL_OTP_MAX_ATTEMPTS) editorial_clear_code($session);
        return false;
    }

    editorial_clear_code($session);
    $session['authenticated'] = true;
    $session['authenticated_at'] = $now;
    $session['last_activity_at'] = $now;
    return true;
}

function editorial_is_authenticated(array &$session, int $now): bool
{
    if (($session['authenticated'] ?? false) !== true) return false;
    $started = $session['authenticated_at'] ?? null;
    $lastActivity = $session['last_activity_at'] ?? null;
    if (!is_int($started) || !is_int($lastActivity)) return false;
    if ($now - $lastActivity > EDITORIAL_IDLE_TIMEOUT || $now - $started > EDITORIAL_ABSOLUTE_TIMEOUT) {
        unset($session['authenticated'], $session['authenticated_at'], $session['last_activity_at']);
        return false;
    }
    $session['last_activity_at'] = $now;
    return true;
}

function editorial_mask_email(string $email): string
{
    $parts = explode('@', $email, 2);
    if (count($parts) !== 2 || $parts[0] === '') return 'hinterlegtes Postfach';
    return substr($parts[0], 0, 1) . str_repeat('•', max(3, min(8, strlen($parts[0]) - 1))) . '@' . $parts[1];
}

function editorial_api_path(string $relative): string
{
    $webPath = dirname(__DIR__, 2) . '/api/' . ltrim($relative, '/');
    if (is_file($webPath)) return $webPath;
    return dirname(__DIR__, 2) . '/public/api/' . ltrim($relative, '/');
}

function editorial_load_config(): ?array
{
    $path = editorial_api_path('config.php');
    if (!is_file($path)) return null;
    $config = require $path;
    if (!is_array($config)) return null;
    $loginConfigPath = dirname(__DIR__) . '/login-config.php';
    if (is_file($loginConfigPath)) {
        $loginConfig = require $loginConfigPath;
        if (is_array($loginConfig) && is_string($loginConfig['editorial_login_email'] ?? null)) {
            $config['editorial_login_email'] = $loginConfig['editorial_login_email'];
        }
    }
    return $config;
}

function editorial_login_email(array $config): ?string
{
    $email = $config['editorial_login_email'] ?? null;
    return is_string($email) && filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
}

function editorial_login_salt(array $config): ?string
{
    $salt = $config['rate_limit_salt'] ?? null;
    return is_string($salt) && strlen($salt) >= 24 ? $salt : null;
}

function editorial_check_code_request(array $server, array $config, int $now): bool
{
    $securityPath = editorial_api_path('lib/security.php');
    if (!function_exists('check_rate_limit')) {
        if (!is_file($securityPath)) return false;
        require_once $securityPath;
    }
    $baseDirectory = $config['rate_limit_dir'] ?? null;
    if (!is_string($baseDirectory) || $baseDirectory === '') return false;
    $rateConfig = $config;
    $rateConfig['rate_limit_dir'] = rtrim($baseDirectory, DIRECTORY_SEPARATOR) . '-editorial-login';
    $rateConfig['rate_limit_count'] = 5;
    $rateConfig['rate_limit_window'] = 3600;
    $result = check_rate_limit($server, $rateConfig, $now);
    return ($result['allowed'] ?? false) === true && ($result['error'] ?? true) === false;
}

function editorial_send_login_code(string $code, array $config, ?callable $sender = null): bool
{
    $mailPath = editorial_api_path('lib/mail.php');
    if (!function_exists('validated_smtp_config')) {
        if (!is_file($mailPath)) return false;
        require_once $mailPath;
    }
    $smtp = validated_smtp_config($config);
    $recipient = editorial_login_email($config);
    if ($smtp === null || $recipient === null) return false;
    $payload = [
        'to' => $recipient,
        'from' => $smtp['mail_from'],
        'from_name' => $smtp['mail_from_name'],
        'reply_to' => null,
        'subject' => 'Anmeldecode für das Redaktionscockpit',
        'body' => "Dein Anmeldecode für das Redaktionscockpit lautet:\n\n{$code}\n\nDer Code ist 10 Minuten gültig und kann nur einmal verwendet werden. Falls du ihn nicht angefordert hast, ignoriere diese E-Mail.",
    ];

    if ($sender !== null) {
        try {
            return $sender($payload, $smtp) === true;
        } catch (Throwable) {
            return false;
        }
    }

    $autoload = editorial_api_path('vendor/autoload.php');
    if (!is_file($autoload) || !extension_loaded('openssl')) return false;
    try {
        require_once $autoload;
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
        $mailer->setFrom($payload['from'], $payload['from_name']);
        $mailer->addAddress($payload['to']);
        $mailer->isHTML(false);
        $mailer->Subject = $payload['subject'];
        $mailer->Body = $payload['body'];
        return $mailer->send();
    } catch (Throwable) {
        return false;
    }
}

function editorial_issue_code(array &$session, array $server, array $config, int $now, ?callable $sender = null): bool
{
    $salt = editorial_login_salt($config);
    if ($salt === null) return false;
    if (isset($session['otp_sent_at']) && is_int($session['otp_sent_at']) && $now - $session['otp_sent_at'] < EDITORIAL_OTP_COOLDOWN) return true;
    if (!editorial_check_code_request($server, $config, $now)) return false;
    $code = editorial_generate_code();
    if (!editorial_send_login_code($code, $config, $sender)) return false;
    editorial_store_code($session, $code, $salt, $now);
    return true;
}

function editorial_logout(): void
{
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(EDITORIAL_SESSION_NAME, '', [
            'expires' => time() - 42000,
            'path' => $params['path'],
            'domain' => $params['domain'],
            'secure' => $params['secure'],
            'httponly' => $params['httponly'],
            'samesite' => $params['samesite'] ?? 'Strict',
        ]);
    }
    session_destroy();
}
