import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai_flutter/src/core/api/api_service.dart';
import 'package:resume_ai_flutter/src/core/providers/api_provider.dart';

/// Review Resume State
class ReviewResumeState {
  final bool isLoading;
  final String? selectedFileName;
  final List<int>? selectedFileBytes;
  final Map<String, dynamic>? results;
  final String? error;
  final Set<int> completedQuests;

  ReviewResumeState({
    this.isLoading = false,
    this.selectedFileName,
    this.selectedFileBytes,
    this.results,
    this.error,
    Set<int>? completedQuests,
  }) : completedQuests = completedQuests ?? {};

  ReviewResumeState copyWith({
    bool? isLoading,
    String? selectedFileName,
    List<int>? selectedFileBytes,
    Map<String, dynamic>? results,
    String? error,
    Set<int>? completedQuests,
    bool clearError = false,
    bool clearResults = false,
  }) {
    return ReviewResumeState(
      isLoading: isLoading ?? this.isLoading,
      selectedFileName: selectedFileName ?? this.selectedFileName,
      selectedFileBytes: selectedFileBytes ?? this.selectedFileBytes,
      results: clearResults ? null : (results ?? this.results),
      error: clearError ? null : (error ?? this.error),
      completedQuests: completedQuests ?? this.completedQuests,
    );
  }
}

/// Review Resume Notifier
class ReviewResumeNotifier extends StateNotifier<ReviewResumeState> {
  final ApiService _apiService;

  ReviewResumeNotifier(this._apiService) : super(ReviewResumeState());

  void selectFile(String fileName, List<int> fileBytes) {
    state = state.copyWith(
      selectedFileName: fileName,
      selectedFileBytes: fileBytes,
      clearError: true,
    );
  }

  void clearFile() {
    state = state.copyWith(
      selectedFileName: null,
      selectedFileBytes: null,
      clearResults: true,
      clearError: true,
    );
  }

  Future<void> reviewResume() async {
    if (state.selectedFileBytes == null || state.selectedFileName == null) {
      state = state.copyWith(error: 'Please select a file first');
      return;
    }

    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final results = await _apiService.reviewResume(
        fileBytes: state.selectedFileBytes!,
        fileName: state.selectedFileName!,
      );

      state = state.copyWith(
        isLoading: false,
        results: results,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  void toggleQuest(int index) {
    final newQuests = Set<int>.from(state.completedQuests);
    if (newQuests.contains(index)) {
      newQuests.remove(index);
    } else {
      newQuests.add(index);
    }
    state = state.copyWith(completedQuests: newQuests);
  }

  void reset() {
    state = ReviewResumeState();
  }
}

/// Review Resume Provider
final reviewResumeProvider =
    StateNotifierProvider<ReviewResumeNotifier, ReviewResumeState>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return ReviewResumeNotifier(apiService);
});

