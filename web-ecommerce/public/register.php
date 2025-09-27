<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';
require_once '../includes/cart_functions.php';

if (is_logged_in()) {
    redirect('index.php', 'You are already logged in!', 'info');
}

$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first_name = sanitize($_POST['first_name']);
    $last_name = sanitize($_POST['last_name']);
    $email = sanitize($_POST['email']);
    $password = $_POST['password'];
    $confirm = $_POST['confirm'];

    if (!$first_name || !$last_name || !$email || !$password || !$confirm) {
        $errors[] = 'Please fill in all fields.';
    }
    if (!is_valid_email($email)) {
        $errors[] = 'Invalid email address.';
    }
    if ($password !== $confirm) {
        $errors[] = 'Passwords do not match.';
    }

    if (empty($errors)) {
        // Register user via API
        $apiClient = getAPIClient();
        $userData = [
            'username' => $email, // Use email as username for simplicity
            'email' => $email,
            'password' => $password,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'role' => 'customer'
        ];
        
        $response = $apiClient->register($userData);
        
        if ($response['success'] && $response['data']['status'] === 'success') {
            redirect('login.php', 'Registration successful! Please sign in.', 'success');
        } else {
            $errors[] = $response['data']['message'] ?? 'Registration failed. Please try again.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - <?php echo SITE_NAME; ?></title>
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
                <span class="logo">👤</span>
                <h2 class="mb-0">Create Account</h2>
                <p class="lead">Join <?php echo SITE_NAME; ?> and start shopping today.</p>
            </div>
            <?php if (!empty($errors)): ?>
                <div class="alert alert-danger">
                    <?php foreach ($errors as $e) echo "<p class='mb-0'>$e</p>"; ?>
                </div>
            <?php endif; ?>
            <form method="POST" autocomplete="off" novalidate>
                <div class="form-group">
                    <label class="form-label" for="first_name">First Name</label>
                    <input type="text" name="first_name" id="first_name" class="form-control" placeholder="Enter your first name" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="last_name">Last Name</label>
                    <input type="text" name="last_name" id="last_name" class="form-control" placeholder="Enter your last name" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="email">Email address</label>
                    <input type="email" name="email" id="email" class="form-control" placeholder="Enter your email" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="password">Password</label>
                    <input type="password" name="password" id="password" class="form-control" placeholder="Create a password" required>
                </div>
                <div class="form-group">
                    <label class="form-label" for="confirm">Confirm Password</label>
                    <input type="password" name="confirm" id="confirm" class="form-control" placeholder="Repeat your password" required>
                </div>
                <button class="btn btn-primary" type="submit">Register</button>
            </form>
            <div class="login-link">
                <span>Already have an account? <a href="login.php">Sign in here</a></span>
            </div>
        </div>
    </div>
</body>
</html>