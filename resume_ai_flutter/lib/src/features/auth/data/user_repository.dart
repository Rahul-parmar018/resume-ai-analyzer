import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:resume_ai_flutter/src/features/auth/domain/user_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

// part 'user_repository.g.dart';

class UserRepository {
  final FirebaseFirestore _firestore;

  UserRepository(this._firestore);

  Future<void> ensureUserExists(String uid, String email) async {
    final userRef = _firestore.collection('users').doc(uid);
    final snapshot = await userRef.get();

    if (!snapshot.exists) {
      final now = DateTime.now();
      final user = UserModel(
        uid: uid,
        email: email,
        credits: 5, // Free starting credits
        createdAt: now,
        lastLogin: now,
      );
      await userRef.set(user.toJson());
    } else {
      // Update last login
      await userRef.update({'lastLogin': DateTime.now().toIso8601String()});
    }
  }

  Stream<UserModel?> watchUser(String uid) {
    return _firestore.collection('users').doc(uid).snapshots().map((snapshot) {
      if (snapshot.exists && snapshot.data() != null) {
        return UserModel.fromJson(snapshot.data()!);
      }
      return null;
    });
  }
}

final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepository(FirebaseFirestore.instance);
});
