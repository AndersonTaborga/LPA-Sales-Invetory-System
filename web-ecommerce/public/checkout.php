<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Check if user is logged in
if (!is_logged_in()) {
    redirect('login.php', 'Please login to complete your purchase', 'warning');
}

// Check if cart is empty
$cartData = get_cart_items();
if ($cartData['count'] == 0) {
    redirect('cart.php', 'Your cart is empty', 'warning');
}

$cart_items = $cartData['items'];
$total = $cartData['total'];

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_POST['csrf_token']) || !verify_csrf_token($_POST['csrf_token'])) {
        redirect('checkout.php', 'Invalid request', 'danger');
    }

    // Validate form data
    $required_fields = ['shipping_address', 'payment_method'];
    $errors = [];

    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            $errors[] = ucfirst(str_replace('_', ' ', $field)) . ' is required';
        }
    }

    if (empty($errors)) {
        try {
            // Get user data from session
            $user = getAPIUser();
            
            // Prepare order data for API
            $orderData = [
                'user_id' => $_SESSION['user_id'],
                'total_amount' => $total,
                'shipping_address' => $_POST['shipping_address'],
                'payment_method' => $_POST['payment_method'],
                'customer_name' => ($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''),
                'customer_email' => $user['email'] ?? '',
                'customer_phone' => $user['phone'] ?? '',
                'notes' => 'Order placed via web e-commerce',
                'order_items' => []
            ];

            // Add order items
            foreach ($cart_items as $item) {
                $orderData['order_items'][] = [
                    'product_id' => $item['product']['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['product']['price']
                ];
            }

            // Create order via API
            $apiClient = getAPIClient();
            $response = $apiClient->createOrder($orderData);
            
            if ($response['success'] && $response['data']['status'] === 'success') {
                // Clear cart
                clear_cart();
                
                // Store order ID for success page
                $_SESSION['last_order_id'] = $response['data']['data']['id'];
                
                // Redirect to success page
                redirect('order-success.php', 'Order placed successfully!', 'success');
            } else {
                $errors[] = 'Failed to create order. Please try again.';
            }
        } catch (Exception $e) {
            $errors[] = 'An error occurred while processing your order. Please try again.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout - <?php echo SITE_NAME; ?></title>
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

    <!-- Checkout Section -->
    <main class="main">
        <div class="container">
            <h2 class="mb-4">Checkout</h2>

            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger">
                    <ul class="mb-0">
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo $error; ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>

            <div class="row">
                <!-- Checkout Form -->
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-body">
                            <form method="POST" class="needs-validation" novalidate>
                                <input type="hidden" name="csrf_token" value="<?php echo generate_csrf_token(); ?>">

                                <!-- Shipping Information -->
                                <h5 class="mb-3">Shipping Information</h5>
                                <div class="form-group">
                                    <label for="shipping_address">Shipping Address</label>
                                    <textarea class="form-control" id="shipping_address" name="shipping_address" rows="3" required></textarea>
                                    <div class="invalid-feedback">
                                        Please enter your shipping address.
                                    </div>
                                </div>

                                <!-- Payment Method -->
                                <h5 class="mb-3">Payment Method</h5>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="payment_method" id="credit_card" value="credit_card" required>
                                        <label class="form-check-label" for="credit_card">
                                            Credit Card
                                        </label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="radio" name="payment_method" id="paypal" value="paypal" required>
                                        <label class="form-check-label" for="paypal">
                                            PayPal
                                        </label>
                                    </div>
                                    <div class="invalid-feedback">
                                        Please select a payment method.
                                    </div>
                                </div>

                                <!-- Credit Card Details (shown when credit card is selected) -->
                                <div id="credit_card_details" class="form-group" style="display: none;">
                                    <div class="row">
                                        <div class="col-md-6">
                                            <label for="card_number">Card Number</label>
                                            <input type="text" class="form-control" id="card_number" placeholder="1234 5678 9012 3456">
                                        </div>
                                        <div class="col-md-3">
                                            <label for="expiry">Expiry</label>
                                            <input type="text" class="form-control" id="expiry" placeholder="MM/YY">
                                        </div>
                                        <div class="col-md-3">
                                            <label for="cvv">CVV</label>
                                            <input type="text" class="form-control" id="cvv" placeholder="123">
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" class="btn btn-primary">Place Order</button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Order Summary</h5>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($cart_items as $item): ?>
                                            <tr>
                                                <td><?php echo $item['product']['name']; ?></td>
                                                <td><?php echo $item['quantity']; ?></td>
                                                <td><?php echo format_price($item['subtotal']); ?></td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="2"><strong>Subtotal:</strong></td>
                                            <td><?php echo format_price($total); ?></td>
                                        </tr>
                                        <tr>
                                            <td colspan="2"><strong>Shipping:</strong></td>
                                            <td>Free</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2"><strong>Total:</strong></td>
                                            <td><strong class="text-primary"><?php echo format_price($total); ?></strong></td>
                                        </tr>
                                    </tfoot>
                                </table>
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
        // Show/hide credit card details based on payment method selection
        document.querySelectorAll('input[name="payment_method"]').forEach(input => {
            input.addEventListener('change', function() {
                const creditCardDetails = document.getElementById('credit_card_details');
                creditCardDetails.style.display = this.value === 'credit_card' ? 'block' : 'none';
            });
        });

        // Form validation
        (function() {
            'use strict';
            
            const forms = document.querySelectorAll('.needs-validation');
            
            Array.from(forms).forEach(form => {
                form.addEventListener('submit', event => {
                    if (!form.checkValidity()) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add('was-validated');
                }, false);
            });
        })();
    </script>
</body>
</html>