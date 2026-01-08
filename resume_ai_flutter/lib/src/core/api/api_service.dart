import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:resume_ai_flutter/src/core/config/api_config.dart';

/// API Service for all backend calls
class ApiService {
  final http.Client _client;
  final String baseUrl;

  ApiService({
    http.Client? client,
    String? baseUrl,
  })  : _client = client ?? http.Client(),
        baseUrl = baseUrl ?? ApiConfig.baseUrl;

  // Headers helper
  Map<String, String> _getHeaders({Map<String, String>? additional}) {
    final headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...?additional,
    };
    return headers;
  }

  // Score Checker API
  Future<Map<String, dynamic>> scoreResume({
    required List<int> fileBytes,
    required String fileName,
    List<String>? keywords,
  }) async {
    final uri = Uri.parse('$baseUrl/api/score/');
    final request = http.MultipartRequest('POST', uri);
    
    request.files.add(
      http.MultipartFile.fromBytes(
        'resume',
        fileBytes,
        filename: fileName,
      ),
    );
    
    if (keywords != null && keywords.isNotEmpty) {
      request.fields['keywords'] = keywords.join(',');
    }

    final streamedResponse = await _client.send(request);
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Score failed: ${response.statusCode}');
    }
  }

  // Review Resume API
  Future<Map<String, dynamic>> reviewResume({
    required List<int> fileBytes,
    required String fileName,
  }) async {
    final uri = Uri.parse('$baseUrl/api/review-resume/');
    final request = http.MultipartRequest('POST', uri);
    
    request.files.add(
      http.MultipartFile.fromBytes(
        'resume',
        fileBytes,
        filename: fileName,
      ),
    );

    final streamedResponse = await _client.send(request);
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 200) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Review failed: ${response.statusCode}');
    }
  }

  // Finder APIs
  Future<Map<String, dynamic>> createRequisition({
    required String title,
    required List<String> mustHave,
    required List<String> niceToHave,
    required int minExp,
    String? location,
    String? notes,
    Map<String, dynamic>? advanced,
  }) async {
    final uri = Uri.parse('$baseUrl/api/requisitions/');
    final payload = {
      'title': title,
      'must_have': mustHave,
      'nice_to_have': niceToHave,
      'min_exp': minExp,
      if (location != null) 'location': location,
      if (notes != null) 'notes': notes,
      if (advanced != null) ...advanced,
    };

    final response = await _client.post(
      uri,
      headers: _getHeaders(),
      body: json.encode(payload),
    );

    if (response.statusCode == 200 || response.statusCode == 201) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Create failed: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> getRequisition(int reqId) async {
    final uri = Uri.parse('$baseUrl/api/requisitions/$reqId/');
    final response = await _client.get(uri, headers: _getHeaders());

    if (response.statusCode == 200) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Get failed: ${response.statusCode}');
    }
  }

  Future<List<Map<String, dynamic>>> getCandidates(int reqId) async {
    final uri = Uri.parse('$baseUrl/api/requisitions/$reqId/candidates/');
    final response = await _client.get(uri, headers: _getHeaders());

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      if (data is List) {
        return data.cast<Map<String, dynamic>>();
      }
      return [];
    } else {
      throw Exception('Get candidates failed: ${response.statusCode}');
    }
  }

  Future<void> uploadAnalyze({
    required int reqId,
    required List<int> fileBytes,
    required String fileName,
  }) async {
    final uri = Uri.parse('$baseUrl/api/requisitions/$reqId/upload/');
    final request = http.MultipartRequest('POST', uri);
    
    request.files.add(
      http.MultipartFile.fromBytes(
        'files',
        fileBytes,
        filename: fileName,
      ),
    );

    final streamedResponse = await _client.send(request);
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode != 200 && response.statusCode != 201) {
      throw Exception('Upload failed: ${response.statusCode}');
    }
  }

  Future<Map<String, dynamic>> getMetrics(int reqId) async {
    final uri = Uri.parse('$baseUrl/api/requisitions/$reqId/metrics/');
    final response = await _client.get(uri, headers: _getHeaders());

    if (response.statusCode == 200) {
      return json.decode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception('Get metrics failed: ${response.statusCode}');
    }
  }

  Future<void> exportCsv(int reqId) async {
    final uri = Uri.parse('$baseUrl/api/requisitions/$reqId/export.csv');
    final response = await _client.get(uri);

    if (response.statusCode == 200) {
      // TODO: Handle file download
    } else {
      throw Exception('Export failed: ${response.statusCode}');
    }
  }

  Future<void> updateCandidate({
    required int candidateId,
    String? notes,
    String? status,
  }) async {
    final uri = Uri.parse('$baseUrl/api/candidates/$candidateId/');
    final payload = <String, dynamic>{};
    if (notes != null) payload['notes'] = notes;
    if (status != null) payload['status'] = status;

    final response = await _client.patch(
      uri,
      headers: _getHeaders(),
      body: json.encode(payload),
    );

    if (response.statusCode != 200 && response.statusCode != 204) {
      throw Exception('Update failed: ${response.statusCode}');
    }
  }
}

