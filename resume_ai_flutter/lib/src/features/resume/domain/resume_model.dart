import 'package:freezed_annotation/freezed_annotation.dart';

part 'resume_model.freezed.dart';
part 'resume_model.g.dart';

@freezed
abstract class ResumeModel with _$ResumeModel {
  const ResumeModel._(); // 🔥 THIS LINE WAS MISSING

  const factory ResumeModel({
    required String id,
    required String userId,
    required String fileUrl,
    required String storagePath,
    required String fileName,
    required String status,
    required Map<String, dynamic> metadata,
    required DateTime createdAt,
    String? extractedText,
    Map<String, dynamic>? analysis,
  }) = _ResumeModel;

  factory ResumeModel.fromJson(Map<String, dynamic> json) =>
      _$ResumeModelFromJson(json);
}
