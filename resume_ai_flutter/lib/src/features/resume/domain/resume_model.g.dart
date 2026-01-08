// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'resume_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ResumeModel _$ResumeModelFromJson(Map<String, dynamic> json) => _ResumeModel(
  id: json['id'] as String,
  userId: json['userId'] as String,
  fileUrl: json['fileUrl'] as String,
  storagePath: json['storagePath'] as String,
  fileName: json['fileName'] as String,
  status: json['status'] as String,
  metadata: json['metadata'] as Map<String, dynamic>,
  createdAt: DateTime.parse(json['createdAt'] as String),
  extractedText: json['extractedText'] as String?,
  analysis: json['analysis'] as Map<String, dynamic>?,
);

Map<String, dynamic> _$ResumeModelToJson(_ResumeModel instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'fileUrl': instance.fileUrl,
      'storagePath': instance.storagePath,
      'fileName': instance.fileName,
      'status': instance.status,
      'metadata': instance.metadata,
      'createdAt': instance.createdAt.toIso8601String(),
      'extractedText': instance.extractedText,
      'analysis': instance.analysis,
    };
