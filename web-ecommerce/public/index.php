<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Get featured products from API
$apiClient = getAPIClient();
$response = $apiClient->getProducts(['limit' => 8]);

if ($response['success'] && $response['data']['status'] === 'success') {
    $products = $response['data']['data'];
} else {
    $products = [];
    $error_message = $response['error'] ?? 'Error loading products';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?> - Computer Peripherals</title>
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

    <!-- Hero Section -->
    <section class="hero">
        <div class="container">
            <h1>Welcome to <?php echo SITE_NAME; ?></h1>
            <p>Your one-stop shop for premium computer peripherals</p>
            <a href="products.php" class="btn" style="background: white; color: #667eea; font-weight: bold;">
                Shop Now
            </a>
        </div>
    </section>

    <!-- Featured Products -->
    <main class="main">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 3rem;">Featured Products</h2>
            
            <?php if (isset($error_message)): ?>
                <div class="alert alert-error">
                    <strong>Error:</strong> <?php echo $error_message; ?>
                    <p>Please check if the backend is running at http://localhost:5000</p>
                </div>
            <?php elseif (empty($products)): ?>
                <div class="alert alert-info">
                    <h3>No products found</h3>
                    <p>Please check the backend connection or if there are products in the database.</p>
                </div>
            <?php else: ?>
                <div class="grid">
                    <?php foreach ($products as $product): ?>
                        <div class="card">
                            <img src="<?php echo $product['image_url'] ?: 'assets/images/default-product.jpg'; ?>" 
                                 alt="<?php echo htmlspecialchars($product['name']); ?>">
                            <div class="card-content">
                                <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                                <p><?php echo htmlspecialchars($product['description']); ?></p>
                                <div class="price"><?php echo format_price($product['price']); ?></div>
                                <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">
                                    Stock: <?php echo $product['stock']; ?> units
                                    <?php if ($product['stock'] <= 10): ?>
                                        <span style="color: #f39c12;">(Low Stock)</span>
                                    <?php elseif ($product['stock'] == 0): ?>
                                        <span style="color: #e74c3c;">(Out of Stock)</span>
                                    <?php endif; ?>
                                </p>
                                <form action="cart.php" method="POST">
                                    <input type="hidden" name="action" value="add">
                                    <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                    <button type="submit" class="btn btn-primary" 
                                            <?php echo $product['stock'] == 0 ? 'disabled' : ''; ?>>
                                        <?php echo $product['stock'] == 0 ? 'Out of Stock' : 'Add to Cart'; ?>
                                    </button>
                                </form>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                
                <div style="text-align: center; margin-top: 3rem;">
                    <a href="products.php" class="btn btn-primary" style="font-size: 1.1rem; padding: 1rem 2rem;">
                        View All Products
                    </a>
                </div>
            <?php endif; ?>
        </div>
    </main>

    <!-- Features Section -->
    <section style="background: #f8f9fa; padding: 3rem 0;">
        <div class="container">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem;">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🚚</div>
                    <h3>Fast Shipping</h3>
                    <p>Quick and secure delivery across Australia</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🛡️</div>
                    <h3>Warranty</h3>
                    <p>Quality products with technical support</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">💳</div>
                    <h3>Secure Payment</h3>
                    <p>Multiple secure payment methods</p>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📞</div>
                    <h3>24/7 Support</h3>
                    <p>Customer service available 24 hours</p>
                </div>
            </div>
        </div>
    </section>

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