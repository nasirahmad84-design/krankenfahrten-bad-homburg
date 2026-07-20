<?php
declare(strict_types=1);

return [
    'mail_to' => 'anfrage@krankenfahrten-bad-homburg.de',
    'mail_from' => 'formular@krankenfahrten-bad-homburg.de',
    'allowed_origin' => 'https://www.krankenfahrten-bad-homburg.de',
    'rate_limit_salt' => 'BITTE-DURCH-EIN-LANGES-ZUFAELLIGES-GEHEIMNIS-ERSETZEN',
    'rate_limit_dir' => sys_get_temp_dir() . '/krankenfahrten-rate-limit',
    'rate_limit_count' => 10,
    'rate_limit_window' => 600,
    'environment' => 'production',
    'mail_transport' => 'mail',
];
