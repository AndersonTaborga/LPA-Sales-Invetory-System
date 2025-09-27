<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Get category filter
$category = isset($_GET['category']) ? sanitize($_GET['category']) : '';
$sort = isset($_GET['sort']) ? sanitize($_GET['sort']) : 'name_asc';

// Get products from API
$apiClient = getAPIClient();
$params = [];

if ($category) {
    $params['category'] = $category;
}

$response = $apiClient->getProducts($params);

if ($response['success'] && $response['data']['status'] === 'success') {
    $products = $response['data']['data'];
} else {
    $products = [];
    $error_message = $response['error'] ?? 'Error loading products';
}

// Get categories from API
$categoriesResponse = $apiClient->getCategories();
if ($categoriesResponse['success'] && $categoriesResponse['data']['status'] === 'success') {
    $categories = array_column($categoriesResponse['data']['data'], 'name');
} else {
    $categories = [];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Products - <?php echo SITE_NAME; ?></title>
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

    <!-- Main Content -->
    <main class="main">
        <div class="container">
            <h1>Products</h1>
            
            <!-- Flash Messages -->
            <?php if ($message = get_flash_message()): ?>
                <div class="alert alert-<?php echo $message['type']; ?>">
                    <?php echo $message['message']; ?>
                </div>
            <?php endif; ?>

            <div style="display: flex; gap: 2rem;">
                <!-- Filters Sidebar -->
                <div style="width: 280px;">
                    <div class="card">
                        <div class="card-content">
                            <h3>Filters</h3>
                            <form action="products.php" method="GET">
                                <!-- Category Filter -->
                                <div class="form-group">
                                    <label>Category</label>
                                    <select name="category" class="form-control" onchange="this.form.submit()">
                                        <option value="">All Categories</option>
                                        <?php foreach ($categories as $cat): ?>
                                            <option value="<?php echo $cat; ?>" <?php echo $category === $cat ? 'selected' : ''; ?>>
                                                <?php echo ucfirst($cat); ?>
                                            </option>
                                        <?php endforeach; ?>
                                    </select>
                                </div>

                                <!-- Sort Filter -->
                                <div class="form-group">
                                    <label>Sort By</label>
                                    <select name="sort" class="form-control" onchange="this.form.submit()">
                                        <option value="name_asc" <?php echo $sort === 'name_asc' ? 'selected' : ''; ?>>Name (A-Z)</option>
                                        <option value="name_desc" <?php echo $sort === 'name_desc' ? 'selected' : ''; ?>>Name (Z-A)</option>
                                        <option value="price_asc" <?php echo $sort === 'price_asc' ? 'selected' : ''; ?>>Price (Low to High)</option>
                                        <option value="price_desc" <?php echo $sort === 'price_desc' ? 'selected' : ''; ?>>Price (High to Low)</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Products Grid -->
                <div style="flex: 1;">
                    <?php if (isset($error_message)): ?>
                        <div class="alert alert-error">
                            <strong>Error:</strong> <?php echo $error_message; ?>
                        </div>
                    <?php elseif (empty($products)): ?>
                        <div class="alert alert-info">
                            <h3>No products found</h3>
                            <p>No products found in this category.</p>
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
                    <?php endif; ?>
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