<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

echo "<h1>Backend Connection Test</h1>";

// Test API connection
echo "<h2>1. Testing Backend Connection</h2>";
$apiClient = getAPIClient();

echo "<p><strong>Backend URL:</strong> " . API_BASE_URL . "</p>";

// Test products endpoint
echo "<h3>Products Test:</h3>";
$response = $apiClient->getProducts(['limit' => 3]);

echo "<div style='background: #f8f9fa; padding: 1rem; border-radius: 5px; margin: 1rem 0;'>";
echo "<strong>Response Status:</strong> " . ($response['success'] ? 'SUCCESS' : 'FAILED') . "<br>";
echo "<strong>HTTP Code:</strong> " . ($response['http_code'] ?? 'N/A') . "<br>";

if ($response['success']) {
    echo "<strong>Status:</strong> " . ($response['data']['status'] ?? 'N/A') . "<br>";
    
    if (isset($response['data']['data'])) {
        $products = $response['data']['data'];
        echo "<strong>Products found:</strong> " . count($products) . "<br>";
        
        if (!empty($products)) {
            echo "<h4>First Product:</h4>";
            $product = $products[0];
            echo "<ul>";
            echo "<li><strong>ID:</strong> " . $product['id'] . "</li>";
            echo "<li><strong>Name:</strong> " . $product['name'] . "</li>";
            echo "<li><strong>Price:</strong> " . format_price($product['price']) . "</li>";
            echo "<li><strong>Stock:</strong> " . $product['stock'] . "</li>";
            echo "</ul>";
        }
    }
} else {
    echo "<strong>Error:</strong> " . ($response['error'] ?? 'Unknown error') . "<br>";
}
echo "</div>";

// Test categories endpoint
echo "<h3>Categories Test:</h3>";
$categoriesResponse = $apiClient->getCategories();

echo "<div style='background: #f8f9fa; padding: 1rem; border-radius: 5px; margin: 1rem 0;'>";
echo "<strong>Status:</strong> " . ($categoriesResponse['success'] ? 'SUCCESS' : 'FAILED') . "<br>";

if ($categoriesResponse['success'] && isset($categoriesResponse['data']['data'])) {
    $categories = $categoriesResponse['data']['data'];
    echo "<strong>Categories found:</strong> " . count($categories) . "<br>";
    
    if (!empty($categories)) {
        echo "<ul>";
        foreach ($categories as $category) {
            echo "<li>" . $category['name'] . "</li>";
        }
        echo "</ul>";
    }
} else {
    echo "<strong>Error:</strong> " . ($categoriesResponse['error'] ?? 'No categories found') . "<br>";
}
echo "</div>";

// Test cart system
echo "<h2>2. Testing Cart System</h2>";
initialize_cart();
$cartCount = get_cart_count();
echo "<p><strong>Cart count:</strong> $cartCount</p>";

if ($response['success'] && !empty($products)) {
    $testProduct = $products[0];
    
    echo "<h3>Add to Cart Test:</h3>";
    if (add_to_cart($testProduct['id'], 1)) {
        echo "<p style='color: green;'>✅ Product added to cart successfully!</p>";
        
        $newCount = get_cart_count();
        echo "<p><strong>New count:</strong> $newCount</p>";
        
        $cartData = get_cart_items();
        echo "<p><strong>Items in cart:</strong> " . count($cartData['items']) . "</p>";
        echo "<p><strong>Total:</strong> " . format_price($cartData['total']) . "</p>";
    } else {
        echo "<p style='color: red;'>❌ Failed to add product to cart</p>";
    }
}

// System information
echo "<h2>3. System Information</h2>";
echo "<div style='background: #e9ecef; padding: 1rem; border-radius: 5px;'>";
echo "<p><strong>PHP Version:</strong> " . PHP_VERSION . "</p>";
echo "<p><strong>cURL Available:</strong> " . (extension_loaded('curl') ? 'YES' : 'NO') . "</p>";
echo "<p><strong>JSON Available:</strong> " . (extension_loaded('json') ? 'YES' : 'NO') . "</p>";
echo "<p><strong>Session ID:</strong> " . session_id() . "</p>";
echo "<p><strong>Timestamp:</strong> " . date('Y-m-d H:i:s') . "</p>";
echo "</div>";

echo "<hr>";
echo "<p><a href='index.php'>Back to homepage</a> | <a href='products.php'>View products</a> | <a href='cart.php'>View cart</a></p>";
?>
