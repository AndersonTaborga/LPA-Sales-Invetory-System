import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';
import '../models/product.dart';

class ProductService {
  static final ProductService _instance = ProductService._internal();
  factory ProductService() => _instance;
  ProductService._internal();

  String? _authToken;

  void setAuthToken(String token) {
    _authToken = token;
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    if (_authToken != null) 'Authorization': 'Bearer $_authToken',
  };

  // Get all products
  Future<List<Product>> getProducts({
    int page = 1,
    int limit = 20,
    String? category,
    String? search,
    bool? isActive,
  }) async {
    try {
      final queryParams = <String, String>{
        'page': page.toString(),
        'limit': limit.toString(),
      };

      if (category != null) queryParams['category'] = category;
      if (search != null) queryParams['search'] = search;
      if (isActive != null) queryParams['is_active'] = isActive.toString();

      final uri = Uri.parse('${AppConstants.fullApiUrl}${AppConstants.productsEndpoint}')
          .replace(queryParameters: queryParams);

      final response = await http.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          final productsData = data['data'] as List;
          return productsData.map((json) => Product.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching products: $e');
      return [];
    }
  }

  // Get product by ID
  Future<Product?> getProductById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.productsEndpoint}/$id'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          return Product.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching product: $e');
      return null;
    }
  }

  // Create new product
  Future<Product?> createProduct(Product product) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.productsEndpoint}'),
        headers: _headers,
        body: jsonEncode(product.toJson()),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          return Product.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error creating product: $e');
      return null;
    }
  }

  // Update product
  Future<Product?> updateProduct(int id, Product product) async {
    try {
      final response = await http.put(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.productsEndpoint}/$id'),
        headers: _headers,
        body: jsonEncode(product.toJson()),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          return Product.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error updating product: $e');
      return null;
    }
  }

  // Delete product
  Future<bool> deleteProduct(int id) async {
    try {
      final response = await http.delete(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.productsEndpoint}/$id'),
        headers: _headers,
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error deleting product: $e');
      return false;
    }
  }

  // Update stock
  Future<Product?> updateStock(int id, int stock) async {
    try {
      final response = await http.patch(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.productsEndpoint}/$id/stock'),
        headers: _headers,
        body: jsonEncode({'stock': stock}),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          return Product.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error updating stock: $e');
      return null;
    }
  }

  // Get low stock products
  Future<List<Product>> getLowStockProducts({int threshold = 10}) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.productsEndpoint}/low-stock?threshold=$threshold'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          final productsData = data['data'] as List;
          return productsData.map((json) => Product.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching low stock products: $e');
      return [];
    }
  }

  // Search products
  Future<List<Product>> searchProducts(String query) async {
    return getProducts(search: query);
  }

  // Get products by category
  Future<List<Product>> getProductsByCategory(String category) async {
    return getProducts(category: category);
  }
}