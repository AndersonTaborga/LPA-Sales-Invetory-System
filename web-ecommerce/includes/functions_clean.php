<?php
/**
 * Clean Functions File - Sem funções de carrinho duplicadas
 * =========================================================
 */

/**
 * Sanitize user input
 */
function sanitize($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Generate CSRF token
 */
function generate_csrf_token() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify CSRF token
 */
function verify_csrf_token($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Format price in AUD
 */
function format_price($price) {
    return CURRENCY_SYMBOL . number_format($price, 2);
}

/**
 * Check if user is logged in
 */
function is_logged_in() {
    return isset($_SESSION['user_id']) || isset($_SESSION['api_user']);
}

/**
 * Redirect with message
 */
function redirect($url, $message = '', $type = 'success') {
    if ($message) {
        set_flash_message($type, $message);
    }
    header("Location: $url");
    exit;
}

/**
 * Get flash message
 */
function get_flash_message() {
    if (isset($_SESSION['flash_message'])) {
        $message = $_SESSION['flash_message'];
        unset($_SESSION['flash_message']);
        return $message;
    }
    return null;
}

/**
 * Validate email
 */
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Get product by ID (using API)
 */
function get_product($id) {
    $apiClient = getAPIClient();
    $response = $apiClient->getProduct($id);
    
    if ($response['success'] && $response['data']['status'] === 'success') {
        return $response['data']['data'];
    }
    return null;
}

/**
 * Calculate cart total (using API)
 */
function calculate_cart_total() {
    $total = 0;
    if (!empty($_SESSION['cart'])) {
        $apiClient = getAPIClient();
        
        foreach ($_SESSION['cart'] as $productId => $quantity) {
            $product = get_product($productId);
            if ($product) {
                $total += $product['price'] * $quantity;
            }
        }
    }
    return $total;
}

/**
 * Log activity (simplified for API-only mode)
 */
function log_activity($user_id, $action, $details = '') {
    // Log to session or file for API-only mode
    if (!isset($_SESSION['activity_log'])) {
        $_SESSION['activity_log'] = [];
    }
    $_SESSION['activity_log'][] = [
        'user_id' => $user_id,
        'action' => $action,
        'details' => $details,
        'timestamp' => date('Y-m-d H:i:s')
    ];
}

/**
 * Set flash message
 */
function set_flash_message($type, $message) {
    $_SESSION['flash_message'] = [
        'type' => $type,
        'message' => $message
    ];
}

/**
 * Get the Bootstrap badge class for an order status
 */
function get_order_status_class($status) {
    switch (strtolower($status)) {
        case 'pending':
            return 'warning';
        case 'processing':
            return 'info';
        case 'shipped':
            return 'primary';
        case 'delivered':
            return 'success';
        case 'cancelled':
            return 'danger';
        default:
            return 'secondary';
    }
}
?>
