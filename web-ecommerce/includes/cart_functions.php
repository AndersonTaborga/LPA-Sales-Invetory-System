<?php
/**
 * Cart Functions - Sistema de Carrinho Melhorado
 * ==============================================
 */

/**
 * Inicializar carrinho na sessão
 */
function initialize_cart() {
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
        $_SESSION['cart_initialized'] = time();
        error_log("Cart initialized at " . date('Y-m-d H:i:s'));
    }
}

/**
 * Adicionar produto ao carrinho
 */
function add_to_cart($product_id, $quantity = 1) {
    initialize_cart();
    
    // Validar entrada
    $product_id = (int)$product_id;
    $quantity = (int)$quantity;
    
    if ($product_id <= 0 || $quantity <= 0) {
        error_log("Invalid cart parameters: product_id=$product_id, quantity=$quantity");
        return false;
    }
    
    // Verificar se o produto existe e tem estoque via API
    $apiClient = getAPIClient();
    $response = $apiClient->getProduct($product_id);
    
    if (!$response['success'] || $response['data']['status'] !== 'success') {
        error_log("Product not found via API: product_id=$product_id");
        return false;
    }
    
    $product = $response['data']['data'];
    $current_quantity = $_SESSION['cart'][$product_id] ?? 0;
    $requested_quantity = $current_quantity + $quantity;
    
    // Verificar estoque
    if ($requested_quantity > $product['stock']) {
        error_log("Insufficient stock: requested=$requested_quantity, available={$product['stock']}");
        return false;
    }
    
    // Adicionar ao carrinho
    $_SESSION['cart'][$product_id] = $requested_quantity;
    
    // Log da operação
    error_log("Added to cart: product_id=$product_id, quantity=$requested_quantity");
    
    return true;
}

/**
 * Atualizar quantidade no carrinho
 */
function update_cart_quantity($product_id, $quantity) {
    initialize_cart();
    
    $product_id = (int)$product_id;
    $quantity = (int)$quantity;
    
    if ($product_id <= 0) {
        return false;
    }
    
    if ($quantity <= 0) {
        // Remover do carrinho se quantidade for 0
        unset($_SESSION['cart'][$product_id]);
        error_log("Removed from cart: product_id=$product_id");
        return true;
    }
    
    // Verificar estoque
    $apiClient = getAPIClient();
    $response = $apiClient->getProduct($product_id);
    
    if (!$response['success'] || $response['data']['status'] !== 'success') {
        return false;
    }
    
    $product = $response['data']['data'];
    
    if ($quantity > $product['stock']) {
        error_log("Insufficient stock for update: requested=$quantity, available={$product['stock']}");
        return false;
    }
    
    $_SESSION['cart'][$product_id] = $quantity;
    error_log("Updated cart: product_id=$product_id, quantity=$quantity");
    
    return true;
}

/**
 * Remover produto do carrinho
 */
function remove_from_cart($product_id) {
    initialize_cart();
    
    $product_id = (int)$product_id;
    
    if (isset($_SESSION['cart'][$product_id])) {
        unset($_SESSION['cart'][$product_id]);
        error_log("Removed from cart: product_id=$product_id");
        return true;
    }
    
    return false;
}

/**
 * Obter itens do carrinho com informações completas dos produtos
 */
function get_cart_items() {
    initialize_cart();
    
    $cart_items = [];
    $total = 0;
    
    if (empty($_SESSION['cart'])) {
        return ['items' => $cart_items, 'total' => $total, 'count' => 0];
    }
    
    $apiClient = getAPIClient();
    
    foreach ($_SESSION['cart'] as $product_id => $quantity) {
        $response = $apiClient->getProduct($product_id);
        
        if ($response['success'] && $response['data']['status'] === 'success') {
            $product = $response['data']['data'];
            $subtotal = $product['price'] * $quantity;
            $total += $subtotal;
            
            $cart_items[] = [
                'product' => $product,
                'quantity' => $quantity,
                'subtotal' => $subtotal
            ];
        } else {
            // Produto não encontrado - remover do carrinho
            error_log("Product not found, removing from cart: product_id=$product_id");
            unset($_SESSION['cart'][$product_id]);
        }
    }
    
    return [
        'items' => $cart_items,
        'total' => $total,
        'count' => array_sum($_SESSION['cart'])
    ];
}

/**
 * Limpar carrinho
 */
function clear_cart() {
    $_SESSION['cart'] = [];
    error_log("Cart cleared");
}

/**
 * Obter contagem total de itens no carrinho
 */
function get_cart_count() {
    initialize_cart();
    return array_sum($_SESSION['cart']);
}

/**
 * Verificar se o carrinho está vazio
 */
function is_cart_empty() {
    initialize_cart();
    return empty($_SESSION['cart']);
}

/**
 * Debug do carrinho - para desenvolvimento
 */
function debug_cart() {
    if (!defined('DEBUG') || !DEBUG) {
        return;
    }
    
    echo "<div style='background: #f0f0f0; padding: 10px; margin: 10px; border: 1px solid #ccc;'>";
    echo "<h4>Cart Debug Info:</h4>";
    echo "<pre>";
    echo "Session ID: " . session_id() . "\n";
    echo "Cart Data: " . print_r($_SESSION['cart'] ?? 'Not set', true) . "\n";
    echo "Cart Count: " . get_cart_count() . "\n";
    echo "Cart Items: " . print_r(get_cart_items(), true) . "\n";
    echo "</pre>";
    echo "</div>";
}

/**
 * Validar carrinho antes do checkout
 */
function validate_cart_for_checkout() {
    $cart_data = get_cart_items();
    $errors = [];
    
    if (empty($cart_data['items'])) {
        $errors[] = 'Carrinho está vazio';
        return $errors;
    }
    
    $apiClient = getAPIClient();
    
    foreach ($cart_data['items'] as $item) {
        $product = $item['product'];
        $quantity = $item['quantity'];
        
        // Verificar se o produto ainda existe e tem estoque
        $response = $apiClient->getProduct($product['id']);
        
        if (!$response['success'] || $response['data']['status'] !== 'success') {
            $errors[] = "Produto '{$product['name']}' não está mais disponível";
            continue;
        }
        
        $current_product = $response['data']['data'];
        
        if ($current_product['stock'] < $quantity) {
            $errors[] = "Estoque insuficiente para '{$product['name']}' (disponível: {$current_product['stock']}, solicitado: $quantity)";
        }
        
        if ($current_product['price'] != $product['price']) {
            $errors[] = "Preço do produto '{$product['name']}' foi alterado";
        }
    }
    
    return $errors;
}

/**
 * Sincronizar carrinho com API (opcional - para futuras implementações)
 */
function sync_cart_with_api() {
    // Esta função pode ser implementada para salvar o carrinho no backend
    // Por enquanto, mantemos apenas na sessão local
    return true;
}
?>
