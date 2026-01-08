import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'score_checker_state.dart';

class ScoreCheckerNotifier extends Notifier<ScoreCheckerState> {
  @override
  ScoreCheckerState build() {
    return const ScoreCheckerState();
  }

  void setFile({
    required List<int> fileBytes,
    required String fileName,
  }) {
    state = state.copyWith(
      selectedFileBytes: fileBytes,
      selectedFileName: fileName,
      error: null,
    );
  }

  void clear() {
    state = const ScoreCheckerState();
  }

  Future<void> analyze() async {
    if (state.selectedFileBytes == null || state.selectedFileName == null) {
      state = state.copyWith(error: 'Please select a file first');
      return;
    }

    state = state.copyWith(isLoading: true, error: null);

    try {
      // TODO: Call your backend / firebase function here

      await Future.delayed(const Duration(seconds: 2)); // mock delay

      state = state.copyWith(
        isLoading: false,
        result: 'Score: 78/100 (Mock Result)',
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }
}

final scoreCheckerProvider =
    NotifierProvider<ScoreCheckerNotifier, ScoreCheckerState>(
  ScoreCheckerNotifier.new,
);
