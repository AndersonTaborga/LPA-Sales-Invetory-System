import 'package:flutter/foundation.dart';
import '../models/product.dart';
import '../services/product_service.dart';

class ProductProvider extends ChangeNotifier {
  final ProductService _productService = ProductService();
  
  List<Product> _products = [];
  List<Map<String, dynamic>> _categories = [];
  Map<String, dynamic>? _stats;
  
  bool _isLoading = false;
  bool _isLoadingMore = false;
  String? _errorMessage;
  
  // Pagination
  int _currentPage = 1;
  int _totalPages = 1;
  int _totalCount = 0;
  bool _hasNextPage = false;
  bool _hasPreviousPage = false;
  
  // Filters
  String? _searchQuery;
  String? _selectedCategory;
  String? _sortBy;
  String? _sortOrder;
  bool? _inStock;
  bool? _lowStock;

  // Getters
  List<Product> get products => _products;
  List<Map<String, dynamic>> get categories => _categories;
  Map<String, dynamic>? get stats => _stats;
  
  bool get isLoading => _isLoading;
  bool get isLoadingMore => _isLoadingMore;
  String? get errorMessage => _errorMessage;
  
  int get currentPage => _currentPage;
  int get totalPages => _totalPages;
  int get totalCount => _totalCount;
  bool get hasNextPage => _hasNextPage;
  bool get hasPreviousPage => _hasPreviousPage;
  
  String? get searchQuery => _searchQuery;
  String? get selectedCategory => _selectedCategory;
  String? get sortBy => _sortBy;
  String? get sortOrder => _sortOrder;
  bool? get inStock => _inStock;
  bool? get lowStock => _lowStock;

  // Load products
  Future<void> loadProducts({bool refresh = false}) async {
    if (refresh) {
      _currentPage = 1;
      _products.clear();
    }
    
    _setLoading(true);
    _clearError();

    try {
      final products = await _productService.getProducts(
        page: _currentPage,
        limit: 20,
        search: _searchQuery,
        category: _selectedCategory,
        isActive: _inStock,
      );

      if (refresh) {
        _products = products;
      } else {
        _products.addAll(products);
      }
      
      _hasNextPage = products.length == 20; // Assume there's more if we got a full page
      _hasPreviousPage = _currentPage > 1;
      
      notifyListeners();
    } catch (e) {
      _setError('Erro ao carregar produtos');
    } finally {
      _setLoading(false);
    }
  }

  // Load more products (pagination)
  Future<void> loadMoreProducts() async {
    if (!_hasNextPage || _isLoadingMore) return;
    
    _isLoadingMore = true;
    notifyListeners();
    
    try {
      _currentPage++;
      final products = await _productService.getProducts(
        page: _currentPage,
        limit: 20,
        search: _searchQuery,
        category: _selectedCategory,
        isActive: _inStock,
      );

      _products.addAll(products);
      _hasNextPage = products.length == 20; // Assume there's more if we got a full page
      _hasPreviousPage = _currentPage > 1;
      notifyListeners();
    } catch (e) {
      _currentPage--; // Revert page increment on error
      _setError('Erro ao carregar mais produtos');
    } finally {
      _isLoadingMore = false;
      notifyListeners();
    }
  }

  // Search products
  Future<void> searchProducts(String query) async {
    _searchQuery = query.trim().isEmpty ? null : query.trim();
    await loadProducts(refresh: true);
  }

  // Filter by category
  Future<void> filterByCategory(String? categoryId) async {
    _selectedCategory = categoryId;
    await loadProducts(refresh: true);
  }

  // Sort products
  Future<void> sortProducts(String sortBy, String sortOrder) async {
    _sortBy = sortBy;
    _sortOrder = sortOrder;
    await loadProducts(refresh: true);
  }

  // Filter by stock status
  Future<void> filterByStock({bool? inStock, bool? lowStock}) async {
    _inStock = inStock;
    _lowStock = lowStock;
    await loadProducts(refresh: true);
  }

  // Clear all filters
  Future<void> clearFilters() async {
    _searchQuery = null;
    _selectedCategory = null;
    _sortBy = null;
    _sortOrder = null;
    _inStock = null;
    _lowStock = null;
    await loadProducts(refresh: true);
  }

