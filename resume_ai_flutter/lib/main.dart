import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai_flutter/src/features/auth/data/auth_repository.dart';
import 'package:resume_ai_flutter/src/features/auth/presentation/auth_screen.dart';
import 'package:resume_ai_flutter/firebase_options.dart';
import 'package:resume_ai_flutter/src/features/auth/data/user_repository.dart';
import 'package:resume_ai_flutter/src/features/home/presentation/home_screen.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // TODO: Run `flutterfire configure` to generate firebase_options.dart
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const ProviderScope(child: MyApp()));
}

class MyApp extends ConsumerWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authStateChangesProvider);

    // Listen to auth changes to sync user data to Firestore
    ref.listen(authStateChangesProvider, (previous, next) {
      next.whenData((user) {
        if (user != null) {
          ref
              .read(userRepositoryProvider)
              .ensureUserExists(user.uid, user.email ?? 'anonymous@resume.ai');
        }
      });
    });

    return MaterialApp(
      title: 'Resume AI Analyzer',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: authState.when(
        data: (user) => const HomeScreen(),
        loading: () =>
            const Scaffold(body: Center(child: CircularProgressIndicator())),
        error: (e, st) => Scaffold(body: Center(child: Text('Error: $e'))),
      ),
    );
  }
}
