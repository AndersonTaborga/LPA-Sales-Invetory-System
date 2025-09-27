<?php
// API Configuration
define('API_BASE_URL', 'http://localhost:5000');
define('API_TIMEOUT', 30);

// Site Configuration
define('SITE_NAME', 'Logic Peripherals Australia');
define('SITE_URL', 'http://localhost/cluster');
define('CURRENCY', 'AUD');
define('CURRENCY_SYMBOL', '$');

// Security Configuration
define('HASH_COST', 12); // For password hashing
define('SESSION_LIFETIME', 3600); // 1 hour
define('CSRF_TOKEN_SECRET', 'your-secret-key-here');

// Error Reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Time Zone
date_default_timezone_set('Australia/Sydney');

// Include session configuration
require_once __DIR__ . '/session_config.php';

// Security Headers
header("X-Frame-Options: SAMEORIGIN");
header("X-XSS-Protection: 1; mode=block");
header("X-Content-Type-Options: nosniff");
header("Referrer-Policy: strict-origin-when-cross-origin");

// Include API Client
require_once __DIR__ . '/api_client.php';
?> 