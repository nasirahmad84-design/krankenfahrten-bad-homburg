<?php
// Regression fixture: included settings must not overwrite the caller's $config.
$config = ['outreach_daily_limit' => 1];
return $config;
