<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Process cart actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? 'add';
    $productId = (int)($_POST['product_id'] ?? 0);
    
    error_log("Cart action: $action, product_id: $productId");
    
    switch ($action) {
        case 'add':
            if ($productId > 0) {
                if (add_to_cart($productId, 1)) {
                    set_flash_message('success', 'Product added to cart successfully!');
                } else {
                    set_flash_message('error', 'Failed to add product to cart. Please check stock availability.');
                }
            } else {
                set_flash_message('error', 'Invalid product ID.');
            }
            break;
            
        case 'update':
            $quantity = (int)($_POST['quantity'] ?? 0);
            if (update_cart_quantity($productId, $quantity)) {
                if ($quantity > 0) {
                    set_flash_message('success', 'Cart updated successfully!');
                } else {
                    set_flash_message('success', 'Product removed from cart!');
                }
            } else {
                set_flash_message('error', 'Failed to update cart. Please check stock availability.');
            }
            break;
            
        case 'remove':
            if (remove_from_cart($productId)) {
                set_flash_message('success', 'Product removed from cart!');
            } else {
                set_flash_message('error', 'Failed to remove product from cart.');
            }
            break;
            
        case 'clear':
            clear_cart();
            set_flash_message('success', 'Cart cleared successfully!');
            break;
    }
    
    // Redirect back to cart
    header('Location: cart.php');
    exit;
}

// Get cart data
$cartData = get_cart_items();
$cartItems = $cartData['items'];
$total = $cartData['total'];
$cartCount = $cartData['count'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shopping Cart - <?php echo SITE_NAME; ?></title>
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
                                <?php if ($cartCount > 0): ?>
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
            <h1>Shopping Cart 
                <?php if ($cartCount > 0): ?>
                    <span class="badge" style="position: static; margin-left: 1rem;"><?php echo $cartCount; ?> items</span>
                <?php endif; ?>
            </h1>
            
            <!-- Flash Messages -->
            <?php if ($message = get_flash_message()): ?>
                <div class="alert alert-<?php echo $message['type']; ?>">
                    <?php echo $message['message']; ?>
                </div>
            <?php endif; ?>

            <?php if (empty($cartItems)): ?>
                <div class="alert alert-info">
                    <h3>Your cart is empty</h3>
                    <p>Start shopping to add items to your cart!</p>
                    <a href="products.php" class="btn btn-primary">
                        Continue Shopping
                    </a>
                </div>
            <?php else: ?>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($cartItems as $item): ?>
                            <tr>
                                <td>
                                    <div class="cart-item">
                                        <img src="<?php echo $item['product']['image_url'] ?: 'assets/images/default-product.jpg'; ?>" 
                                             alt="<?php echo htmlspecialchars($item['product']['name']); ?>">
                                        <div class="cart-item-info">
                                            <h4><?php echo htmlspecialchars($item['product']['name']); ?></h4>
                                            <p><?php echo htmlspecialchars($item['product']['description']); ?></p>
                                            <small>
                                                Stock: <?php echo $item['product']['stock']; ?> units
                                                <?php if ($item['product']['stock'] <= 10): ?>
                                                    <span style="color: #f39c12;">(Low Stock)</span>
                                                <?php endif; ?>
                                            </small>
                                        </div>
                                    </div>
                                </td>
                                <td class="cart-item-price"><?php echo format_price($item['product']['price']); ?></td>
                                <td>
                                    <form action="cart.php" method="POST">
                                        <input type="hidden" name="action" value="update">
                                        <input type="hidden" name="product_id" value="<?php echo $item['product']['id']; ?>">
                                        <div class="quantity-control">
                                            <input type="number" name="quantity" value="<?php echo $item['quantity']; ?>" 
                                                   min="1" max="<?php echo $item['product']['stock']; ?>" 
                                                   class="form-control quantity-input"
                                                   onchange="this.form.submit()">
                                        </div>
                                    </form>
                                </td>
                                <td class="cart-item-price"><?php echo format_price($item['subtotal']); ?></td>
                                <td>
                                    <form action="cart.php" method="POST" style="display: inline;">
                                        <input type="hidden" name="action" value="remove">
                                        <input type="hidden" name="product_id" value="<?php echo $item['product']['id']; ?>">
                                        <button type="submit" class="btn btn-danger" 
                                                onclick="return confirm('Remove this product?')">
                                            Remove
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="text-align: right; font-weight: bold;">Total:</td>
                            <td style="font-weight: bold; font-size: 1.2rem; color: #27ae60;">
                                <?php echo format_price($total); ?>
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2rem;">
                    <div>
                        <a href="products.php" class="btn btn-secondary">Continue Shopping</a>
                        <form action="cart.php" method="POST" style="display: inline-block; margin-left: 1rem;">
                            <input type="hidden" name="action" value="clear">
                            <button type="submit" class="btn btn-danger" 
                                    onclick="return confirm('Clear entire cart?')">
                                Clear Cart
                            </button>
                        </form>
                    </div>
                    <div>
                        <a href="checkout.php" class="btn btn-success" style="font-size: 1.1rem; padding: 1rem 2rem;">
                            Checkout - <?php echo format_price($total); ?>
                        </a>
                    </div>
                </div>
            <?php endif; ?>
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