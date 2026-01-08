import 'dart:typed_data';

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:file_picker/file_picker.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai_flutter/src/features/auth/data/auth_repository.dart';
import 'package:resume_ai_flutter/src/features/resume/domain/resume_model.dart';
import 'package:uuid/uuid.dart';

class ResumeRepository {
  final FirebaseFirestore _firestore;
  final FirebaseStorage _storage;
  final Ref _ref;

  ResumeRepository(this._firestore, this._storage, this._ref);

  /// Helper to pick a single file (PDF or DOCX)
  Future<PlatformFile?> pickResume() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'docx', 'doc'],
      withData:
          true, // Needed for Web, and now for Mobile too (for consistency)
    );
    return result?.files.single;
  }

  /// Uploads file to Storage and creates Firestore document
  Future<void> uploadResume(PlatformFile file) async {
    final user = _ref.read(authRepositoryProvider).currentUser;
    if (user == null) throw Exception("User must be logged in to upload");

    final uuid = const Uuid().v4();
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final fileName = file.name;
    final storagePath = 'resumes/${user.uid}/${timestamp}_$fileName';

    // 1. Upload to Storage
    final ref = _storage.ref().child(storagePath);

    // We rely on file.bytes being present (assured by withData: true)
    // This avoids using dart:io File class, which crashes Web builds
    if (file.bytes == null) {
      throw Exception("File data is empty. Please try again.");
    }

    final task = ref.putData(
      file.bytes!,
      SettableMetadata(contentType: 'application/pdf'),
    );

    final snapshot = await task;
    final downloadUrl = await snapshot.ref.getDownloadURL();

    // 2. Create Firestore Document
    final resume = ResumeModel(
      id: uuid,
      userId: user.uid,
      fileUrl: downloadUrl,
      storagePath: storagePath,
      fileName: fileName,
      status: 'processing',
      metadata: {'size': file.size, 'extension': file.extension},
      createdAt: DateTime.now(),
    );

    await _firestore.collection('resumes').doc(uuid).set(resume.toJson());
  }

  /// Watch user's resumes ordered by date
  Stream<List<ResumeModel>> watchMyResumes() {
    final user = _ref.read(authRepositoryProvider).currentUser;
    if (user == null) return Stream.value([]);

    return _firestore
        .collection('resumes')
        .where('userId', isEqualTo: user.uid)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map(
          (snapshot) => snapshot.docs
              .map((doc) => ResumeModel.fromJson(doc.data()))
              .toList(),
        );
  }
}

final resumeRepositoryProvider = Provider<ResumeRepository>((ref) {
  return ResumeRepository(
    FirebaseFirestore.instance,
    FirebaseStorage.instance,
    ref,
  );
});

final myResumesProvider = StreamProvider<List<ResumeModel>>((ref) {
  return ref.watch(resumeRepositoryProvider).watchMyResumes();
});
