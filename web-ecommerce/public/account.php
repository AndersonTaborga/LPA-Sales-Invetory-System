<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Check if user is logged in
if (!is_logged_in()) {
    redirect('login.php', 'Please login to view your account', 'warning');
}

// Get user information from API
$apiClient = getAPIClient();
$user = getAPIUser(); // Get user from session

// If user not found, redirect to login
if (!$user) {
    redirect('login.php', 'User not found', 'error');
}

// Get user's orders from API
$ordersResponse = $apiClient->getOrders(['user_id' => $user['id']]);
$orders = [];

if ($ordersResponse['success'] && $ordersResponse['data']['status'] === 'success') {
    $orders = $ordersResponse['data']['data'];
}

// Sanitize user data
$userFullName = sanitize(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));
$userEmail = sanitize($user['email']);
$userAddress = sanitize($user['address'] ?? '');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Account - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <div class="container">
            <div class="header-content">
                <div class="logo">
                    <a href="index.php"><?php echo SITE_NAME; ?></a>
                </div>
                <nav>
                    <ul class="nav">
                        <li><a href="index.php">Home</a></li>
                        <li><a href="products.php">Products</a></li>
                        <li>
                            <a href="cart.php" class="cart-link">
                                Cart
                                <?php $cartCount = get_cart_count(); if ($cartCount > 0): ?>
                                    <span class="badge"><?php echo $cartCount; ?></span>
                                <?php endif; ?>
                            </a>
                        </li>
                        <li><a href="account.php" class="active">My Account</a></li>
                        <li><a href="logout.php">Logout</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>

    <!-- Flash Messages -->
    <?php if ($message = get_flash_message()): ?>
        <div class="alert alert-<?php echo $message['type']; ?>">
            <?php echo $message['message']; ?>
        </div>
    <?php endif; ?>

    <!-- Account Section -->
    <main class="main">
        <div class="container">
            <div class="row">
                <!-- Account Information -->
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Account Information</h4>
                            <div class="mb-3">
                                <strong>Name:</strong> <?php echo $userFullName; ?>
                            </div>
                            <div class="mb-3">
                                <strong>Email:</strong> <?php echo $userEmail; ?>
                            </div>
                            <a href="edit-profile.php" class="btn btn-primary">Edit Profile</a>
                            <a href="change-password.php" class="btn btn-secondary">Change Password</a>
                        </div>
                    </div>

                    <!-- Default Shipping Address -->
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Default Shipping Address</h4>
                            <?php if (!empty($userAddress)): ?>
                                <p class="mb-3"><?php echo nl2br($userAddress); ?></p>
                            <?php else: ?>
                                <p class="text-muted">No default shipping address set.</p>
                            <?php endif; ?>
                            <a href="edit-address.php" class="btn btn-primary">Update Address</a>
                        </div>
                    </div>
                </div>

                <!-- Order History -->
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body">
                            <h4 class="card-title">Order History</h4>
                            <?php if ($orders): ?>
                                <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th>Order #</th>
                                                <th>Date</th>
                                                <th>Items</th>
                                                <th>Total</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <?php foreach ($orders as $order): ?>
                                                <tr>
                                                    <td>#<?php echo str_pad($order['id'], 8, '0', STR_PAD_LEFT); ?></td>
                                                    <td><?php echo date('M j, Y', strtotime($order['createdAt'] ?? $order['created_at'])); ?></td>
                                                    <td><?php echo count($order['orderItems'] ?? []); ?></td>
                                                    <td><?php echo format_price($order['total_amount']); ?></td>
                                                    <td>
                                                        <span class="badge bg-<?php echo get_order_status_class($order['status']); ?>">
                                                            <?php echo ucfirst($order['status']); ?>
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <a href="view-order.php?id=<?php echo $order['id']; ?>" 
                                                           class="btn btn-sm btn-primary">
                                                            View Details
                                                        </a>
                                                    </td>
                                                </tr>
                                            <?php endforeach; ?>
                                        </tbody>
                                    </table>
                                </div>
                            <?php else: ?>
                                <p class="text-muted">No orders found.</p>
                                <a href="products.php" class="btn btn-primary">Start Shopping</a>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div>
                    <h3>About Us</h3>
                    <p>Logic Peripherals Australia is your trusted source for high-quality computer peripherals.</p>
                </div>
                <div>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><a href="about.php">About Us</a></li>
                        <li><a href="contact.php">Contact</a></li>
                        <li><a href="shipping.php">Shipping</a></li>
                        <li><a href="returns.php">Returns</a></li>
                    </ul>
                </div>
                <div>
                    <h3>Contact Info</h3>
                    <ul>
                        <li>📞 +61 2 1234 5678</li>
                        <li>📧 info@lpa.com.au</li>
                        <li>📍 Sydney, Australia</li>
                    </ul>
                </div>
            </div>
        </div>
    </footer>
</body>
</html>