import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:webview_cookie_manager_plus/webview_cookie_manager_plus.dart';

class ApiService {
  static const String baseUrl = "http://soracl.lamay.systems:8000";
  static const String domain = "soracl.lamay.systems";

  // Store the raw cookie string (e.g., "token=xyz123...")
  String? _rawCookie;

  final cookieManager = WebviewCookieManager();

  Future<void> fetchTokenFromStorage() async {
    final cookies = await cookieManager.getCookies(
      'http://soracl.lamay.systems',
    );

    for (var item in cookies) {
      if (item.name == 'token') {
        print('Grabbed JWT Token: ${item.value}');
        // Save this to your ApiService to use in native Material widgets
        setToken(item.value);
        _rawCookie = item.value;
      }
    }
  }

  void setToken(String token) {
    print('Got token ${token}');
    _rawCookie = token;
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/users/login'),
      body: {'email': email, 'password': password},
    );

    if (response.statusCode == 200) {
      // Extract the cookie from headers
      String? rawCookie = response.headers['set-cookie'];
      if (rawCookie != null) {
        _rawCookie = rawCookie.split(';').first; // Get "token=..."
      }
      return jsonDecode(response.body);
    }
    throw Exception('Login failed');
  }

  Future<void> createPost(
    String title,
    double lat,
    double long,
    String desc,
  ) async {
    await fetchTokenFromStorage();

    final response = await http.post(
      Uri.parse('$baseUrl/api/posts/'),
      headers: {
        // Inject the cookie header for authentication
        'Cookie': 'token=${_rawCookie};',
      },
      body: {
        'title': title,
        'latitude': lat.toString(),
        'longitude': long.toString(),
        'description': desc,
      },
    );

    if (response.statusCode != 200) {
      print(response.body);
    }
  }

  String? get rawCookie => _rawCookie;
}
