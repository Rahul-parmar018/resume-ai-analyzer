import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai_flutter/src/core/api/api_service.dart';

/// API Service Provider
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService();
});

