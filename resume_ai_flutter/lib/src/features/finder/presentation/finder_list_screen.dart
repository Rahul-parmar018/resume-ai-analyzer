import 'package:flutter/material.dart';
import 'package:resume_ai_flutter/src/shared/widgets/glass_card.dart';
import 'package:resume_ai_flutter/src/shared/widgets/scroll_animation.dart';
import 'package:resume_ai_flutter/src/shared/widgets/floating_elements.dart';
import 'package:resume_ai_flutter/src/shared/widgets/modal_3d.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

class FinderListScreen extends StatefulWidget {
  const FinderListScreen({super.key});

  @override
  State<FinderListScreen> createState() => _FinderListScreenState();
}

class _FinderListScreenState extends State<FinderListScreen> {
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
                  // Hero section
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 0),
                    child: Container(
                      constraints: const BoxConstraints(maxWidth: 760),
                      child: Column(
                        children: [
                          const Text(
                            'Find Best Candidates',
                            style: AppTheme.display2,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 8),
                          Text(
                            'Upload resumes, analyze, and rank the best matches with AI.',
                            style: AppTheme.lead.copyWith(
                              color: AppTheme.textMuted,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),
                          ElevatedButton(
                            onPressed: () => _showNewReqModal(context),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.brandPrimary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 32,
                                vertical: 16,
                              ),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            child: const Text(
                              'New requisition',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 40),

                  // Powered by AI divider
                  ScrollAnimation(
                    delay: const Duration(milliseconds: 100),
                    child: Column(
                      children: [
                        Text(
                          'A smart pipeline that reads, understands, and improves your resume screening.',
                          style: AppTheme.bodySmall.copyWith(
                            color: AppTheme.textMuted,
                          ),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 6),
                        Container(
                          width: 240,
                          height: 4,
                          margin: const EdgeInsets.symmetric(horizontal: 0),
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(999),
                            gradient: LinearGradient(
                              colors: [
                                AppTheme.accentPrimary.withOpacity(0.25),
                                AppTheme.brandSecondary.withOpacity(0.25),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 32),

                  // Info cards grid
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
                            child: _InfoCard(
                              icon: Icons.star,
                              iconColor: AppTheme.warning,
                              title: 'What we do',
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _InfoListItem(
                                    'Parse and standardize sections (experience, skills, education, summary).',
                                  ),
                                  _InfoListItem(
                                    'Detect ATS blockers (headings, bullet consistency, parsable text, fonts).',
                                  ),
                                  _InfoListItem(
                                    'Check keyword coverage vs. role expectations and real job posts.',
                                  ),
                                  _InfoListItem(
                                    'Estimate clarity and signal density (action verbs + metrics).',
                                  ),
                                  _InfoListItem(
                                    'Prioritize quick wins with step‑by‑step tips.',
                                  ),
                                ],
                              ),
                            ),
                          ),
                          ScrollAnimation(
                            delay: const Duration(milliseconds: 100),
                            child: _InfoCard(
                              icon: Icons.memory,
                              iconColor: AppTheme.info,
                              title: 'How it works',
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _InfoStepItem(
                                    '1',
                                    'Parse & extract:',
                                    'Read your PDF/DOCX and normalize content.',
                                  ),
                                  _InfoStepItem(
                                    '2',
                                    'Score:',
                                    'Compute subscores — ATS, Match, Skills, Readability, Structure.',
                                  ),
                                  _InfoStepItem(
                                    '3',
                                    'Find gaps:',
                                    'Spot missing must‑haves and weak bullets.',
                                  ),
                                  _InfoStepItem(
                                    '4',
                                    'Guide:',
                                    'Tailored suggestions; export a clean report.',
                                  ),
                                ],
                              ),
                            ),
                          ),
                          ScrollAnimation(
                            delay: const Duration(milliseconds: 200),
                            child: _InfoCard(
                              icon: Icons.rocket_launch,
                              iconColor: AppTheme.brandSecondary,
                              title: 'Why it\'s useful',
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  _InfoListItem(
                                    'Beat automated screens: avoid silent ATS rejections.',
                                  ),
                                  _InfoListItem(
                                    'Tailor faster: add the right keywords without guesswork.',
                                  ),
                                  _InfoListItem(
                                    'Show impact: rewrite bullets with measurable results.',
                                  ),
                                  _InfoListItem(
                                    'Iterate quickly: measure changes with subscores + total score.',
                                  ),
                                  _InfoListItem(
                                    'Pro tip: Keep resumes concise with strong recent impact.',
                                    isMuted: true,
                                  ),
                                ],
                              ),
                            ),
                          ),
                          ScrollAnimation(
                            delay: const Duration(milliseconds: 300),
                            child: _InfoCard(
                              icon: Icons.bar_chart,
                              iconColor: AppTheme.accentPrimary,
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
                                  _InfoListItem('ATS readiness (25%) — headings, formatting, parsability.'),
                                  _InfoListItem('Match (25%) — alignment to role keywords.'),
                                  _InfoListItem('Skills (20%) — coverage of must‑have tools & tech.'),
                                  _InfoListItem('Readability (15%) — clarity, concision, tone.'),
                                  _InfoListItem('Structure (15%) — bullet quality, layout, tense consistency.'),
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

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showNewReqModal(BuildContext context) {
    Modal3D.show(
      context: context,
      title: 'New requisition',
      actions: [
        TextButton(
          onPressed: () => Navigator.of(context).pop(),
          child: Text(
            'Cancel',
            style: TextStyle(color: AppTheme.textPrimary),
          ),
        ),
        ElevatedButton(
          onPressed: () {
            // TODO: Implement create requisition
            Navigator.of(context).pop();
          },
          style: ElevatedButton.styleFrom(
            backgroundColor: AppTheme.brandPrimary,
            foregroundColor: Colors.white,
          ),
          child: const Text('Create'),
        ),
      ],
      child: _NewReqForm(),
    );
  }
}

class _InfoCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final Widget child;

  const _InfoCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: AppTheme.heading3,
              ),
            ],
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
  final bool isMuted;

  const _InfoListItem(this.text, {this.isMuted = false});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('•', style: TextStyle(color: AppTheme.textMuted)),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              text,
              style: AppTheme.bodySmall.copyWith(
                color: isMuted ? AppTheme.textMuted : AppTheme.textMuted,
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
            style: AppTheme.bodySmall.copyWith(
              color: AppTheme.textMuted,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(width: 8),
          Expanded(
            child: RichText(
              text: TextSpan(
                style: AppTheme.bodySmall.copyWith(
                  color: AppTheme.textMuted,
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

class _NewReqForm extends StatefulWidget {
  @override
  State<_NewReqForm> createState() => _NewReqFormState();
}

class _NewReqFormState extends State<_NewReqForm> {
  final _formKey = GlobalKey<FormState>();
  final _titleController = TextEditingController();
  final _mustHaveController = TextEditingController();
  final _niceToHaveController = TextEditingController();
  final _minExpController = TextEditingController(text: '0');
  final _locationController = TextEditingController();
  final _notesController = TextEditingController();
  bool _showAdvanced = false;

  @override
  void dispose() {
    _titleController.dispose();
    _mustHaveController.dispose();
    _niceToHaveController.dispose();
    _minExpController.dispose();
    _locationController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Title
          Text(
            'Title',
            style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
          ),
          const SizedBox(height: 4),
          TextFormField(
            controller: _titleController,
            style: AppTheme.body,
            decoration: InputDecoration(
              hintText: 'e.g., Data Analyst',
              hintStyle: TextStyle(color: AppTheme.textMuted),
              filled: true,
              fillColor: Colors.white.withOpacity(0.05),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: Colors.white.withOpacity(0.16),
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: Colors.white.withOpacity(0.16),
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(10),
                borderSide: BorderSide(
                  color: AppTheme.accentPrimary.withOpacity(0.55),
                  width: 2,
                ),
              ),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Title is required.';
              }
              return null;
            },
          ),

          const SizedBox(height: 16),

          // Must-have and Nice-to-have
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Must-have (comma)',
                      style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                    ),
                    const SizedBox(height: 4),
                    TextFormField(
                      controller: _mustHaveController,
                      style: AppTheme.body,
                      decoration: _inputDecoration('SQL, Python, Tableau'),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Nice-to-have (comma)',
                      style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                    ),
                    const SizedBox(height: 4),
                    TextFormField(
                      controller: _niceToHaveController,
                      style: AppTheme.body,
                      decoration: _inputDecoration('dbt, Looker, A/B Testing'),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Min exp and Location
          Row(
            children: [
              Expanded(
                flex: 4,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Min experience (years)',
                      style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                    ),
                    const SizedBox(height: 4),
                    TextFormField(
                      controller: _minExpController,
                      keyboardType: TextInputType.number,
                      style: AppTheme.body,
                      decoration: _inputDecoration('0'),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 8,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Location',
                      style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                    ),
                    const SizedBox(height: 4),
                    TextFormField(
                      controller: _locationController,
                      style: AppTheme.body,
                      decoration: _inputDecoration('Remote / SF Bay Area'),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Notes
          Text(
            'Notes',
            style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
          ),
          const SizedBox(height: 4),
          TextFormField(
            controller: _notesController,
            maxLines: 2,
            style: AppTheme.body,
            decoration: _inputDecoration('Optional'),
          ),

          const SizedBox(height: 16),

          // Advanced details
          ExpansionTile(
            title: Row(
              children: [
                const Icon(Icons.tune, size: 18, color: AppTheme.textPrimary),
                const SizedBox(width: 8),
                Text(
                  'Advanced details',
                  style: AppTheme.body.copyWith(
                    color: AppTheme.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
            children: [
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Role type',
                          style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        DropdownButtonFormField<String>(
                          decoration: _inputDecoration(null),
                          items: const [
                            DropdownMenuItem(value: '', child: Text('—')),
                            DropdownMenuItem(value: 'Full-time', child: Text('Full‑time')),
                            DropdownMenuItem(value: 'Contract', child: Text('Contract')),
                            DropdownMenuItem(value: 'Intern', child: Text('Intern')),
                            DropdownMenuItem(value: 'Part-time', child: Text('Part‑time')),
                          ],
                          onChanged: (_) {},
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Salary min (USD)',
                          style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        TextFormField(
                          keyboardType: TextInputType.number,
                          style: AppTheme.body,
                          decoration: _inputDecoration('e.g., 80000'),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Salary max (USD)',
                          style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        TextFormField(
                          keyboardType: TextInputType.number,
                          style: AppTheme.body,
                          decoration: _inputDecoration('e.g., 120000'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Priority',
                          style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        DropdownButtonFormField<String>(
                          decoration: _inputDecoration(null),
                          items: const [
                            DropdownMenuItem(value: '', child: Text('—')),
                            DropdownMenuItem(value: 'Low', child: Text('Low')),
                            DropdownMenuItem(value: 'Medium', child: Text('Medium')),
                            DropdownMenuItem(value: 'High', child: Text('High')),
                            DropdownMenuItem(value: 'Critical', child: Text('Critical')),
                          ],
                          onChanged: (_) {},
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Tags (comma)',
                          style: AppTheme.body.copyWith(color: AppTheme.textPrimary),
                        ),
                        const SizedBox(height: 4),
                        TextFormField(
                          style: AppTheme.body,
                          decoration: _inputDecoration('Healthcare, Analytics, PM'),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
            ],
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDecoration(String? hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: TextStyle(color: AppTheme.textMuted),
      filled: true,
      fillColor: Colors.white.withOpacity(0.05),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(
          color: Colors.white.withOpacity(0.16),
        ),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(
          color: Colors.white.withOpacity(0.16),
        ),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(
          color: AppTheme.accentPrimary.withOpacity(0.55),
          width: 2,
        ),
      ),
    );
  }
}
