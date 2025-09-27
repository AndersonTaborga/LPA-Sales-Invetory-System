import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import '../models/user.dart';
import '../services/auth_service.dart';
import '../services/product_service.dart';
import '../services/sales_service.dart';

class AuthProvider extends ChangeNotifier {
  final AuthService _authService = AuthService();
  
  User? _currentUser;
  bool _isLoading = false;
  String? _errorMessage;
  bool _isInitialized = false;

  // Getters
  User? get currentUser => _currentUser;
  User? get user => _currentUser;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isLoggedIn => _currentUser != null;
  bool get isInitialized => _isInitialized;

  // Initialize provider
  Future<void> initialize() async {
    if (_isInitialized) return;
    
    try {
      await _authService.initialize();
      _currentUser = _authService.currentUser;
      _isInitialized = true;
      
      // Set auth token for other services
      if (_currentUser != null && _authService.currentToken != null) {
        _setAuthTokenForServices(_authService.currentToken!);
      }
      
      // Notify listeners after initialization is complete
      WidgetsBinding.instance.addPostFrameCallback((_) {
        notifyListeners();
      });
    } catch (e) {
      _setError('Erro ao inicializar autenticação');
    }
  }

  // Set auth token for other services
  void _setAuthTokenForServices(String token) {
    // Set token for other services
    try {
      // Import services and set token
      final productService = ProductService();
      final salesService = SalesService();
      
      productService.setAuthToken(token);
      salesService.setAuthToken(token);
    } catch (e) {
      print('Error setting auth token for services: $e');
    }
  }

  // Login
  Future<bool> login(String email, String password) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _authService.login(email, password);
      
      if (result.isSuccess) {
        _currentUser = result.user;
        
        // Set auth token for other services
        if (_authService.currentToken != null) {
          _setAuthTokenForServices(_authService.currentToken!);
        }
        
        notifyListeners();
        return true;
      } else {
        _setError(result.message);
        return false;
      }
    } catch (e) {
      _setError('Erro inesperado durante o login');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Logout
  Future<void> logout() async {
    _setLoading(true);
    
    try {
      await _authService.logout();
      _currentUser = null;
      notifyListeners();
    } catch (e) {
      // Even if logout fails on server, clear local data
      _currentUser = null;
      notifyListeners();
    } finally {
      _setLoading(false);
    }
  }

  // Refresh token
  Future<bool> refreshToken() async {
    try {
      final success = await _authService.refreshToken();
      if (success) {
        _currentUser = _authService.currentUser;
        notifyListeners();
      }
      return success;
    } catch (e) {
      return false;
    }
  }

  // Update profile
  Future<bool> updateProfile(Map<String, dynamic> userData) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _authService.updateProfile(userData);
      
      if (result.isSuccess) {
        _currentUser = result.user;
        notifyListeners();
        return true;
      } else {
        _setError(result.message);
        return false;
      }
    } catch (e) {
      _setError('Erro ao atualizar perfil');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Change password
  Future<bool> changePassword(String currentPassword, String newPassword) async {
    _setLoading(true);
    _clearError();

    try {
      final result = await _authService.changePassword(currentPassword, newPassword);
      
      if (result.isSuccess) {
        return true;
      } else {
        _setError(result.message);
        return false;
      }
    } catch (e) {
      _setError('Erro ao alterar senha');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Permission checking methods
  bool hasPermission(String permission) {
    return _authService.hasPermission(permission);
  }

  // Permission checks with ADMIN OVERRIDE - Admin can do EVERYTHING
  bool canViewProducts() => isAdmin || (_currentUser?.canViewProducts() ?? false);
  bool canCreateProducts() => isAdmin || (_currentUser?.canCreateProducts() ?? false);
  bool canEditProducts() => isAdmin || (_currentUser?.canEditProducts() ?? false);
  bool canDeleteProducts() => isAdmin || (_currentUser?.canDeleteProducts() ?? false);
  bool canManageStock() => isAdmin || (_currentUser?.canManageStock() ?? false);

  bool canViewSales() => isAdmin || (_currentUser?.canViewSales() ?? false);
  bool canCreateSales() => isAdmin || (_currentUser?.canCreateSales() ?? false);
  bool canEditSales() => isAdmin || (_currentUser?.canEditSales() ?? false);
  bool canCancelSales() => isAdmin || (_currentUser?.canCancelSales() ?? false);

  bool canViewCustomers() => isAdmin || (_currentUser?.canViewCustomers() ?? false);
  bool canManageCustomers() => isAdmin || (_currentUser?.canManageCustomers() ?? false);

  bool canViewReports() => isAdmin || (_currentUser?.canViewReports() ?? false);
  bool canManageUsers() => isAdmin || (_currentUser?.canManageUsers() ?? false);
  bool canManageCategories() => isAdmin || (_currentUser?.canManageCategories() ?? false);

  // Role checking methods
  bool get isAdmin => _currentUser?.isAdmin ?? false;
  bool get isManager => _currentUser?.isManager ?? false;
  bool get isSalesperson => _currentUser?.isSalesperson ?? false;
  bool get isFieldUser => _currentUser?.isFieldUser ?? false;

  // Convenience getters
  bool get isAuthenticated => _currentUser != null;
  
  // ADMIN SUPER POWERS
  bool canAccessEverything() => isAdmin;
  bool canOverrideAnyPermission() => isAdmin;

  // User display methods
  String get userDisplayName => _authService.getUserDisplayName();
  String get userInitials => _authService.getUserInitials();

  // Check if token needs refresh
  bool get shouldRefreshToken => _authService.shouldRefreshToken();

  // Private helper methods
  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  void _setError(String error) {
    _errorMessage = error;
    notifyListeners();
  }

  void _clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  // Clear error message
  void clearError() {
    _clearError();
  }
} 