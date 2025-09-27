<?php
/**
 * Session Configuration
 * ====================
 * Configurações melhoradas para sessões PHP
 */

// Configurações de sessão mais robustas
ini_set('session.cookie_lifetime', 0); // Sessão expira quando o navegador fecha
ini_set('session.cookie_secure', isset($_SERVER['HTTPS'])); // Apenas HTTPS em produção
ini_set('session.cookie_httponly', 1); // Previne acesso via JavaScript
ini_set('session.use_only_cookies', 1); // Usar apenas cookies para sessão
ini_set('session.cookie_samesite', 'Strict'); // Proteção CSRF

// Configurar garbage collection
ini_set('session.gc_maxlifetime', 3600); // 1 hora
ini_set('session.gc_probability', 1);
ini_set('session.gc_divisor', 100);

// Iniciar sessão se não estiver ativa
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Verificar se a sessão é válida
if (!isset($_SESSION['session_started'])) {
    $_SESSION['session_started'] = time();
    $_SESSION['session_id'] = session_id();
    
    // Log da nova sessão
    error_log("New session started: " . session_id() . " at " . date('Y-m-d H:i:s'));
}

// Verificar se a sessão não expirou
$session_timeout = 3600; // 1 hora
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $session_timeout)) {
    // Sessão expirada
    session_unset();
    session_destroy();
    session_start();
    $_SESSION['session_started'] = time();
    $_SESSION['session_id'] = session_id();
    $_SESSION['session_expired'] = true;
    
    error_log("Session expired and restarted: " . session_id());
}

// Atualizar última atividade
$_SESSION['last_activity'] = time();

// Função para verificar se a sessão está ativa
function is_session_active() {
    return session_status() === PHP_SESSION_ACTIVE;
}

// Função para obter informações da sessão
function get_session_info() {
    return [
        'id' => session_id(),
        'started' => $_SESSION['session_started'] ?? 'unknown',
        'last_activity' => $_SESSION['last_activity'] ?? 'unknown',
        'cart_count' => get_cart_count(),
        'is_logged_in' => is_logged_in()
    ];
}

// Função para limpar sessão
function clear_session() {
    session_unset();
    session_destroy();
    session_start();
    $_SESSION['session_started'] = time();
    $_SESSION['session_id'] = session_id();
}

// Debug da sessão (apenas em desenvolvimento)
function debug_session() {
    if (!defined('DEBUG') || !DEBUG) {
        return;
    }
    
    echo "<div style='background: #e8f4f8; padding: 10px; margin: 10px; border: 1px solid #bee5eb;'>";
    echo "<h4>Session Debug Info:</h4>";
    echo "<pre>";
    echo "Session Status: " . (is_session_active() ? 'ACTIVE' : 'INACTIVE') . "\n";
    echo "Session ID: " . session_id() . "\n";
    echo "Session Info: " . print_r(get_session_info(), true) . "\n";
    echo "Session Data: " . print_r($_SESSION, true) . "\n";
    echo "</pre>";
    echo "</div>";
}
?>
