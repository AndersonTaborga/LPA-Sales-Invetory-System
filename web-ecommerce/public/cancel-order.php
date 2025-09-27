<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
// require_once '../includes/db.php'; // Removed - using API only

// Check if user is logged in
if (!is_logged_in()) {
    redirect('login.php', 'Please login to cancel your order', 'warning');
}

// Check if order ID is provided
if (!isset($_POST['order_id']) || !is_numeric($_POST['order_id'])) {
    redirect('account.php', 'Invalid order ID', 'error');
}

$order_id = (int)$_POST['order_id'];

// Get order details using API
$apiClient = getAPIClient();
$response = $apiClient->getOrder($order_id);

if (!$response['success'] || $response['data']['status'] !== 'success') {
    redirect('account.php', 'Order not found', 'error');
}

$order = $response['data']['data'];

// Check if order belongs to current user and is pending
if ($order['user_id'] != $_SESSION['user_id'] || $order['status'] !== 'pending') {
    redirect('account.php', 'Order cannot be cancelled', 'error');
}

try {
    // Update order status via API
    $updateResponse = $apiClient->updateOrderStatus($order_id, 'cancelled');
    
    if ($updateResponse['success'] && $updateResponse['data']['status'] === 'success') {
        redirect('view-order.php?id=' . $order_id, 'Order cancelled successfully', 'success');
    } else {
        redirect('view-order.php?id=' . $order_id, 'Failed to cancel order', 'error');
    }
} catch (Exception $e) {
    redirect('view-order.php?id=' . $order_id, 'Failed to cancel order', 'error');
} 