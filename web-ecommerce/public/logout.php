<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Clear session and cart
logoutAPI();
clear_cart();

set_flash_message('success', 'Logout successful!');
header('Location: index.php');
exit;
?>