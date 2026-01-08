import 'package:flutter/material.dart';
import 'package:file_picker/file_picker.dart';
import 'package:resume_ai_flutter/src/shared/widgets/glass_card.dart';
import 'package:resume_ai_flutter/src/shared/widgets/card_3d.dart';
import 'package:resume_ai_flutter/src/shared/widgets/scroll_animation.dart';
import 'package:resume_ai_flutter/src/shared/widgets/floating_elements.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';
import 'package:resume_ai_flutter/src/features/review/widgets/flip_card.dart';
import 'package:resume_ai_flutter/src/features/review/widgets/section_stepper.dart';
import 'package:resume_ai_flutter/src/features/review/widgets/quest_list.dart';

class ReviewResumeScreen extends StatefulWidget {
  const ReviewResumeScreen({super.key});

  @override
  State<ReviewResumeScreen> createState() => _ReviewResumeScreenState();
}

class _ReviewResumeScreenState extends State<ReviewResumeScreen> {
  String? _selectedFile;
  bool _isLoading = false;
  Map<String, dynamic>? _results;

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf', 'docx'],
    );

    if (result != null && result.files.single.name.isNotEmpty) {
      setState(() {
        _selectedFile = result.files.single.name;
      });
    }
  }

  Future<void> _reviewResume() async {
    if (_selectedFile == null) return;

    setState(() {
      _isLoading = true;
    });

    // TODO: Implement API call to review resume
    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      _isLoading = false;
      _results = {
        'health': 75,
        'healthLabel': 'Good',
        'healthEmoji': '🙂',
        'summary': 'Your resume is in good shape with a few improvements needed.',
        'readability': 72,
        'readabilityLabel': 'Good',
        'mistakes': [
          {
            'type': 'Vague bullet',
            'description': 'Add measurable results',
            'fixWhy': 'Why: Metrics show impact',
            'fixHow': 'How: Add numbers like "Increased sales by 25%"',
          },
          {
            'type': 'Grammar',
            'description': 'Fix tense consistency',
            'fixWhy': 'Why: Consistent tense improves readability',
            'fixHow': 'How: Use past tense for past roles, present for current',
          },
        ],
        'checklist': [
          'Contact information is present',
          'Experience section has 4+ bullets per role',
          'Skills section is well-organized',
          'Education section includes dates',
        ],
        'sections': [
          SectionItem(name: 'Contact', status: 'ok'),
          SectionItem(name: 'Experience', status: 'ok'),
          SectionItem(name: 'Skills', status: 'ok'),
          SectionItem(name: 'Education', status: 'ok'),
          SectionItem(name: 'Summary', status: 'weak'),
        ],
        'fixFirst': [
          QuestItem(text: 'Add metrics to 3 experience bullets'),
          QuestItem(text: 'Fix tense consistency in Experience section'),
          QuestItem(text: 'Add a professional summary'),
        ],
        'suggestions': [
          'Use action verbs at the start of each bullet',
          'Quantify achievements with numbers',
          'Keep bullets to one line when possible',
        ],
        'atsParse': '''CONTACT
John Doe
Email: john@example.com
Phone: (555) 123-4567

EXPERIENCE
Software Engineer | Tech Corp | 2020-Present
• Developed web applications using React
• Collaborated with cross-functional teams

SKILLS
JavaScript, React, Node.js, Python

EDUCATION
BS Computer Science | University | 2020''',
        'nextSteps': [
          'Review the mistakes and fixes above',
          'Update your resume with the suggested improvements',
          'Re-upload to see your progress',
        ],
      };
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.bgPrimary,
      body: Stack(
        children: [
          // Floating background elements
          const FloatingElements(),

          // Main content
          SingleChildScrollView(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
              child: Column(
                children: [
                  // Two-column layout: Video + Form
                  LayoutBuilder(
                    builder: (context, constraints) {
                      final isMobile = constraints.maxWidth < 992;
                      if (isMobile) {
                        return Column(
                          children: [
                            _VideoSection(),
                            const SizedBox(height: 40),
                            _FormSection(
                              selectedFile: _selectedFile,
                              isLoading: _isLoading,
                              onPickFile: _pickFile,
                              onReview: _reviewResume,
                            ),
                          ],
                        );
                      }
                      return Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            child: _VideoSection(),
                          ),
                          const SizedBox(width: 40),
                          Expanded(
                            child: _FormSection(
                              selectedFile: _selectedFile,
                              isLoading: _isLoading,
                              onPickFile: _pickFile,
                              onReview: _reviewResume,
                            ),
                          ),
                        ],
                      );
                    },
                  ),

                  const SizedBox(height: 40),

                  // Info Cards
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 0),
                    child: _InfoCard(
                      icon: Icons.search,
                      title: 'What we check',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _InfoListItem(
                            'Presence and clarity of all key sections: Contact, Experience, Skills, Education, Summary',
                            isBold: true,
                          ),
                          _InfoListItem(
                            'ATS blockers: images, tables, non-standard fonts, headers/footers, graphics',
                          ),
                          _InfoListItem(
                            'Passive voice, weak verbs, missing metrics, first-person pronouns',
                          ),
                          _InfoListItem(
                            'Formatting: bullet consistency, section order, length, whitespace',
                          ),
                          _InfoListItem(
                            'File type, text extraction quality, and parse errors',
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  ScrollAnimation(
                    delay: const Duration(milliseconds: 120),
                    child: _InfoCard(
                      icon: Icons.lightbulb,
                      title: 'How it works',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _InfoStepItem(
                            '1',
                            'AI parses your file',
                            'and extracts all text, even from PDFs and DOCX.',
                          ),
                          _InfoStepItem(
                            '2',
                            'Detects missing or weak sections',
                            'and bullets, and flags ATS blockers.',
                          ),
                          _InfoStepItem(
                            '3',
                            'Analyzes readability',
                            '(Flesch score, sentence length, jargon, filler).',
                          ),
                          _InfoStepItem(
                            '4',
                            'Suggests prioritized fixes',
                            'and section-by-section improvements.',
                          ),
                          _InfoStepItem(
                            '5',
                            'Shows a "fix this first" list',
                            'for the fastest impact.',
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  ScrollAnimation(
                    delay: const Duration(milliseconds: 240),
                    child: _InfoCard(
                      icon: Icons.shield,
                      title: 'Why use it?',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _InfoListItem(
                            'Spot ATS blockers before you apply—avoid silent rejections.',
                            isBold: true,
                          ),
                          _InfoListItem(
                            'Get actionable, section-by-section feedback (not just a score).',
                            isBold: true,
                          ),
                          _InfoListItem(
                            'Improve clarity and impact in minutes with AI-powered suggestions.',
                          ),
                          _InfoListItem(
                            'See a prioritized "fix first" list for quick wins.',
                          ),
                          _InfoListItem(
                            'Re-upload to see improvements and track progress.',
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 32),

                  ScrollAnimation(
                    delay: const Duration(milliseconds: 360),
                    child: _InfoCard(
                      icon: Icons.star,
                      title: 'What you get',
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _InfoListItem(
                            'Health checklist and mistake list (with explanations)',
                          ),
                          _InfoListItem(
                            'Readability meter and section-by-section review',
                          ),
                          _InfoListItem(
                            'Prioritized "fix this first" list for fastest improvement',
                          ),
                          _InfoListItem(
                            'AI-powered suggestions, not just scores',
                          ),
                          _InfoListItem(
                            'All feedback is private—no data is stored after review',
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Results Section
                  if (_results != null) ...[
                    const SizedBox(height: 40),
                    _ReviewResultsSection(results: _results!),
                  ],

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _VideoSection extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          constraints: const BoxConstraints(maxWidth: 480),
          child: AspectRatio(
            aspectRatio: 16 / 9,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.08),
                borderRadius: BorderRadius.circular(32),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.accentPrimary.withOpacity(0.18),
                    blurRadius: 48,
                    offset: const Offset(0, 12),
                  ),
                  BoxShadow(
                    color: Colors.black.withOpacity(0.18),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              padding: const EdgeInsets.all(18),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(22),
                child: Image.asset(
                  'assets/images/templates/Banner.png',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) {
                    return Container(
                      color: Colors.grey.withOpacity(0.2),
                      child: const Center(
                        child: Icon(
                          Icons.play_circle_outline,
                          size: 64,
                          color: Colors.white70,
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.star,
              size: 16,
              color: AppTheme.textMuted,
            ),
            const SizedBox(width: 4),
            Text(
              'See how AI reviews your resume in real time.',
              style: AppTheme.bodySmall.copyWith(
                color: AppTheme.textMuted,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

class _FormSection extends StatelessWidget {
  final String? selectedFile;
  final bool isLoading;
  final VoidCallback onPickFile;
  final VoidCallback onReview;

  const _FormSection({
    required this.selectedFile,
    required this.isLoading,
    required this.onPickFile,
    required this.onReview,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(maxWidth: 520),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'AI Resume Review',
            style: AppTheme.display2,
          ),
          const SizedBox(height: 8),
          Text(
            'Upload your resume for a deep, actionable review. No scores—just real feedback and fixes.',
            style: AppTheme.lead.copyWith(
              color: AppTheme.textMuted,
            ),
          ),
          const SizedBox(height: 24),
          GlassCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Upload your resume (PDF or DOCX)',
                  style: AppTheme.body.copyWith(
                    color: AppTheme.textPrimary,
                  ),
                ),
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: onPickFile,
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
                    child: Row(
                      children: [
                        const Icon(
                          Icons.cloud_upload,
                          color: Color(0xFF9ec5fe),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            selectedFile ?? 'Select file',
                            style: AppTheme.body.copyWith(
                              color: AppTheme.textPrimary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                if (selectedFile != null) ...[
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
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
                            selectedFile!,
                            style: AppTheme.bodySmall.copyWith(
                              color: AppTheme.textPrimary,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: selectedFile == null || isLoading ? null : onReview,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.brandPrimary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      disabledBackgroundColor: Colors.grey.withOpacity(0.3),
                    ),
                    child: isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                            ),
                          )
                        : const Text(
                            'Review',
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
    );
  }
}

class _InfoCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final Widget child;

  const _InfoCard({
    required this.icon,
    required this.title,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      constraints: const BoxConstraints(minHeight: 320),
      padding: const EdgeInsets.fromLTRB(28, 32, 28, 24),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.06),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: AppTheme.accentPrimary.withOpacity(0.18),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.18),
            blurRadius: 32,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(
            icon,
            size: 40,
            color: AppTheme.accentPrimary,
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: AppTheme.heading1,
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _InfoListItem extends StatelessWidget {
  final String text;
  final bool isBold;

  const _InfoListItem(this.text, {this.isBold = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('•', style: TextStyle(color: AppTheme.textPrimary)),
          const SizedBox(width: 8),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: AppTheme.body.copyWith(
                  fontSize: 18.4, // 1.15rem
                  color: const Color(0xFFb6bbc7),
                ),
                children: [
                  if (isBold)
                    TextSpan(
                      text: text,
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    )
                  else
                    TextSpan(text: text),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoStepItem extends StatelessWidget {
  final String number;
  final String title;
  final String description;

  const _InfoStepItem(this.number, this.title, this.description);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '$number.',
            style: AppTheme.body.copyWith(
              fontSize: 18.4,
              color: const Color(0xFFb6bbc7),
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: AppTheme.body.copyWith(
                  fontSize: 18.4,
                  color: const Color(0xFFb6bbc7),
                ),
                children: [
                  TextSpan(
                    text: '$title ',
                    style: const TextStyle(fontWeight: FontWeight.bold),
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

class _ReviewResultsSection extends StatelessWidget {
  final Map<String, dynamic> results;

  const _ReviewResultsSection({required this.results});

  Color _getHealthColor(int health) {
    if (health >= 80) return AppTheme.brandSecondary;
    if (health >= 65) return AppTheme.warning;
    return AppTheme.danger;
  }

  Color _getReadabilityColor(int readability) {
    if (readability >= 90) return AppTheme.brandSecondary;
    if (readability >= 60) return AppTheme.info;
    if (readability >= 30) return AppTheme.warning;
    return AppTheme.danger;
  }

  @override
  Widget build(BuildContext context) {
    final health = results['health'] as int;
    final healthLabel = results['healthLabel'] as String;
    final healthEmoji = results['healthEmoji'] as String;
    final summary = results['summary'] as String;
    final readability = results['readability'] as int;
    final readabilityLabel = results['readabilityLabel'] as String;
    final mistakes = results['mistakes'] as List;
    final checklist = results['checklist'] as List;
    final sections = results['sections'] as List<SectionItem>;
    final fixFirst = results['fixFirst'] as List<QuestItem>;
    final suggestions = results['suggestions'] as List;
    final atsParse = results['atsParse'] as String;
    final nextSteps = results['nextSteps'] as List;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Health Card
        ScrollAnimation(
          delay: const Duration(milliseconds: 0),
          child: Card3D(
            padding: const EdgeInsets.all(24),
            child: Row(
              children: [
                Text(
                  healthEmoji,
                  style: TextStyle(
                    fontSize: 40,
                    shadows: [
                      Shadow(
                        color: _getHealthColor(health).withOpacity(0.53),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        healthLabel,
                        style: AppTheme.heading2,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        summary,
                        style: AppTheme.bodyLarge.copyWith(
                          color: AppTheme.textMuted,
                        ),
                      ),
                      const SizedBox(height: 12),
                      ClipRRect(
                        borderRadius: BorderRadius.circular(8),
                        child: Container(
                          height: 8,
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.1),
                            boxShadow: [
                              BoxShadow(
                                color: _getHealthColor(health).withOpacity(0.2),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: FractionallySizedBox(
                            widthFactor: health / 100.0,
                            alignment: Alignment.centerLeft,
                            child: Container(
                              decoration: BoxDecoration(
                                gradient: LinearGradient(
                                  colors: [
                                    _getHealthColor(health),
                                    _getHealthColor(health).withOpacity(0.8),
                                  ],
                                ),
                              ),
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

        const SizedBox(height: 24),

        // Mistake Cards (Flip Cards)
        if (mistakes.isNotEmpty) ...[
          LayoutBuilder(
            builder: (context, constraints) {
              final isMobile = constraints.maxWidth < 768;
              return GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: isMobile ? 1 : 2,
                  crossAxisSpacing: 24,
                  mainAxisSpacing: 24,
                  childAspectRatio: isMobile ? 1.2 : 1.0,
                ),
                itemCount: mistakes.length,
                itemBuilder: (context, index) {
                  final mistake = mistakes[index] as Map<String, dynamic>;
                  return ScrollAnimation(
                    delay: Duration(milliseconds: index * 100),
                    child: FlipCard(
                      type: mistake['type'] as String,
                      description: mistake['description'] as String,
                      fixWhy: mistake['fixWhy'] as String?,
                      fixHow: mistake['fixHow'] as String?,
                    ),
                  );
                },
              );
            },
          ),
          const SizedBox(height: 24),
        ],

        // Health Checklist
        ScrollAnimation(
          delay: const Duration(milliseconds: 200),
          child: Card3D(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.checklist,
                      color: AppTheme.textPrimary,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Resume Health',
                      style: AppTheme.heading2,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...checklist.map((item) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.check_circle,
                            color: AppTheme.brandSecondary,
                            size: 20,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Text(
                              item as String,
                              style: AppTheme.body,
                            ),
                          ),
                        ],
                      ),
                    )),
              ],
            ),
          ),
        ),

        const SizedBox(height: 24),

        // Section-by-section
        ScrollAnimation(
          delay: const Duration(milliseconds: 300),
          child: Card3D(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.list,
                      color: AppTheme.textPrimary,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Section-by-section',
                      style: AppTheme.heading2,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                SectionStepper(sections: sections),
              ],
            ),
          ),
        ),

        const SizedBox(height: 24),

        // Readability
        ScrollAnimation(
          delay: const Duration(milliseconds: 400),
          child: Card3D(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.bar_chart,
                      color: AppTheme.textPrimary,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Readability',
                      style: AppTheme.heading2,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Text(
                      '$readability',
                      style: AppTheme.display3,
                    ),
                    const SizedBox(width: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: _getReadabilityColor(readability).withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        readabilityLabel,
                        style: AppTheme.bodySmall.copyWith(
                          color: _getReadabilityColor(readability),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    const Icon(
                      Icons.info_outline,
                      color: AppTheme.textMuted,
                      size: 20,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Container(
                    height: 8,
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.1),
                      boxShadow: [
                        BoxShadow(
                          color: _getReadabilityColor(readability).withOpacity(0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: FractionallySizedBox(
                      widthFactor: readability / 100.0,
                      alignment: Alignment.centerLeft,
                      child: Container(
                        color: _getReadabilityColor(readability),
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Flesch Reading Ease: 90+ (easy), 60–89 (good), 30–59 (hard), <30 (very hard)',
                  style: AppTheme.bodySmall.copyWith(
                    color: AppTheme.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 24),

        // Fix this first
        ScrollAnimation(
          delay: const Duration(milliseconds: 500),
          child: Card3D(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.lightbulb,
                      color: AppTheme.textPrimary,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'Fix this first',
                      style: AppTheme.heading2,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                QuestList(items: fixFirst),
              ],
            ),
          ),
        ),

        const SizedBox(height: 24),

        // Suggestions
        if (suggestions.isNotEmpty)
          ScrollAnimation(
            delay: const Duration(milliseconds: 600),
            child: Card3D(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(
                        Icons.lightbulb_outline,
                        color: AppTheme.textPrimary,
                        size: 20,
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'Suggestions to Improve Your Resume',
                        style: AppTheme.heading2,
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  ...suggestions.map((suggestion) => Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text('•', style: TextStyle(color: AppTheme.textMuted)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                suggestion as String,
                                style: AppTheme.body.copyWith(
                                  color: AppTheme.textMuted,
                                ),
                              ),
                            ),
                          ],
                        ),
                      )),
                ],
              ),
            ),
          ),

        if (suggestions.isNotEmpty) const SizedBox(height: 24),

        // ATS Parse
        ScrollAnimation(
          delay: const Duration(milliseconds: 700),
          child: Card3D(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.visibility,
                      color: AppTheme.textPrimary,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'What recruiters see',
                      style: AppTheme.heading2,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: const Color(0xFF181c24),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: SelectableText(
                    atsParse,
                    style: AppTheme.body.copyWith(
                      color: const Color(0xFFb6bbc7),
                      fontFamily: 'ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),

        const SizedBox(height: 24),

        // What to do next
        ScrollAnimation(
          delay: const Duration(milliseconds: 800),
          child: Card3D(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(
                      Icons.arrow_forward,
                      color: AppTheme.textPrimary,
                      size: 20,
                    ),
                    const SizedBox(width: 8),
                    const Text(
                      'What to do next',
                      style: AppTheme.heading2,
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                ...nextSteps.map((step) => Padding(
                      padding: const EdgeInsets.only(bottom: 8),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('•', style: TextStyle(color: AppTheme.textPrimary)),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              step as String,
                              style: AppTheme.body,
                            ),
                          ),
                        ],
                      ),
                    )),
                const SizedBox(height: 24),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {
                      // Navigate to improve resume page
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.brandPrimary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 20),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      elevation: 8,
                    ),
                    child: const Text(
                      'Improve your resume',
                      style: TextStyle(
                        fontSize: 19.2, // 1.2rem
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
