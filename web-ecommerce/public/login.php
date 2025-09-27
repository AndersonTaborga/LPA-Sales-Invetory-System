<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

// Process login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = sanitize($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        set_flash_message('error', 'Email and password are required.');
    } else {
        $apiClient = getAPIClient();
        $response = $apiClient->login($email, $password);
        
        if ($response['success'] && $response['data']['success']) {
            $_SESSION['api_token'] = $response['data']['token'];
            $_SESSION['api_user'] = $response['data']['user'];
            set_flash_message('success', 'Login successful!');
            header('Location: index.php');
            exit;
        } else {
            $error = $response['data']['error'] ?? $response['error'] ?? 'Login failed';
            set_flash_message('error', $error);
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        body {
            background: linear-gradient(135deg, #f8fafc 0%, #e3e6ed 100%);
            min-height: 100vh;
        }
        .auth-card {
            max-width: 440px;
            margin: 4rem auto;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            border-radius: 16px;
            background: #fff;
            padding: 2.5rem 2rem 2rem 2rem;
        }
        .auth-card .form-control {
            background: #f8f9fa;
        }
        .auth-card .btn-primary {
            width: 100%;
            font-size: 1.1rem;
        }
        .auth-card .logo {
            font-size: 2.2rem;
            color: #3498db;
            margin-bottom: 1rem;
        }
        .auth-card .lead {
            color: #6c757d;
            font-size: 1.1rem;
        }
        .auth-card .form-label {
            font-weight: 500;
        }
        .auth-card .login-link {
            text-align: center;
            margin-top: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="auth-card">
            <div class="text-center mb-4">
                <span class="logo">🔐</span>
                <h2 class="mb-0">Login</h2>
                <p class="lead">Welcome back to <?php echo SITE_NAME; ?></p>
            </div>
            <?php if ($message = get_flash_message()): ?>
                <div class="alert alert-<?php echo $message['type']; ?>">
                    <?php echo $message['message']; ?>
                </div>
            <?php endif; ?>
            <form method="POST" autocomplete="off" novalidate>
                <div class="form-group">
                    <label class="form-label" for="email">Email address</label>
                    <input type="email" name="email" id="email" class="form-control" placeholder="Enter your email" required
                           value="<?php echo htmlspecialchars($_POST['email'] ?? ''); ?>">
                </div>
                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" name="password" id="password" class="form-control" placeholder="Enter your password" required>
                </div>
                <button class="btn btn-primary" type="submit">Login</button>
            </form>
            <div class="login-link">
                <span>Don't have an account? <a href="register.php">Register here</a></span>
            </div>

            <!-- Test Credentials -->
            <div class="alert alert-info" style="margin-top: 2rem;">
                <h4>Test Credentials:</h4>
                <p><strong>Admin:</strong> admin@lpa.com / 123456</p>
                <p><strong>Customer:</strong> cliente1@lpa.com / 123456</p>
            </div>
        </div>
    </div>
</body>
</html>