class AppConstants {
  // App Information
  static const String appName = 'Sales Manager';
  static const String appVersion = '1.0.0';
  
  // TODO: Configurar ambientes (dev, staging, prod)
  static const String environment = 'development'; // development | staging | production
  
  // API Configuration - Backend LPA
  static const String baseUrl = environment == 'production' 
      ? 'https://api.lpa.com'
      : 'http://localhost:5000';
      
  static const String authEndpoint = '/api/users';
  static const String usersEndpoint = '/api/users';
  static const String productsEndpoint = '/api/products';
  static const String salesEndpoint = '/api/sales';
  static const String ordersEndpoint = '/api/orders';
  static const String categoriesEndpoint = '/api/categories';
  static const String reportsEndpoint = '/api/reports';
  
  // TODO: Para produção, implementar:
  // - Rate limiting
  // - Request timeouts
  // - Retry policies
  // - Circuit breakers
  static const Duration apiTimeout = Duration(seconds: 30);
  static const int maxRetries = 3;
  
  // API Configuration
  static const String fullApiUrl = baseUrl;
  
  // API Endpoints
  static const String loginEndpoint = '/api/users/login';
  static const String registerEndpoint = '/api/users/register';
  static const String userProfileEndpoint = '/api/users/profile';
  
  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userKey = 'user_data';
  static const String lastSyncKey = 'last_sync';
  static const String offlineDataKey = 'offline_data';
  
  // Pagination
  static const int defaultPageSize = 20;
  static const int maxPageSize = 100;
  
  // Permissions
  static const String viewProductsPermission = 'view_products';
  static const String viewSalesPermission = 'view_sales';
  static const String createSalesPermission = 'create_sales';
  static const String viewCustomersPermission = 'view_customers';
  static const String viewStockPermission = 'view_stock';
  
  // Stock Levels
  static const int lowStockThreshold = 10;
  static const int criticalStockThreshold = 5;
  
  // Timeouts
  static const int connectionTimeout = 30000; // 30 seconds
  static const int receiveTimeout = 30000; // 30 seconds
  
  // Error Messages
  static const String networkError = 'Connection error. Check your internet.';
  static const String serverError = 'Server error. Please try again later.';
  static const String unauthorizedError = 'Session expired. Please login again.';
  static const String validationError = 'Invalid data. Check the fields.';
  static const String notFoundError = 'Resource not found.';
  static const String unknownError = 'Unknown error. Please try again.';
  
  // Success Messages
  static const String loginSuccess = 'Login successful!';
  static const String saleCreatedSuccess = 'Sale created successfully!';
  static const String dataUpdatedSuccess = 'Data updated successfully!';
  static const String logoutSuccess = 'Logout successful!';
  
  // Validation Messages
  static const String requiredFieldError = 'This field is required';
  static const String invalidEmailError = 'Invalid email';
  static const String invalidPasswordError = 'Password must be at least 6 characters';
  static const String invalidQuantityError = 'Quantity must be greater than zero';
  static const String invalidPriceError = 'Invalid price';
  static const String invalidPhoneError = 'Invalid phone number';
  static const String invalidCpfError = 'Invalid CPF';
  
  // Date Formats
  static const String dateFormat = 'MM/dd/yyyy';
  static const String dateTimeFormat = 'MM/dd/yyyy HH:mm';
  static const String timeFormat = 'HH:mm';
  
  // Currency
  static const String currencySymbol = '\$';
  static const String currencyLocale = 'en_US';
} 