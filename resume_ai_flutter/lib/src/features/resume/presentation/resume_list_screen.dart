import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:resume_ai_flutter/src/features/auth/data/auth_repository.dart';
import 'package:resume_ai_flutter/src/features/resume/data/resume_repository.dart';
import 'package:resume_ai_flutter/src/features/resume/domain/resume_model.dart';
import 'package:intl/intl.dart';

class ResumeListScreen extends ConsumerWidget {
  const ResumeListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final resumesAsync = ref.watch(myResumesProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Resumes'),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => ref.read(authRepositoryProvider).signOut(),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () async {
          // Trigger file picker and upload
          final repo = ref.read(resumeRepositoryProvider);
          try {
            final file = await repo.pickResume();
            if (file != null) {
              if (context.mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Uploading resume...')),
                );
              }
              await repo.uploadResume(file);
              // No need to refresh, Firestore stream updates automatically
            }
          } catch (e) {
            if (context.mounted) {
              ScaffoldMessenger.of(
                context,
              ).showSnackBar(SnackBar(content: Text('Upload failed: $e')));
            }
          }
        },
        icon: const Icon(Icons.upload_file),
        label: const Text('Upload Resume'),
      ),
      body: resumesAsync.when(
        data: (resumes) {
          if (resumes.isEmpty) {
            return const Center(child: Text("No resumes yet. Upload one!"));
          }
          return ListView.builder(
            itemCount: resumes.length,
            itemBuilder: (context, index) {
              final resume = resumes[index];
              return ResumeListTile(resume: resume);
            },
          );
        },
        loading: () => Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class ResumeListTile extends StatelessWidget {
  final ResumeModel resume;

  const ResumeListTile({super.key, required this.resume});

  Color _getStatusColor(String status) {
    switch (status) {
      case 'analyzed':
        return Colors.green;
      case 'processing':
        return Colors.orange;
      case 'error':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }

  @override
  Widget build(BuildContext context) {
    final dateFormat = DateFormat.yMMMd().add_jm();

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundColor: _getStatusColor(resume.status).withAlpha(50),
          child: Icon(Icons.description, color: _getStatusColor(resume.status)),
        ),
        title: Text(
          resume.fileName,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Status: ${resume.status.toUpperCase()}'),
            Text(
              dateFormat.format(resume.createdAt),
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ],
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {
          // TODO: Navigate to detail view
        },
      ),
    );
  }
}
