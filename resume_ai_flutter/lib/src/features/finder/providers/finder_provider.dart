import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai_flutter/src/core/api/api_service.dart';
import 'package:resume_ai_flutter/src/core/providers/api_provider.dart';

/// Finder List State
class FinderListState {
  final bool isLoading;
  final List<Map<String, dynamic>> requisitions;
  final String? error;

  FinderListState({
    this.isLoading = false,
    List<Map<String, dynamic>>? requisitions,
    this.error,
  }) : requisitions = requisitions ?? [];

  FinderListState copyWith({
    bool? isLoading,
    List<Map<String, dynamic>>? requisitions,
    String? error,
    bool clearError = false,
  }) {
    return FinderListState(
      isLoading: isLoading ?? this.isLoading,
      requisitions: requisitions ?? this.requisitions,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Finder Detail State
class FinderDetailState {
  final bool isLoading;
  final Map<String, dynamic>? requisition;
  final List<Map<String, dynamic>> candidates;
  final Map<String, dynamic>? metrics;
  final Set<int> selectedIndices;
  final String? minMatchFilter;
  final String? statusFilter;
  final int currentPage;
  final String? error;

  FinderDetailState({
    this.isLoading = false,
    this.requisition,
    List<Map<String, dynamic>>? candidates,
    this.metrics,
    Set<int>? selectedIndices,
    this.minMatchFilter,
    this.statusFilter,
    this.currentPage = 1,
    this.error,
  })  : candidates = candidates ?? [],
        selectedIndices = selectedIndices ?? {};

  FinderDetailState copyWith({
    bool? isLoading,
    Map<String, dynamic>? requisition,
    List<Map<String, dynamic>>? candidates,
    Map<String, dynamic>? metrics,
    Set<int>? selectedIndices,
    String? minMatchFilter,
    String? statusFilter,
    int? currentPage,
    String? error,
    bool clearError = false,
  }) {
    return FinderDetailState(
      isLoading: isLoading ?? this.isLoading,
      requisition: requisition ?? this.requisition,
      candidates: candidates ?? this.candidates,
      metrics: metrics ?? this.metrics,
      selectedIndices: selectedIndices ?? this.selectedIndices,
      minMatchFilter: minMatchFilter ?? this.minMatchFilter,
      statusFilter: statusFilter ?? this.statusFilter,
      currentPage: currentPage ?? this.currentPage,
      error: clearError ? null : (error ?? this.error),
    );
  }
}

/// Finder List Notifier
class FinderListNotifier extends StateNotifier<FinderListState> {
  final ApiService _apiService;

  FinderListNotifier(this._apiService) : super(FinderListState());

  Future<void> createRequisition({
    required String title,
    required List<String> mustHave,
    required List<String> niceToHave,
    required int minExp,
    String? location,
    String? notes,
    Map<String, dynamic>? advanced,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final result = await _apiService.createRequisition(
        title: title,
        mustHave: mustHave,
        niceToHave: niceToHave,
        minExp: minExp,
        location: location,
        notes: notes,
        advanced: advanced,
      );

      state = state.copyWith(isLoading: false);
      return result;
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
      rethrow;
    }
  }
}

/// Finder Detail Notifier
class FinderDetailNotifier extends StateNotifier<FinderDetailState> {
  final ApiService _apiService;
  final int requisitionId;

  FinderDetailNotifier(this._apiService, this.requisitionId)
      : super(FinderDetailState()) {
    loadRequisition();
    loadCandidates();
  }

  Future<void> loadRequisition() async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      final requisition = await _apiService.getRequisition(requisitionId);
      state = state.copyWith(
        isLoading: false,
        requisition: requisition,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> loadCandidates() async {
    try {
      final candidates = await _apiService.getCandidates(requisitionId);
      state = state.copyWith(candidates: candidates);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> loadMetrics() async {
    try {
      final metrics = await _apiService.getMetrics(requisitionId);
      state = state.copyWith(metrics: metrics);
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }

  Future<void> uploadAnalyze({
    required List<int> fileBytes,
    required String fileName,
  }) async {
    state = state.copyWith(isLoading: true, clearError: true);

    try {
      await _apiService.uploadAnalyze(
        reqId: requisitionId,
        fileBytes: fileBytes,
        fileName: fileName,
      );
      await loadCandidates();
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  void toggleSelection(int index) {
    final newIndices = Set<int>.from(state.selectedIndices);
    if (newIndices.contains(index)) {
      newIndices.remove(index);
    } else {
      newIndices.add(index);
    }
    state = state.copyWith(selectedIndices: newIndices);
  }

  void selectAll(bool selected) {
    if (selected) {
      state = state.copyWith(
        selectedIndices: Set<int>.from(
          List.generate(state.candidates.length, (i) => i),
        ),
      );
    } else {
      state = state.copyWith(selectedIndices: {});
    }
  }

  void setFilters({String? minMatch, String? status}) {
    state = state.copyWith(
      minMatchFilter: minMatch ?? state.minMatchFilter,
      statusFilter: status ?? state.statusFilter,
      currentPage: 1, // Reset to first page
    );
  }

  void setPage(int page) {
    state = state.copyWith(currentPage: page);
  }

  Future<void> updateCandidate({
    required int candidateId,
    String? notes,
    String? status,
  }) async {
    try {
      await _apiService.updateCandidate(
        candidateId: candidateId,
        notes: notes,
        status: status,
      );
      await loadCandidates();
    } catch (e) {
      state = state.copyWith(error: e.toString());
    }
  }
}

/// Finder List Provider
final finderListProvider =
    StateNotifierProvider<FinderListNotifier, FinderListState>((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return FinderListNotifier(apiService);
});

/// Finder Detail Provider Factory
final finderDetailProvider =
    StateNotifierProvider.family<FinderDetailNotifier, FinderDetailState, int>(
  (ref, requisitionId) {
    final apiService = ref.watch(apiServiceProvider);
    return FinderDetailNotifier(apiService, requisitionId);
  },
);

