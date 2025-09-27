import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/app_constants.dart';
import '../models/sale.dart';

class SalesService {
  static final SalesService _instance = SalesService._internal();
  factory SalesService() => _instance;
  SalesService._internal();

  String? _authToken;

  void setAuthToken(String token) {
    _authToken = token;
  }

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    if (_authToken != null) 'Authorization': 'Bearer $_authToken',
  };

  // Get all sales
  Future<List<Sale>> getSales({
    int page = 1,
    int limit = 20,
    String? status,
    int? userId,
    String? startDate,
    String? endDate,
  }) async {
    try {
      final queryParams = <String, String>{
        'page': page.toString(),
        'limit': limit.toString(),
      };

      if (status != null) queryParams['status'] = status;
      if (userId != null) queryParams['user_id'] = userId.toString();
      if (startDate != null) queryParams['start_date'] = startDate;
      if (endDate != null) queryParams['end_date'] = endDate;

      final uri = Uri.parse('${AppConstants.fullApiUrl}${AppConstants.salesEndpoint}')
          .replace(queryParameters: queryParams);

      final response = await http.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          final salesData = data['data'] as List;
          return salesData.map((json) => Sale.fromJson(json)).toList();
        }
      }
      return [];
    } catch (e) {
      print('Error fetching sales: $e');
      return [];
    }
  }

  // Get sale by ID
  Future<Sale?> getSaleById(int id) async {
    try {
      final response = await http.get(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.salesEndpoint}/$id'),
        headers: _headers,
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          return Sale.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching sale: $e');
      return null;
    }
  }

  // Create new sale
  Future<Sale?> createSale(Sale sale) async {
    try {
      final response = await http.post(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.salesEndpoint}'),
        headers: _headers,
        body: jsonEncode(sale.toJson()),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          return Sale.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error creating sale: $e');
      return null;
    }
  }

  // Update sale
  Future<Sale?> updateSale(int id, Sale sale) async {
    try {
      final response = await http.put(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.salesEndpoint}/$id'),
        headers: _headers,
        body: jsonEncode(sale.toJson()),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          return Sale.fromJson(data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error updating sale: $e');
      return null;
    }
  }

  // Delete sale
  Future<bool> deleteSale(int id) async {
    try {
      final response = await http.delete(
        Uri.parse('${AppConstants.fullApiUrl}${AppConstants.salesEndpoint}/$id'),
        headers: _headers,
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Error deleting sale: $e');
      return false;
    }
  }

  // Get sales by status
  Future<List<Sale>> getSalesByStatus(String status) async {
    return getSales(status: status);
  }

  // Get sales by user
  Future<List<Sale>> getSalesByUser(int userId) async {
    return getSales(userId: userId);
  }

  // Get sales by date range
  Future<List<Sale>> getSalesByDateRange(DateTime startDate, DateTime endDate) async {
    return getSales(
      startDate: startDate.toIso8601String(),
      endDate: endDate.toIso8601String(),
    );
  }

  // Get today's sales
  Future<List<Sale>> getTodaysSales() async {
    final today = DateTime.now();
    final startOfDay = DateTime(today.year, today.month, today.day);
    final endOfDay = startOfDay.add(const Duration(days: 1));
    
    return getSalesByDateRange(startOfDay, endOfDay);
  }

  // Get sales summary
  Future<Map<String, dynamic>?> getSalesSummary({
    String? startDate,
    String? endDate,
  }) async {
    try {
      final queryParams = <String, String>{};
      if (startDate != null) queryParams['start_date'] = startDate;
      if (endDate != null) queryParams['end_date'] = endDate;

      final uri = Uri.parse('${AppConstants.fullApiUrl}${AppConstants.reportsEndpoint}/sales')
          .replace(queryParameters: queryParams);

      final response = await http.get(uri, headers: _headers);

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['status'] == 'success') {
          return data['data'];
        }
      }
      return null;
    } catch (e) {
      print('Error fetching sales summary: $e');
      return null;
    }
  }
}
