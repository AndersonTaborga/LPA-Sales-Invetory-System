import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';
import '../models/user.dart';

class AuthService {
  static final AuthService _instance = AuthService._internal();
  factory AuthService() => _instance;
  AuthService._internal();

  final _storage = const FlutterSecureStorage();
  
  User? _currentUser;
  String? _currentToken;
  String? _refreshToken;

  // Getters
  User? get currentUser => _currentUser;
  String? get currentToken => _currentToken;
  bool get isLoggedIn => _currentUser != null && _currentToken != null;
  bool get hasValidToken => _currentToken != null && !isTokenExpired(_currentToken!);

  // Initialize auth service
  Future<void> initialize() async {
    await _loadStoredAuth();
  }

  // Load stored authentication data
  Future<void> _loadStoredAuth() async {
    try {
      final token = await _storage.read(key: AppConstants.tokenKey);
      final refreshTokenValue = await _storage.read(key: AppConstants.refreshTokenKey);
      final userJson = await _storage.read(key: AppConstants.userKey);

      if (token != null && userJson != null) {
        _currentToken = token;
        _refreshToken = refreshTokenValue;
        _currentUser = User.fromJson(jsonDecode(userJson));

        // Check if token is expired
        if (isTokenExpired(token)) {
          if (_refreshToken != null) {
            // Try to refresh token
            final refreshed = await refreshToken();
            if (!refreshed) {
              await logout();
            }
          } else {
            await logout();
          }
        }
      }
    } catch (e) {
      // Clear invalid stored data
      await _clearStoredAuth();
    }
  }

