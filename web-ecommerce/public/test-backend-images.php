<?php
echo "<h1>Backend Image Server Test</h1>";

$backendUrl = "http://localhost:5000";
$testImage = "/api/assets/Logitech MX Master 3.jpeg";
$fullUrl = $backendUrl . $testImage;

echo "<h2>Testing Backend Connection:</h2>";
echo "<p><strong>Backend URL:</strong> $backendUrl</p>";
echo "<p><strong>Test Image:</strong> $testImage</p>";
echo "<p><strong>Full URL:</strong> <a href='$fullUrl' target='_blank'>$fullUrl</a></p>";

echo "<h2>Image Test:</h2>";
echo "<img src='$fullUrl' alt='Test Image' style='max-width: 300px; height: auto; border: 2px solid #333;'>";

echo "<h2>API Test:</h2>";
$apiUrl = $backendUrl . "/api/products?limit=3";
echo "<p><strong>API URL:</strong> <a href='$apiUrl' target='_blank'>$apiUrl</a></p>";

// Test API with cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

echo "<p><strong>API Response Code:</strong> $httpCode</p>";
if ($error) {
    echo "<p style='color: red;'><strong>cURL Error:</strong> $error</p>";
} else {
    echo "<p style='color: green;'><strong>API Connection:</strong> Success</p>";
    $data = json_decode($response, true);
    if ($data && isset($data['data'])) {
        echo "<p><strong>Products found:</strong> " . count($data['data']) . "</p>";
        if (!empty($data['data'])) {
            $product = $data['data'][0];
            echo "<p><strong>First Product:</strong> " . htmlspecialchars($product['name']) . "</p>";
            echo "<p><strong>Image URL:</strong> " . htmlspecialchars($product['image_url']) . "</p>";
        }
    }
}

echo "<hr>";
echo "<p><a href='index.php'>Back to Homepage</a> | <a href='test.php'>API Test</a></p>";
?>
