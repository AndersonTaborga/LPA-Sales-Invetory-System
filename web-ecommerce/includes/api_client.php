<?php
// API Client para integração com backend Node.js

class APIClient {
    private $baseUrl;
    private $token;
    
    public function __construct() {
        $this->baseUrl = 'http://localhost:5000';
        $this->token = null;
    }
    
    // Set authentication token
    public function setToken($token) {
        $this->token = $token;
    }
    
    // Get headers for API requests
    private function getHeaders() {
        $headers = [
            'Content-Type: application/json',
            'Accept: application/json'
        ];
        
        if ($this->token) {
            $headers[] = 'Authorization: Bearer ' . $this->token;
        }
        
        return $headers;
    }
    
    // Make HTTP request
    private function makeRequest($method, $endpoint, $data = null) {
        $url = $this->baseUrl . $endpoint;
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $this->getHeaders());
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        
        switch (strtoupper($method)) {
            case 'POST':
                curl_setopt($ch, CURLOPT_POST, true);
                if ($data) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                }
                break;
            case 'PUT':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
                if ($data) {
                    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
                }
                break;
            case 'DELETE':
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
                break;
        }
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error) {
            return [
                'success' => false,
                'error' => 'CURL Error: ' . $error
            ];
        }
        
        $decodedResponse = json_decode($response, true);
        
        return [
            'success' => $httpCode >= 200 && $httpCode < 300,
            'data' => $decodedResponse,
            'http_code' => $httpCode
        ];
    }
    
    // Authentication methods
    public function login($email, $password) {
        return $this->makeRequest('POST', '/api/users/login', [
            'email' => $email,
            'password' => $password
        ]);
    }
    
    public function register($userData) {
        return $this->makeRequest('POST', '/api/users/register', $userData);
    }
    
    // Product methods
    public function getProducts($params = []) {
        $queryString = http_build_query($params);
        $endpoint = '/api/products' . ($queryString ? '?' . $queryString : '');
        return $this->makeRequest('GET', $endpoint);
    }
    
    public function getProduct($id) {
        return $this->makeRequest('GET', '/api/products/' . $id);
    }
    
    public function createProduct($productData) {
        return $this->makeRequest('POST', '/api/products', $productData);
    }
    
    public function updateProduct($id, $productData) {
        return $this->makeRequest('PUT', '/api/products/' . $id, $productData);
    }
    
    public function deleteProduct($id) {
        return $this->makeRequest('DELETE', '/api/products/' . $id);
    }
    
    public function updateStock($id, $stock) {
        return $this->makeRequest('PATCH', '/api/products/' . $id . '/stock', [
            'stock' => $stock
        ]);
    }
    
    public function getLowStockProducts($threshold = 10) {
        return $this->makeRequest('GET', '/api/products/low-stock?threshold=' . $threshold);
    }
    
    // Category methods
    public function getCategories($includeProducts = false) {
        $endpoint = '/api/categories';
        if ($includeProducts) {
            $endpoint .= '?include_products=true';
        }
        return $this->makeRequest('GET', $endpoint);
    }
    
    public function getCategory($id) {
        return $this->makeRequest('GET', '/api/categories/' . $id);
    }
    
    public function createCategory($categoryData) {
        return $this->makeRequest('POST', '/api/categories', $categoryData);
    }
    
    public function updateCategory($id, $categoryData) {
        return $this->makeRequest('PUT', '/api/categories/' . $id, $categoryData);
    }
    
    public function deleteCategory($id) {
        return $this->makeRequest('DELETE', '/api/categories/' . $id);
    }
    
    // Sales methods
    public function getSales($params = []) {
        $queryString = http_build_query($params);
        $endpoint = '/api/sales' . ($queryString ? '?' . $queryString : '');
        return $this->makeRequest('GET', $endpoint);
    }
    
    public function getSale($id) {
        return $this->makeRequest('GET', '/api/sales/' . $id);
    }
    
    public function createSale($saleData) {
        return $this->makeRequest('POST', '/api/sales', $saleData);
    }
    
    public function updateSale($id, $saleData) {
        return $this->makeRequest('PUT', '/api/sales/' . $id, $saleData);
    }
    
    public function deleteSale($id) {
        return $this->makeRequest('DELETE', '/api/sales/' . $id);
    }
    
    // Order methods
    public function getOrders($params = []) {
        $queryString = http_build_query($params);
        $endpoint = '/api/orders' . ($queryString ? '?' . $queryString : '');
        return $this->makeRequest('GET', $endpoint);
    }
    
    public function getOrder($id) {
        return $this->makeRequest('GET', '/api/orders/' . $id);
    }
    
    public function createOrder($orderData) {
        return $this->makeRequest('POST', '/api/orders', $orderData);
    }
    
    public function updateOrderStatus($id, $status) {
        return $this->makeRequest('PATCH', '/api/orders/' . $id . '/status', [
            'status' => $status
        ]);
    }
    
    public function deleteOrder($id) {
        return $this->makeRequest('DELETE', '/api/orders/' . $id);
    }
    
    // Report methods
    public function getDashboardSummary() {
        return $this->makeRequest('GET', '/api/reports/dashboard');
    }
    
    public function getSalesReport($params = []) {
        $queryString = http_build_query($params);
        $endpoint = '/api/reports/sales' . ($queryString ? '?' . $queryString : '');
        return $this->makeRequest('GET', $endpoint);
    }
    
    public function getTopProductsReport($params = []) {
        $queryString = http_build_query($params);
        $endpoint = '/api/reports/top-products' . ($queryString ? '?' . $queryString : '');
        return $this->makeRequest('GET', $endpoint);
    }
    
    public function getCustomersReport($params = []) {
        $queryString = http_build_query($params);
        $endpoint = '/api/reports/customers' . ($queryString ? '?' . $queryString : '');
        return $this->makeRequest('GET', $endpoint);
    }
    
    public function getStockReport($params = []) {
        $queryString = http_build_query($params);
        $endpoint = '/api/reports/stock' . ($queryString ? '?' . $queryString : '');
        return $this->makeRequest('GET', $endpoint);
    }
}

// Global API client instance
$apiClient = new APIClient();

// Helper functions
function getAPIClient() {
    global $apiClient;
    return $apiClient;
}

function setAPIToken($token) {
    global $apiClient;
    $apiClient->setToken($token);
}

function getAPIToken() {
    return $_SESSION['api_token'] ?? null;
}

function isAPIAuthenticated() {
    return !empty($_SESSION['api_token']);
}

function logoutAPI() {
    unset($_SESSION['api_token']);
    unset($_SESSION['api_user']);
}

function getAPIUser() {
    return $_SESSION['api_user'] ?? null;
}

function setAPIUser($user) {
    $_SESSION['api_user'] = $user;
}

// Initialize API token from session
if (isset($_SESSION['api_token'])) {
    $apiClient->setToken($_SESSION['api_token']);
}
?>
