<?php
declare(strict_types=1);

return [
    'mail_transport' => 'smtp',
    'smtp_host' => 'w01267fe.kasserver.com',
    'smtp_port' => 587,
    'smtp_secure' => 'tls',
    'smtp_auth' => true,
    'smtp_username' => 'anfrage@krankenfahrten-bad-homburg.de',
    'smtp_password' => 'HIER-NUR-AUF-DEM-SERVER-EINTRAGEN',
    'smtp_timeout' => 15,
    'mail_to' => 'anfrage@krankenfahrten-bad-homburg.de',
    'mail_from' => 'anfrage@krankenfahrten-bad-homburg.de',
    'mail_from_name' => 'Krankenfahrten Bad Homburg',
    'allowed_origin' => 'https://krankenfahrten-bad-homburg.de',
    'rate_limit_salt' => 'BITTE-DURCH-EIN-LANGES-ZUFAELLIGES-GEHEIMNIS-ERSETZEN',
    'rate_limit_dir' => sys_get_temp_dir() . '/krankenfahrten-rate-limit',
    'rate_limit_count' => 10,
    'rate_limit_window' => 600,
    'minimum_form_age_ms' => 2500,
    'maximum_form_age_ms' => 7200000,
    'environment' => 'production',
];