  // Load categories
  Future<void> loadCategories() async {
    try {
      // For now, create mock categories based on products
      final categories = <String>{};
      for (final product in _products) {
        if (product.category != null) {
          categories.add(product.category!);
        }
      }
      
      _categories = categories.map((name) => {
        'id': name.toLowerCase(),
        'name': name,
        'description': 'Categoria $name',
      }).toList();
      
      notifyListeners();
    } catch (e) {
      // Categories are not critical, so we don't show error
    }
  }

  // Load product statistics
  Future<void> loadStats() async {
    try {
      // Calculate stats from current products
      final totalProducts = _products.length;
      final lowStockProducts = _products.where((p) => p.stockQuantity <= 10).length;
      final outOfStockProducts = _products.where((p) => p.stockQuantity == 0).length;
      final totalValue = _products.fold(0.0, (sum, p) => sum + (p.price * p.stockQuantity));
      
      _stats = {
        'totalProducts': totalProducts,
        'lowStockProducts': lowStockProducts,
        'outOfStockProducts': outOfStockProducts,
        'totalValue': totalValue,
      };
      
      notifyListeners();
    } catch (e) {
      // Stats are not critical, so we don't show error
    }
  }

  // Get product by ID
  Future<Product?> getProduct(String productId) async {
    try {
      final id = int.tryParse(productId);
      if (id == null) return null;
      
      return await _productService.getProductById(id);
    } catch (e) {
      return null;
    }
  }

  // Check product availability
  Future<bool> checkAvailability(String productId, int quantity) async {
    try {
      final product = await getProduct(productId);
      return product != null && product.stockQuantity >= quantity;
    } catch (e) {
      return false;
    }
  }

  // Get similar products
  Future<List<Product>> getSimilarProducts(String productId) async {
    try {
      final product = await getProduct(productId);
      if (product == null) return [];
      
      return _products.where((p) => 
        p.id != productId && 
        p.category == product.category
      ).take(5).toList();
    } catch (e) {
      return [];
    }
  }

  // Update product in local list
  void updateProductInList(Product updatedProduct) {
    final index = _products.indexWhere((p) => p.id == updatedProduct.id);
    if (index != -1) {
      _products[index] = updatedProduct;
      notifyListeners();
    }
  }

  // Remove product from local list
  void removeProductFromList(String productId) {
    _products.removeWhere((p) => p.id == productId);
    notifyListeners();
  }

  // Add product to local list
  void addProductToList(Product product) {
    _products.insert(0, product);
    notifyListeners();
  }

  // Add new product
  Future<bool> addProduct(Product product) async {
    try {
      _setLoading(true);
      final createdProduct = await _productService.createProduct(product);
      
      if (createdProduct != null) {
        // Add to local list
        addProductToList(createdProduct);
        return true;
      } else {
        _setError('Erro ao criar produto');
        return false;
      }
    } catch (e) {
      _setError('Erro ao adicionar produto: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  // Update existing product
  Future<bool> updateProduct(Product product) async {
    try {
      final id = int.tryParse(product.id);
      if (id == null) return false;
      
      final updatedProduct = await _productService.updateProduct(id, product);
      
      if (updatedProduct != null) {
        updateProductInList(updatedProduct);
        return true;
      } else {
        _setError('Erro ao atualizar produto');
        return false;
      }
    } catch (e) {
      _setError('Erro ao atualizar produto: $e');
      return false;
    }
  }

  // Delete product
  Future<bool> deleteProduct(String productId) async {
    try {
      final id = int.tryParse(productId);
      if (id == null) return false;
      
      final success = await _productService.deleteProduct(id);
      
      if (success) {
        removeProductFromList(productId);
        return true;
      } else {
        _setError('Erro ao deletar produto');
        return false;
      }
    } catch (e) {
      _setError('Erro ao deletar produto: $e');
      return false;
    }
  }

  // Get products by category name
  List<Product> getProductsByCategory(String categoryName) {
    return _products.where((p) => p.category == categoryName).toList();
  }

  // Get low stock products
  List<Product> getLowStockProducts() {
    return _products.where((p) => p.stockQuantity <= 10).toList();
  }

  // Get out of stock products
  List<Product> getOutOfStockProducts() {
    return _products.where((p) => p.stockQuantity == 0).toList();
  }

  // Get products that need restocking
  List<Product> getProductsNeedingRestock() {
    return _products.where((p) => p.stockQuantity <= 5).toList();
  }

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

  // Refresh all data
  Future<void> refreshAll() async {
    await Future.wait([
      loadProducts(refresh: true),
      loadCategories(),
      loadStats(),
    ]);
  }
} 