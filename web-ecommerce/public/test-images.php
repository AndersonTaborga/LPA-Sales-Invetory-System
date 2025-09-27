<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

echo "<h1>Image Test</h1>";

// Test API connection
$apiClient = getAPIClient();
$response = $apiClient->getProducts(['limit' => 3]);

if ($response['success'] && $response['data']['status'] === 'success') {
    $products = $response['data']['data'];
    
    echo "<h2>Products with Images:</h2>";
    echo "<div style='display: flex; gap: 2rem; flex-wrap: wrap;'>";
    
    foreach ($products as $product) {
        echo "<div style='border: 1px solid #ccc; padding: 1rem; border-radius: 8px; max-width: 300px;'>";
        echo "<h3>" . htmlspecialchars($product['name']) . "</h3>";
        echo "<p>" . htmlspecialchars($product['description']) . "</p>";
        echo "<p><strong>Price:</strong> " . format_price($product['price']) . "</p>";
        echo "<p><strong>Image URL:</strong> " . htmlspecialchars($product['image_url']) . "</p>";
        
        if ($product['image_url']) {
            $imageUrl = API_BASE_URL . $product['image_url'];
            echo "<img src='" . htmlspecialchars($imageUrl) . "' alt='" . htmlspecialchars($product['name']) . "' style='max-width: 200px; height: auto; margin-top: 1rem;'>";
        } else {
            echo "<p style='color: red;'>No image URL</p>";
        }
        
        echo "</div>";
    }
    
    echo "</div>";
} else {
    echo "<p style='color: red;'>Failed to load products: " . ($response['error'] ?? 'Unknown error') . "</p>";
}

echo "<hr>";
echo "<h2>Direct Image Tests:</h2>";

// Test direct image access
$testImages = [
    '/api/assets/Logitech MX Master 3.jpeg',
    '/api/assets/Logitech MX Keys.jpeg',
    '/api/assets/Logitech C920 HD Pro.jpeg'
];

foreach ($testImages as $imagePath) {
    $imageUrl = API_BASE_URL . $imagePath;
    echo "<div style='margin-bottom: 2rem;'>";
    echo "<h3>" . basename($imagePath) . "</h3>";
    echo "<p>URL: <a href='" . $imageUrl . "' target='_blank'>" . $imageUrl . "</a></p>";
    echo "<img src='" . $imageUrl . "' alt='Test Image' style='max-width: 200px; height: auto; border: 1px solid #ccc;'>";
    echo "</div>";
}

echo "<hr>";
echo "<p><a href='index.php'>Back to Homepage</a></p>";
?>
