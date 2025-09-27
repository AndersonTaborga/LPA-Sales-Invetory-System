<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Check if user is logged in
if (!is_logged_in()) {
    redirect('login.php', 'Please login to view your order', 'warning');
}

// Get the latest order for the user using API
$apiClient = getAPIClient();
$order = null;
$order_items = [];

// Check if we have a last order ID from checkout
if (isset($_SESSION['last_order_id'])) {
    $response = $apiClient->getOrder($_SESSION['last_order_id']);
    if ($response['success'] && $response['data']['status'] === 'success') {
        $order = $response['data']['data'];
        // Get order items from the order data
        if (isset($order['orderItems']) && is_array($order['orderItems'])) {
            $order_items = $order['orderItems'];
        }
    }
    // Clear the session variable
    unset($_SESSION['last_order_id']);
}

// If no order found, redirect to home
if (!$order) {
    redirect('index.php', 'No order found', 'warning');
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Success - <?php echo SITE_NAME; ?></title>
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
                        <?php if (is_logged_in()): ?>
                            <li><a href="account.php">My Account</a></li>
                            <li><a href="logout.php">Logout</a></li>
                        <?php else: ?>
                            <li><a href="login.php">Login</a></li>
                            <li><a href="register.php">Register</a></li>
                        <?php endif; ?>
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

    <!-- Order Success Section -->
    <main class="main">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body text-center">
                            <div style="font-size: 4rem; color: #27ae60; margin-bottom: 1rem;">✅</div>
                            <h2 class="card-title">Order Placed Successfully!</h2>
                            <p class="card-text">Thank you for your purchase. Your order has been received and is being processed.</p>
                            
                            <div class="alert alert-info">
                                <strong>Order Number:</strong> #<?php echo str_pad($order['id'], 8, '0', STR_PAD_LEFT); ?><br>
                                <strong>Order Date:</strong> <?php echo date('F j, Y', strtotime($order['createdAt'])); ?><br>
                                <strong>Total Amount:</strong> <?php echo format_price($order['total_amount']); ?>
                            </div>

                            <h5 class="mt-4">Order Details</h5>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Quantity</th>
                                            <th>Price</th>
                                            <th>Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($order_items as $item): ?>
                                            <tr>
                                                <td>
                                                    <div class="d-flex align-items-center">
                                                        <?php if (isset($item['product']['image_url']) && $item['product']['image_url']): ?>
                                                            <img src="<?php echo htmlspecialchars($item['product']['image_url']); ?>" 
                                                                 alt="<?php echo htmlspecialchars($item['product']['name']); ?>" 
                                                                 class="img-thumbnail me-2" 
                                                                 style="width: 50px;">
                                                        <?php endif; ?>
                                                        <?php echo htmlspecialchars($item['product']['name']); ?>
                                                    </div>
                                                </td>
                                                <td><?php echo $item['quantity']; ?></td>
                                                <td><?php echo format_price($item['price']); ?></td>
                                                <td><?php echo format_price($item['price'] * $item['quantity']); ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                            <td><strong class="text-primary"><?php echo format_price($order['total_amount']); ?></strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div class="mt-4">
                                <h5>Shipping Information</h5>
                                <p class="mb-0"><?php echo nl2br(htmlspecialchars($order['shipping_address'])); ?></p>
                            </div>

                            <div class="mt-4">
                                <a href="account.php" class="btn btn-primary">View Order in Account</a>
                                <a href="index.php" class="btn btn-secondary">Continue Shopping</a>
                            </div>
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