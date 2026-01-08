import 'package:freezed_annotation/freezed_annotation.dart';

part 'score_checker_state.freezed.dart';

@freezed
sealed class ScoreCheckerState with _$ScoreCheckerState {
  const factory ScoreCheckerState({
    @Default(false) bool isLoading,
    String? error,
    String? result,
    List<int>? selectedFileBytes,
    String? selectedFileName,
  }) = _ScoreCheckerState;

  const ScoreCheckerState._();
}
