import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:file_picker/file_picker.dart';
import 'package:resume_ai_flutter/src/shared/widgets/glass_card.dart';
import 'package:resume_ai_flutter/src/shared/widgets/scroll_animation.dart';
import 'package:resume_ai_flutter/src/shared/widgets/floating_elements.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';
import 'package:resume_ai_flutter/src/features/score_checker/widgets/donut_chart.dart';
import 'package:resume_ai_flutter/src/features/score_checker/widgets/emoji_3d.dart';
import 'package:resume_ai_flutter/src/features/score_checker/widgets/holographic_card.dart';
import 'package:resume_ai_flutter/src/features/score_checker/providers/score_checker_provider.dart';

class ScoreCheckerScreen extends ConsumerStatefulWidget {
  const ScoreCheckerScreen({super.key});

  @override
  ConsumerState<ScoreCheckerScreen> createState() => _ScoreCheckerScreenState();
}

class _ScoreCheckerScreenState extends ConsumerState<ScoreCheckerScreen> {
  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'doc', 'docx'],
    );

    if (result != null && result.files.single.path != null) {
      final file = File(result.files.single.path!);
      final bytes = await file.readAsBytes();
      ref.read(scoreCheckerProvider.notifier).setFile(
        fileName: result.files.single.name,
        fileBytes: bytes,
      );
    }
  }

  Future<void> _checkScore() async {
    await ref.read(scoreCheckerProvider.notifier).analyze();
  }

  void _resetScore() {
    ref.read(scoreCheckerProvider.notifier).clear();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(scoreCheckerProvider);
    
    // Show error snackbar if error exists
    if (state.error != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(state.error!),
            backgroundColor: AppTheme.danger,
          ),
        );
      });
    }

    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      body: Stack(
        children: [
          // Floating background elements
          const FloatingElements(),
          
          // Main content
          SingleChildScrollView(
            child: Column(
              children: [
                // Breadcrumb Navigation
                ScrollAnimation(
                  delay: const Duration(milliseconds: 0),
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 20,
                    ),
                    child: Row(
                      children: [
                        GestureDetector(
                          onTap: () => Navigator.pop(context),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.home,
                                size: 16,
                                color: AppTheme.textMuted,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                'Home',
                                style: AppTheme.bodySmall.copyWith(
                                  color: AppTheme.textMuted,
                                  decoration: TextDecoration.none,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          '/',
                          style: TextStyle(
                            color: AppTheme.textMuted,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Text(
                          'Score Checker',
                          style: TextStyle(
                            color: AppTheme.textMuted,
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Upload Section
                ScrollAnimation(
                  delay: const Duration(milliseconds: 100),
                  child: Container(
                    constraints: const BoxConstraints(maxWidth: 860),
                    margin: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      children: [
                        // Heading
                        const Text(
                          'Upload and score your resume',
                          style: AppTheme.display2,
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Our AI analyzes your resume for overall quality, ATS readiness, keyword coverage, readability, and structure—then gives clear, actionable tips.',
                          style: AppTheme.lead.copyWith(
                            color: AppTheme.textMuted,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 32),

                        // Upload Card
                        GlassCard(
                          padding: const EdgeInsets.all(12),
                          borderRadius: 16,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              // Header with badge
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                children: [
                                  const Text(
                                    'Upload resume',
                                    style: AppTheme.heading3,
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppTheme.brandSecondary
                                          .withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Text(
                                      'AI powered',
                                      style: AppTheme.bodySmall.copyWith(
                                        color: AppTheme.brandSecondary,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),

                              // Dropzone
                              GestureDetector(
                                onTap: _pickFile,
                                child: Container(
                                  padding: const EdgeInsets.all(16),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.06),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.25),
                                      style: BorderStyle.solid,
                                      width: 2,
                                    ),
                                  ),
                          child: Column(
                            children: [
                              const Icon(
                                Icons.cloud_upload,
                                size: 28,
                                color: Color(0xFF9ec5fe),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                state.selectedFileName == null
                                    ? 'Drag & drop your resume here or browse'
                                    : state.selectedFileName!,
                                style: AppTheme.body.copyWith(
                                  color: AppTheme.textPrimary,
                                ),
                                textAlign: TextAlign.center,
                              ),
                              const SizedBox(height: 8),
                              Text(
                                'PDF or DOCX · Max ~10 MB',
                                style: AppTheme.bodySmall,
                              ),
                            ],
                          ),
                        ),
                      ),

                      // File list
                      if (state.selectedFileName != null) ...[
                                const SizedBox(height: 16),
                                Container(
                                  padding: const EdgeInsets.all(8),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.06),
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.12),
                                    ),
                                  ),
                                  child: Row(
                                    children: [
                                      const Icon(
                                        Icons.insert_drive_file,
                                        color: AppTheme.textPrimary,
                                        size: 20,
                                      ),
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: Text(
                                          state.selectedFileName!,
                                          style: AppTheme.bodySmall.copyWith(
                                            color: AppTheme.textPrimary,
                                          ),
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(
                                          Icons.close,
                                          color: Color(0xFFfca5a5),
                                          size: 20,
                                        ),
                                        onPressed: () {
                                          ref.read(scoreCheckerProvider.notifier).clear();
                                        },
                                      ),
                                    ],
                                  ),
                                ),
                              ],

                              const SizedBox(height: 24),

                              // Check Score Button
                              SizedBox(
                                width: double.infinity,
                                child: ElevatedButton(
                                  onPressed: state.selectedFileName == null || state.isLoading
                                      ? null
                                      : _checkScore,
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppTheme.brandPrimary,
                                    foregroundColor: Colors.white,
                                    padding: const EdgeInsets.symmetric(
                                      vertical: 16,
                                    ),
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    disabledBackgroundColor:
                                        Colors.grey.withOpacity(0.3),
                                  ),
                                  child: state.isLoading
                                      ? const SizedBox(
                                          height: 20,
                                          width: 20,
                                          child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            valueColor:
                                                AlwaysStoppedAnimation<Color>(
                                              Colors.white,
                                            ),
                                          ),
                                        )
                                      : const Text(
                                          'Check score',
                                          style: TextStyle(
                                            fontSize: 18,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Results Section
                if (state.result != null) ...[
                  const SizedBox(height: 40),
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 200),
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 860),
                      margin: const EdgeInsets.symmetric(horizontal: 24),
                      child: GlassCard(
                        padding: const EdgeInsets.all(24),
                        child: Column(
                          children: [
                            Text(
                              state.result!,
                              style: AppTheme.heading3.copyWith(
                                color: AppTheme.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: _resetScore,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.brandPrimary,
                                foregroundColor: Colors.white,
                              ),
                              child: const Text('Reset'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],

                // AI Context Block
                const SizedBox(height: 80),
                ScrollAnimation(
                  delay: const Duration(milliseconds: 300),
                  child: _AIContextBlock(),
                ),

                const SizedBox(height: 80),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _ResultsSection extends StatelessWidget {
  final Map<String, dynamic> results;
  final VoidCallback onReset;

  const _ResultsSection({
    required this.results,
    required this.onReset,
  });

  Color _getRingColor(int total) {
    if (total >= 80) return AppTheme.brandSecondary;
    if (total >= 65) return AppTheme.warning;
    return AppTheme.danger;
  }

  Map<String, dynamic> _getVerdict(int total) {
    if (total >= 85) {
      return {
        'emoji': '😄',
        'text': 'Excellent fit — ready to apply!',
        'color1': AppTheme.brandSecondary,
        'color2': AppTheme.brandPrimary,
      };
    } else if (total >= 75) {
      return {
        'emoji': '🙂',
        'text': 'Good — a few quick improvements recommended.',
        'color1': AppTheme.brandSecondary,
        'color2': AppTheme.brandPrimary,
      };
    } else if (total >= 60) {
      return {
        'emoji': '😕',
        'text': 'Fair — add metrics and keywords to boost.',
        'color1': AppTheme.danger,
        'color2': const Color(0xFFb91c1c),
      };
    } else {
      return {
        'emoji': '😬',
        'text': 'Needs work — fix ATS issues and add impact.',
        'color1': AppTheme.danger,
        'color2': const Color(0xFFb91c1c),
      };
    }
  }

  @override
  Widget build(BuildContext context) {
    final total = results['total'] as int;
    final ats = results['ats'] as int;
    final match = results['match'] as int;
    final skills = results['skills'] as int;
    final read = results['read'] as int;
    final struct = results['struct'] as int;
    final present = (results['present'] as String).split(';').where((s) => s.isNotEmpty).toList();
    final missing = (results['missing'] as String).split(';').where((s) => s.isNotEmpty).toList();

    final verdict = _getVerdict(total);
    final ringColor = _getRingColor(total);

    return GlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Toolbar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Results',
                style: AppTheme.heading1,
              ),
              TextButton.icon(
                onPressed: onReset,
                icon: const Icon(
                  Icons.refresh,
                  color: AppTheme.textPrimary,
                  size: 18,
                ),
                label: const Text(
                  'New score',
                  style: TextStyle(color: AppTheme.textPrimary),
                ),
                style: TextButton.styleFrom(
                  backgroundColor: Colors.transparent,
                ),
              ),
            ],
          ),
          Divider(
            color: AppTheme.borderColor,
            height: 32,
          ),

          // Results Content
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Left: Donut + Verdict
              Expanded(
                flex: 5,
                child: Column(
                  children: [
                    DonutChart(
                      value: total,
                      ringColor: ringColor,
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Emoji3D(
                          emoji: verdict['emoji'] as String,
                          color1: verdict['color1'] as Color,
                          color2: verdict['color2'] as Color,
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            verdict['text'] as String,
                            style: AppTheme.body.copyWith(
                              color: AppTheme.textPrimary,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              const SizedBox(width: 32),

              // Right: Subscores + Keywords
              Expanded(
                flex: 7,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Subscores',
                      style: AppTheme.heading2,
                    ),
                    const SizedBox(height: 16),
                    _SubscoreBar(label: 'ATS readiness', value: ats),
                    const SizedBox(height: 10),
                    _SubscoreBar(label: 'Match', value: match),
                    const SizedBox(height: 10),
                    _SubscoreBar(label: 'Skills', value: skills),
                    const SizedBox(height: 10),
                    _SubscoreBar(label: 'Readability', value: read),
                    const SizedBox(height: 10),
                    _SubscoreBar(label: 'Structure', value: struct),

                    const SizedBox(height: 24),

                    // Keywords
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Keywords present',
                                style: AppTheme.heading3,
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: present
                                    .map((k) => Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 6,
                                          ),
                                          decoration: BoxDecoration(
                                            color: AppTheme.brandSecondary
                                                .withOpacity(0.2),
                                            borderRadius:
                                                BorderRadius.circular(16),
                                            border: Border.all(
                                              color: AppTheme.brandSecondary,
                                            ),
                                          ),
                                          child: Text(
                                            k,
                                            style: AppTheme.bodySmall.copyWith(
                                              color: AppTheme.brandSecondary,
                                            ),
                                          ),
                                        ))
                                    .toList(),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Keywords missing',
                                style: AppTheme.heading3,
                              ),
                              const SizedBox(height: 8),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: missing
                                    .map((k) => Container(
                                          padding: const EdgeInsets.symmetric(
                                            horizontal: 12,
                                            vertical: 6,
                                          ),
                                          decoration: BoxDecoration(
                                            color: AppTheme.danger
                                                .withOpacity(0.2),
                                            borderRadius:
                                                BorderRadius.circular(16),
                                            border: Border.all(
                                              color: AppTheme.danger,
                                            ),
                                          ),
                                          child: Text(
                                            k,
                                            style: AppTheme.bodySmall.copyWith(
                                              color: AppTheme.danger,
                                            ),
                                          ),
                                        ))
                                    .toList(),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Insights
                    _InsightsList(total: total, match: match, read: read),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _SubscoreBar extends StatefulWidget {
  final String label;
  final int value;

  const _SubscoreBar({required this.label, required this.value});

  @override
  State<_SubscoreBar> createState() => _SubscoreBarState();
}

class _SubscoreBarState extends State<_SubscoreBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 900),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0.0, end: widget.value / 100.0)
        .animate(CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    ));
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Color _getColor(int value) {
    if (value >= 80) return AppTheme.brandSecondary;
    if (value >= 65) return AppTheme.warning;
    return AppTheme.danger;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              widget.label,
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.textPrimary,
                fontSize: 15.2, // 0.95rem
              ),
            ),
            Text(
              '${widget.value}',
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.textPrimary,
                fontSize: 15.2,
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            return ClipRRect(
              borderRadius: BorderRadius.circular(999),
              child: Container(
                height: 10,
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: FractionallySizedBox(
                  widthFactor: _animation.value,
                  alignment: Alignment.centerLeft,
                  child: Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          AppTheme.accentPrimary,
                          AppTheme.brandSecondary,
                        ],
                      ),
                      borderRadius: BorderRadius.circular(999),
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}

class _InsightsList extends StatelessWidget {
  final int total;
  final int match;
  final int read;

  const _InsightsList({
    required this.total,
    required this.match,
    required this.read,
  });

  @override
  Widget build(BuildContext context) {
    final insights = <String>[];
    if (total >= 80) {
      insights.add('🔥 Strong overall — highlight impact with quantified results.');
    } else if (total >= 65) {
      insights.add('📝 Add 2–3 measurable wins in your latest role.');
    } else {
      insights.add('🔧 Fix ATS issues: clear headings, consistent bullets, simple fonts.');
    }

    if (match >= 75) {
      insights.add('✅ Good match to role keywords.');
    } else {
      insights.add('🔎 Add missing must‑haves shown at right.');
    }

    if (read >= 75) {
      insights.add('🟢 Readability is good.');
    } else {
      insights.add('✂️ Shorten long sentences; use action verbs.');
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: insights
          .map((insight) => Padding(
                padding: const EdgeInsets.only(bottom: 8),
                child: Text(
                  insight,
                  style: AppTheme.bodySmall.copyWith(
                    color: AppTheme.textMuted,
                  ),
                ),
              ))
          .toList(),
    );
  }
}

class _AIContextBlock extends StatelessWidget {
  const _AIContextBlock();

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 1200),
      margin: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          // Header
          ScrollAnimation(
            delay: const Duration(milliseconds: 0),
            child: Column(
              children: [
                // Emoji pill
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(12),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [
                        AppTheme.accentPrimary,
                        AppTheme.brandSecondary,
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.accentPrimary.withOpacity(0.35),
                        blurRadius: 26,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Text(
                      '🤖',
                      style: TextStyle(fontSize: 24),
                    ),
                  ),
                ),
                const SizedBox(height: 14),
                // Neon title
                ShaderMask(
                  shaderCallback: (bounds) => const LinearGradient(
                    colors: [Color(0xFFe9e4ff), Color(0xFFc4f7e2)],
                  ).createShader(bounds),
                  child: const Text(
                    'Powered by AI',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: 0.2,
                    ),
                  ),
                ),
                const SizedBox(height: 10),
                Text(
                  'A smart pipeline that reads, understands, and improves your resume.',
                  style: AppTheme.bodyLarge.copyWith(
                    color: AppTheme.textMuted,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                // Scan line
                Container(
                  height: 8,
                  constraints: const BoxConstraints(maxWidth: 560),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.10),
                    borderRadius: BorderRadius.circular(999),
                    border: Border.all(
                      color: Colors.white.withOpacity(0.08),
                      width: 1,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Holographic Cards Grid
          LayoutBuilder(
            builder: (context, constraints) {
              final isMobile = constraints.maxWidth < 992;
              return GridView.count(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                crossAxisCount: isMobile ? 1 : 2,
                crossAxisSpacing: 24,
                mainAxisSpacing: 24,
                childAspectRatio: isMobile ? 1.2 : 1.0,
                children: [
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 0),
                    child: _HoloCard(
                      emoji: '✨',
                      title: 'What we do',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _HoloListItem(
                            'Parse and standardize sections (experience, skills, education, summary).',
                          ),
                          _HoloListItem(
                            'Detect ATS blockers (headings, bullet consistency, parsable text, fonts).',
                          ),
                          _HoloListItem(
                            'Check keyword coverage vs. role expectations and real job posts.',
                          ),
                          _HoloListItem(
                            'Estimate clarity and signal density (action verbs + metrics).',
                          ),
                          _HoloListItem(
                            'Prioritize quick wins with step‑by‑step tips.',
                          ),
                        ],
                      ),
                    ),
                  ),
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 70),
                    child: _HoloCard(
                      emoji: '🧠',
                      title: 'How it works',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _HoloStepItem(
                            '1',
                            'Parse & extract:',
                            'Read your PDF/DOCX and normalize content.',
                          ),
                          _HoloStepItem(
                            '2',
                            'Score:',
                            'Compute subscores — ATS, Match, Skills, Readability, Structure.',
                          ),
                          _HoloStepItem(
                            '3',
                            'Find gaps:',
                            'Spot missing must‑haves and weak bullets.',
                          ),
                          _HoloStepItem(
                            '4',
                            'Guide:',
                            'Give tailored suggestions; export a clean report.',
                          ),
                        ],
                      ),
                    ),
                  ),
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 0),
                    child: _HoloCard(
                      emoji: '🚀',
                      title: 'Why it\'s useful',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _HoloListItem(
                            'Beat automated screens: avoid silent ATS rejections.',
                          ),
                          _HoloListItem(
                            'Tailor faster: add the right keywords without guesswork.',
                          ),
                          _HoloListItem(
                            'Show impact: rewrite bullets with measurable results.',
                          ),
                          _HoloListItem(
                            'Iterate quickly: measure changes with subscores + total score.',
                          ),
                          _HoloListItem(
                            'Pro tip: Keep resume to 1 page (early career) or 2 pages (10+ yrs) with strong recent impact.',
                            isItalic: true,
                          ),
                        ],
                      ),
                    ),
                  ),
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 70),
                    child: _HoloCard(
                      emoji: '📊',
                      title: 'How we score',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Your total is a weighted blend of five subscores (0–100 each):',
                            style: AppTheme.bodySmall.copyWith(
                              color: AppTheme.textMuted,
                            ),
                          ),
                          const SizedBox(height: 8),
                          _HoloListItem('ATS readiness (25%) — headings, formatting, parsability.'),
                          _HoloListItem('Match (25%) — alignment to role keywords.'),
                          _HoloListItem('Skills (20%) — coverage of must‑haves.'),
                          _HoloListItem('Readability (15%) — clarity, concision, tone.'),
                          _HoloListItem('Structure (15%) — bullet quality, tense consistency, layout.'),
                          const SizedBox(height: 12),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.45),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(
                                color: Colors.white.withOpacity(0.08),
                              ),
                            ),
                            child: Text(
                              'Total = 0.25×ATS + 0.25×Match + 0.20×Skills + 0.15×Readability + 0.15×Structure',
                              style: AppTheme.bodySmall.copyWith(
                                fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
                                color: AppTheme.textPrimary,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            },
          ),

          const SizedBox(height: 24),

          // How to improve (full width)
          ScrollAnimation(
            delay: const Duration(milliseconds: 140),
            child: _HoloCard(
              emoji: '✍️',
              title: 'How to improve',
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _HoloListItem(
                          'Show impact: Use "Action + task + metric" (e.g., "Increased activation by 18% …").',
                        ),
                        _HoloListItem(
                          'Fix ATS blockers: Clear headings, consistent bullets, no images‑of‑text, standard fonts.',
                        ),
                        _HoloListItem(
                          'Add must‑haves: Cover missing keywords in Skills and in relevant bullets.',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 24),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _HoloListItem(
                          'Tighten writing: Short sentences, active verbs, remove filler/buzzwords.',
                        ),
                        _HoloListItem(
                          'Prioritize recency: Add most detail to the latest role (4–6 bullets).',
                        ),
                        _HoloListItem(
                          'Re‑score: Tailor per job; re‑check after edits.',
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Privacy card (subtle)
          ScrollAnimation(
            delay: const Duration(milliseconds: 210),
            child: HolographicCard(
              subtle: true,
              child: Row(
                children: [
                  const Text(
                    '🔒',
                    style: TextStyle(fontSize: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'Privacy & Security',
                      style: AppTheme.heading3,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          ScrollAnimation(
            delay: const Duration(milliseconds: 280),
            child: Padding(
              padding: const EdgeInsets.only(left: 44),
              child: Text(
                'Uploads are encrypted in transit. You control retention (auto‑delete option). We never sell personal data.',
                style: AppTheme.bodySmall.copyWith(
                  color: AppTheme.textMuted,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HoloCard extends StatelessWidget {
  final String emoji;
  final String title;
  final Widget child;

  const _HoloCard({
    required this.emoji,
    required this.title,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return HolographicCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                emoji,
                style: const TextStyle(fontSize: 20),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: AppTheme.heading3,
              ),
            ],
          ),
          const SizedBox(height: 14),
          child,
        ],
      ),
    );
  }
}

class _HoloListItem extends StatelessWidget {
  final String text;
  final bool isItalic;

  const _HoloListItem(this.text, {this.isItalic = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 4),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('•', style: TextStyle(color: AppTheme.textPrimary)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.textPrimary,
                fontStyle: isItalic ? FontStyle.italic : FontStyle.normal,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HoloStepItem extends StatelessWidget {
  final String number;
  final String title;
  final String description;

  const _HoloStepItem(this.number, this.title, this.description);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$number.',
            style: AppTheme.bodySmall.copyWith(
              color: AppTheme.textPrimary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: AppTheme.bodySmall.copyWith(
                  color: AppTheme.textPrimary,
                ),
                children: [
                  TextSpan(
                    text: '$title ',
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                  TextSpan(text: description),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