  // Login with email and password
  Future<AuthResult> login(String email, String password) async {
    try {
      final url = '${AppConstants.fullApiUrl}${AppConstants.loginEndpoint}';
      print('Flutter AuthService: Making login request to: $url');
      
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'email': email,
          'password': password,
        }),
      );

      print('Flutter AuthService: Response status: ${response.statusCode}');
      print('Flutter AuthService: Response body: ${response.body}');

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        
        if (data['success'] == true) {
          final userData = data['user'];
          final token = data['token'];
          
          // Create user object from API response
          final user = User(
            id: userData['id'].toString(),
            name: userData['username'] ?? '${userData['first_name']} ${userData['last_name']}',
            email: userData['email'],
            role: userData['role'],
            permissions: _getPermissionsForRole(userData['role']),
            createdAt: DateTime.parse(userData['createdAt']),
            isActive: userData['is_active'] ?? true,
            department: _getDepartmentForRole(userData['role']),
          );
          
          _currentToken = token;
          _currentUser = user;

          // Store authentication data
          await _storeAuth(_currentToken!, _refreshToken, user.toJson());

          return AuthResult.success(
            user: _currentUser!,
            message: AppConstants.loginSuccess,
          );
        } else {
          print('Flutter AuthService: Login failed - success is false');
          return AuthResult.failure(
            message: data['error'] ?? 'Login failed',
            error: 'LOGIN_FAILED',
          );
        }
      } else {
        print('Flutter AuthService: HTTP error - status: ${response.statusCode}');
        final errorData = jsonDecode(response.body);
        return AuthResult.failure(
          message: errorData['error'] ?? 'Login failed',
          error: 'HTTP_${response.statusCode}',
        );
      }
    } catch (e) {
      print('Flutter AuthService: Exception during login: $e');
      return AuthResult.failure(
        message: AppConstants.networkError,
        error: e.toString(),
      );
    }
  }

  // Get permissions based on user role
  List<String> _getPermissionsForRole(String role) {
    switch (role) {
      case 'admin':
        return [
          'view_products', 'create_products', 'edit_products', 'delete_products',
          'manage_stock', 'view_sales', 'create_sales', 'edit_sales', 'cancel_sales',
          'view_customers', 'manage_customers', 'view_reports', 'manage_users',
          'manage_categories', 'access_everything', 'override_permissions',
        ];
      case 'employee':
        return [
          'view_products', 'create_sales', 'edit_sales', 'view_sales',
          'view_customers', 'view_stock', 'manage_stock',
        ];
      case 'customer':
        return [
          'view_products', 'create_sales', 'view_sales',
        ];
      default:
        return ['view_products'];
    }
  }

  // Get department based on user role
  String _getDepartmentForRole(String role) {
    switch (role) {
      case 'admin':
        return 'Administration';
      case 'employee':
        return 'Sales';
      case 'customer':
        return 'Customer';
      default:
        return 'General';
    }
  }

  // Create mock user data
  Map<String, dynamic> _createMockUser(String email) {
    if (email == 'admin@example.com') {
      return {
        'id': '1',
        'name': 'Administrator',
        'email': email,
        'role': 'admin',
        'department': 'Administration',
        'permissions': ['view_products', 'create_sales', 'view_sales', 'view_stock', 'manage_users'],
        'created_at': DateTime.now().toIso8601String(),
      };
    } else if (email == 'salesperson@example.com') {
      return {
        'id': '2',
        'name': 'Sales Representative',
        'email': email,
        'role': 'salesperson',
        'department': 'Sales',
        'permissions': ['view_products', 'create_sales', 'view_sales'],
        'created_at': DateTime.now().toIso8601String(),
      };
    } else {
      return {
        'id': '3',
        'name': 'Demo User',
        'email': email,
        'role': 'user',
        'department': 'Demo',
        'permissions': ['view_products', 'create_sales'],
        'created_at': DateTime.now().toIso8601String(),
      };
    }
  }

  // Generate mock JWT token
  String _generateMockToken(Map<String, dynamic> userData) {
    final header = base64Encode(utf8.encode(jsonEncode({
      'alg': 'HS256',
      'typ': 'JWT'
    })));
    
    final payload = base64Encode(utf8.encode(jsonEncode({
      'sub': userData['id'],
      'email': userData['email'],
      'role': userData['role'],
      'exp': DateTime.now().add(const Duration(hours: 24)).millisecondsSinceEpoch ~/ 1000,
      'iat': DateTime.now().millisecondsSinceEpoch ~/ 1000,
    })));
    
    final signature = base64Encode(utf8.encode('mock_signature'));
    
    return '$header.$payload.$signature';
  }

  // Refresh authentication token
  Future<bool> refreshToken() async {
    if (_currentUser == null) return false;

    try {
      // For mock implementation, just generate a new token
      final userData = _currentUser!.toJson();
      final newToken = _generateMockToken(userData);
      
      _currentToken = newToken;
      
      // Update stored authentication data
      await _storeAuth(newToken, _refreshToken, userData);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Logout user
  Future<void> logout() async {
    try {
      // For mock implementation, just clear local data
      await _clearStoredAuth();
      _currentUser = null;
      _currentToken = null;
      _refreshToken = null;
    } catch (e) {
      // Handle any errors
      await _clearStoredAuth();
      _currentUser = null;
      _currentToken = null;
      _refreshToken = null;
    }
  }

  // Store authentication data securely
  Future<void> _storeAuth(String token, String? refreshToken, Map<String, dynamic>? userData) async {
    await _storage.write(key: AppConstants.tokenKey, value: token);
    
    if (refreshToken != null) {
      await _storage.write(key: AppConstants.refreshTokenKey, value: refreshToken);
    }
    
    if (userData != null) {
      await _storage.write(key: AppConstants.userKey, value: jsonEncode(userData));
    }
  }

  // Clear stored authentication data
  Future<void> _clearStoredAuth() async {
    await _storage.delete(key: AppConstants.tokenKey);
    await _storage.delete(key: AppConstants.refreshTokenKey);
    await _storage.delete(key: AppConstants.userKey);
  }

  // Check if token is expired
  bool isTokenExpired(String token) {
    try {
      return JwtDecoder.isExpired(token);
    } catch (e) {
      return true; // Consider invalid tokens as expired
    }
  }

  // Get token expiration date
  DateTime? getTokenExpirationDate(String token) {
    try {
      return JwtDecoder.getExpirationDate(token);
    } catch (e) {
      return null;
    }
  }

  // Get remaining token time in minutes
  int? getTokenRemainingTime(String token) {
    try {
      final expirationDate = getTokenExpirationDate(token);
      if (expirationDate != null) {
        final now = DateTime.now();
        final difference = expirationDate.difference(now);
        return difference.inMinutes;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  // Permission checking methods
  bool hasPermission(String permission) {
    return _currentUser?.hasPermission(permission) ?? false;
  }

  bool canViewProducts() {
    return hasPermission(AppConstants.viewProductsPermission);
  }

  bool canViewSales() {
    return hasPermission(AppConstants.viewSalesPermission);
  }

  bool canCreateSales() {
    return hasPermission(AppConstants.createSalesPermission);
  }

  bool canViewCustomers() {
    return hasPermission(AppConstants.viewCustomersPermission);
  }

  bool canViewStock() {
    return hasPermission(AppConstants.viewStockPermission);
  }

  // Update user profile
  Future<AuthResult> updateProfile(Map<String, dynamic> userData) async {
    try {
      // Mock implementation - just update local user data
      if (_currentUser != null) {
        // Merge the new data with existing user data
        final updatedUserData = {..._currentUser!.toJson(), ...userData};
        _currentUser = User.fromJson(updatedUserData);
        
        // Update stored user data
        await _storage.write(
          key: AppConstants.userKey, 
          value: jsonEncode(updatedUserData),
        );

        return AuthResult.success(
          user: _currentUser!,
          message: AppConstants.dataUpdatedSuccess,
        );
      }

      return AuthResult.failure(
        message: 'Usuário não encontrado',
        error: 'USER_NOT_FOUND',
      );
    } catch (e) {
      return AuthResult.failure(
        message: AppConstants.unknownError,
        error: e.toString(),
      );
    }
  }

  // Change password
  Future<AuthResult> changePassword(String currentPassword, String newPassword) async {
    try {
      // Mock implementation - just validate and confirm
      if (_currentUser != null) {
        // In a real app, you would validate the current password
        // For demo purposes, we'll just return success
        return AuthResult.success(
          user: _currentUser!,
          message: 'Senha alterada com sucesso!',
        );
      }

      return AuthResult.failure(
        message: 'Usuário não encontrado',
        error: 'USER_NOT_FOUND',
      );
    } catch (e) {
      return AuthResult.failure(
        message: AppConstants.unknownError,
        error: e.toString(),
      );
    }
  }

  // Check if user needs to refresh token soon
  bool shouldRefreshToken() {
    if (_currentToken == null) return false;
    
    final remainingTime = getTokenRemainingTime(_currentToken!);
    return remainingTime != null && remainingTime < 5; // Refresh if less than 5 minutes
  }

  // Get user display name
  String getUserDisplayName() {
    return _currentUser?.displayName ?? 'Usuário';
  }

  // Get user initials
  String getUserInitials() {
    return _currentUser?.initials ?? 'U';
  }

  // Check if user is admin
  bool isAdmin() {
    return _currentUser?.isAdmin ?? false;
  }

  // Check if user is manager
  bool isManager() {
    return _currentUser?.isManager ?? false;
  }

  // Check if user is salesperson
  bool isSalesperson() {
    return _currentUser?.isSalesperson ?? false;
  }

  // Check if user is field user
  bool isFieldUser() {
    return _currentUser?.isFieldUser ?? false;
  }
}

// Authentication result class
class AuthResult {
  final bool isSuccess;
  final User? user;
  final String message;
  final dynamic error;

  AuthResult._({
    required this.isSuccess,
    this.user,
    required this.message,
    this.error,
  });

  factory AuthResult.success({
    required User user,
    required String message,
  }) {
    return AuthResult._(
      isSuccess: true,
      user: user,
      message: message,
    );
  }

  factory AuthResult.failure({
    required String message,
    dynamic error,
  }) {
    return AuthResult._(
      isSuccess: false,
      message: message,
      error: error,
    );
  }
} 