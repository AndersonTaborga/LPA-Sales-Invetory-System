import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../constants/app_constants.dart';

// TODO: Para projeto real, configurar:
// 1. Base URL da API em produção
// 2. Interceptors para autenticação automática
// 3. Retry logic para falhas de rede
// 4. Timeout configuration
// 5. SSL Certificate pinning para segurança

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  final _storage = const FlutterSecureStorage();
  late http.Client _client;

  // TODO: Substituir por URL real da API
  static const String baseUrl = 'https://your-api.com/api/v1';
  
  // Headers padrão
  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // TODO: Adicionar token de autenticação
    // 'Authorization': 'Bearer $token',
  };

  void initialize() {
    _client = http.Client();
  }

  // Helper method to get headers
  Future<Map<String, String>> _getHeaders({bool includeAuth = true}) async {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (includeAuth) {
      final token = await _storage.read(key: AppConstants.tokenKey);
      if (token != null) {
        headers['Authorization'] = 'Bearer $token';
      }
    }

    return headers;
  }

  // Handle and format errors
  ApiError _handleError(http.Response? response, dynamic error) {
    if (response != null) {
      final statusCode = response.statusCode;
      String message;
      
      try {
        final data = json.decode(response.body);
        message = data['message'] ?? 'HTTP Error $statusCode';
      } catch (e) {
        message = 'HTTP Error $statusCode';
      }

      switch (statusCode) {
        case 400:
          message = 'Bad Request';
          break;
        case 401:
          message = AppConstants.unauthorizedError;
          break;
        case 404:
          message = AppConstants.notFoundError;
          break;
        case 500:
          message = AppConstants.serverError;
          break;
      }

      return ApiError(
        message: message,
        code: 'HTTP_$statusCode',
        statusCode: statusCode,
      );
    }

    // Network error
    return ApiError(
      message: AppConstants.networkError,
      code: 'NETWORK_ERROR',
      statusCode: null,
    );
  }

  // GET request
  Future<ApiResponse<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final uri = Uri.parse('${AppConstants.fullApiUrl}$path');
      final uriWithQuery = queryParameters != null 
          ? uri.replace(queryParameters: queryParameters.map((key, value) => MapEntry(key, value.toString())))
          : uri;
      
      final headers = await _getHeaders();
      final response = await _client.get(uriWithQuery, headers: headers);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final data = json.decode(response.body);
        return ApiResponse<T>(
          data: data,
          statusCode: response.statusCode,
          message: 'Success',
        );
      } else {
        final apiError = _handleError(response, null);
        return ApiResponse<T>(
          data: null,
          statusCode: response.statusCode,
          message: apiError.message,
          error: apiError,
        );
      }
    } catch (e) {
      final apiError = _handleError(null, e);
      return ApiResponse<T>(
        data: null,
        statusCode: 500,
        message: apiError.message,
        error: apiError,
      );
    }
  }

  // POST request
  Future<ApiResponse<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final uri = Uri.parse('${AppConstants.fullApiUrl}$path');
      final uriWithQuery = queryParameters != null 
          ? uri.replace(queryParameters: queryParameters.map((key, value) => MapEntry(key, value.toString())))
          : uri;
      
      final headers = await _getHeaders();
      final body = data != null ? json.encode(data) : null;
      
      final response = await _client.post(uriWithQuery, headers: headers, body: body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final responseData = json.decode(response.body);
        return ApiResponse<T>(
          data: responseData,
          statusCode: response.statusCode,
          message: 'Success',
        );
      } else {
        final apiError = _handleError(response, null);
        return ApiResponse<T>(
          data: null,
          statusCode: response.statusCode,
          message: apiError.message,
          error: apiError,
        );
      }
    } catch (e) {
      final apiError = _handleError(null, e);
      return ApiResponse<T>(
        data: null,
        statusCode: 500,
        message: apiError.message,
        error: apiError,
      );
    }
  }

  // PUT request
  Future<ApiResponse<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final uri = Uri.parse('${AppConstants.fullApiUrl}$path');
      final uriWithQuery = queryParameters != null 
          ? uri.replace(queryParameters: queryParameters.map((key, value) => MapEntry(key, value.toString())))
          : uri;
      
      final headers = await _getHeaders();
      final body = data != null ? json.encode(data) : null;
      
      final response = await _client.put(uriWithQuery, headers: headers, body: body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final responseData = json.decode(response.body);
        return ApiResponse<T>(
          data: responseData,
          statusCode: response.statusCode,
          message: 'Success',
        );
      } else {
        final apiError = _handleError(response, null);
        return ApiResponse<T>(
          data: null,
          statusCode: response.statusCode,
          message: apiError.message,
          error: apiError,
        );
      }
    } catch (e) {
      final apiError = _handleError(null, e);
      return ApiResponse<T>(
        data: null,
        statusCode: 500,
        message: apiError.message,
        error: apiError,
      );
    }
  }

  // DELETE request
  Future<ApiResponse<T>> delete<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final uri = Uri.parse('${AppConstants.fullApiUrl}$path');
      final uriWithQuery = queryParameters != null 
          ? uri.replace(queryParameters: queryParameters.map((key, value) => MapEntry(key, value.toString())))
          : uri;
      
      final headers = await _getHeaders();
      final response = await _client.delete(uriWithQuery, headers: headers);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final responseData = response.body.isNotEmpty ? json.decode(response.body) : null;
        return ApiResponse<T>(
          data: responseData,
          statusCode: response.statusCode,
          message: 'Success',
        );
      } else {
        final apiError = _handleError(response, null);
        return ApiResponse<T>(
          data: null,
          statusCode: response.statusCode,
          message: apiError.message,
          error: apiError,
        );
      }
    } catch (e) {
      final apiError = _handleError(null, e);
      return ApiResponse<T>(
        data: null,
        statusCode: 500,
        message: apiError.message,
        error: apiError,
      );
    }
  }

  // PATCH request
  Future<ApiResponse<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      final uri = Uri.parse('${AppConstants.fullApiUrl}$path');
      final uriWithQuery = queryParameters != null 
          ? uri.replace(queryParameters: queryParameters.map((key, value) => MapEntry(key, value.toString())))
          : uri;
      
      final headers = await _getHeaders();
      final body = data != null ? json.encode(data) : null;
      
      final response = await _client.patch(uriWithQuery, headers: headers, body: body);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final responseData = json.decode(response.body);
        return ApiResponse<T>(
          data: responseData,
          statusCode: response.statusCode,
          message: 'Success',
        );
      } else {
        final apiError = _handleError(response, null);
        return ApiResponse<T>(
          data: null,
          statusCode: response.statusCode,
          message: apiError.message,
          error: apiError,
        );
      }
    } catch (e) {
      final apiError = _handleError(null, e);
      return ApiResponse<T>(
        data: null,
        statusCode: 500,
        message: apiError.message,
        error: apiError,
      );
    }
  }

  // Upload file
  Future<ApiResponse<T>> uploadFile<T>(
    String path,
    File file, {
    Map<String, String>? fields,
    String fileFieldName = 'file',
  }) async {
    try {
      final uri = Uri.parse('${AppConstants.fullApiUrl}$path');
      final request = http.MultipartRequest('POST', uri);
      
      // Add headers
      final token = await _storage.read(key: AppConstants.tokenKey);
      if (token != null) {
        request.headers['Authorization'] = 'Bearer $token';
      }
      
      // Add file
      request.files.add(await http.MultipartFile.fromPath(fileFieldName, file.path));
      
      // Add fields
      if (fields != null) {
        request.fields.addAll(fields);
      }
      
      final streamedResponse = await request.send();
      final response = await http.Response.fromStream(streamedResponse);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        final responseData = json.decode(response.body);
        return ApiResponse<T>(
          data: responseData,
          statusCode: response.statusCode,
          message: 'Success',
        );
      } else {
        final apiError = _handleError(response, null);
        return ApiResponse<T>(
          data: null,
          statusCode: response.statusCode,
          message: apiError.message,
          error: apiError,
        );
      }
    } catch (e) {
      final apiError = _handleError(null, e);
      return ApiResponse<T>(
        data: null,
        statusCode: 500,
        message: apiError.message,
        error: apiError,
      );
    }
  }

  // Download file
  Future<ApiResponse<List<int>>> downloadFile(String path) async {
    try {
      final uri = Uri.parse('${AppConstants.fullApiUrl}$path');
      final headers = await _getHeaders();
      final response = await _client.get(uri, headers: headers);
      
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return ApiResponse<List<int>>(
          data: response.bodyBytes,
          statusCode: response.statusCode,
          message: 'Success',
        );
      } else {
        final apiError = _handleError(response, null);
        return ApiResponse<List<int>>(
          data: null,
          statusCode: response.statusCode,
          message: apiError.message,
          error: apiError,
        );
      }
    } catch (e) {
      final apiError = _handleError(null, e);
      return ApiResponse<List<int>>(
        data: null,
        statusCode: 500,
        message: apiError.message,
        error: apiError,
      );
    }
  }

  // Dispose resources
  void dispose() {
    _client.close();
  }
}

// API Response wrapper
class ApiResponse<T> {
  final T? data;
  final int statusCode;
  final String message;
  final ApiError? error;

  ApiResponse({
    this.data,
    required this.statusCode,
    required this.message,
    this.error,
  });

  bool get isSuccess => statusCode >= 200 && statusCode < 300 && error == null;
}

// API Error model
class ApiError {
  final String message;
  final String code;
  final int? statusCode;
  final dynamic details;

  ApiError({
    required this.message,
    required this.code,
    this.statusCode,
    this.details,
  });

  @override
  String toString() {
    return 'ApiError(message: $message, code: $code, statusCode: $statusCode)';
  }
} 