<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Check if user is logged in
if (!is_logged_in()) {
    redirect('login.php', 'Please login to view your order', 'warning');
}

// Check if order ID is provided
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    redirect('account.php', 'Invalid order ID', 'error');
}

$order_id = (int)$_GET['id'];

// Get order details using API
$apiClient = getAPIClient();
$response = $apiClient->getOrder($order_id);

if (!$response['success'] || $response['data']['status'] !== 'success') {
    redirect('account.php', 'Order not found', 'error');
}

$order = $response['data']['data'];

// Check if order belongs to current user
if ($order['user_id'] != $_SESSION['user_id']) {
    redirect('account.php', 'Order not found', 'error');
}

// Get order items from the order data
$order_items = [];
if (isset($order['orderItems']) && is_array($order['orderItems'])) {
    $order_items = $order['orderItems'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order #<?php echo str_pad($order['id'], 8, '0', STR_PAD_LEFT); ?> - <?php echo SITE_NAME; ?></title>
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

    <!-- Order Details Section -->
    <main class="main">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <nav class="breadcrumb">
                        <a href="account.php">My Account</a>
                        <span class="active">Order #<?php echo str_pad($order['id'], 8, '0', STR_PAD_LEFT); ?></span>
                    </nav>

                    <div class="card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-center mb-4">
                                <h2 class="card-title">Order Details</h2>
                                <span class="badge bg-<?php echo get_order_status_class($order['status']); ?> fs-5">
                                    <?php echo ucfirst($order['status']); ?>
                                </span>
                            </div>

                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h5>Order Information</h5>
                                    <p class="mb-1"><strong>Order Number:</strong> #<?php echo str_pad($order['id'], 8, '0', STR_PAD_LEFT); ?></p>
                                    <p class="mb-1"><strong>Order Date:</strong> <?php echo date('F j, Y', strtotime($order['createdAt'])); ?></p>
                                    <p class="mb-1"><strong>Status:</strong> <?php echo ucfirst($order['status']); ?></p>
                                    <p class="mb-1"><strong>Total Amount:</strong> <?php echo format_price($order['total_amount']); ?></p>
                                </div>
                                <div class="col-md-6">
                                    <h5>Shipping Address</h5>
                                    <p class="mb-0"><?php echo nl2br(htmlspecialchars($order['shipping_address'])); ?></p>
                                </div>
                            </div>

                            <h5>Order Items</h5>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th class="text-end">Subtotal</th>
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
                                                <td><?php echo format_price($item['price']); ?></td>
                                                <td><?php echo $item['quantity']; ?></td>
                                                <td class="text-end"><?php echo format_price($item['price'] * $item['quantity']); ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="3" class="text-end"><strong>Total:</strong></td>
                                            <td class="text-end"><strong><?php echo format_price($order['total_amount']); ?></strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                            <div class="mt-4">
                                <a href="account.php" class="btn btn-primary">Back to My Account</a>
                                <?php if ($order['status'] === 'pending'): ?>
                                    <button type="button" class="btn btn-danger" onclick="confirmCancelOrder()">
                                        Cancel Order
                                    </button>
                                <?php endif; ?>
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

    <script>
        function confirmCancelOrder() {
            if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'cancel-order.php';
                
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'order_id';
                input.value = '<?php echo $order['id']; ?>';
                
                form.appendChild(input);
                document.body.appendChild(form);
                form.submit();
            }
        }
    </script>
</body>
</html>