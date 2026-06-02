import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'https://elimutube-production.up.railway.app';
  static String? token;

  static Map<String, String> _getHeaders() {
    return {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer $token',
    };
  }

  static Future<dynamic> get(String endpoint) async {
    final response = await http.get(
      Uri.parse('$baseUrl/${endpoint.replaceAll(RegExp(r'^/'), '')}'),
      headers: _getHeaders(),
    );
    return _handleResponse(response);
  }

  static Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    final response = await http.post(
      Uri.parse('$baseUrl/${endpoint.replaceAll(RegExp(r'^/'), '')}'),
      headers: _getHeaders(),
      body: jsonEncode(body),
    );
    return _handleResponse(response);
  }

  static Future<dynamic> put(String endpoint, Map<String, dynamic> body) async {
    final response = await http.put(
      Uri.parse('$baseUrl/${endpoint.replaceAll(RegExp(r'^/'), '')}'),
      headers: _getHeaders(),
      body: jsonEncode(body),
    );
    return _handleResponse(response);
  }

  static Future<dynamic> delete(String endpoint) async {
    final response = await http.delete(
      Uri.parse('$baseUrl/${endpoint.replaceAll(RegExp(r'^/'), '')}'),
      headers: _getHeaders(),
    );
    return _handleResponse(response);
  }

  static dynamic _handleResponse(http.Response response) {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      if (response.body.isEmpty) return null;
      return jsonDecode(response.body);
    } else {
      String errorMessage = 'An error occurred';
      try {
        final errorJson = jsonDecode(response.body);
        errorMessage = errorJson['message'] ?? errorMessage;
      } catch (_) {}
      throw Exception(errorMessage);
    }
  }
}
