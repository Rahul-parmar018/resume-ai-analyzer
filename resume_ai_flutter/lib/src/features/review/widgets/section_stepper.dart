import 'package:flutter/material.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

/// Section stepper matching Django CSS exactly
/// CSS: .section-stepper with status indicators
class SectionStepper extends StatelessWidget {
  final List<SectionItem> sections;

  const SectionStepper({
    super.key,
    required this.sections,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: sections.map((section) => _SectionItemWidget(section: section)).toList(),
    );
  }
}

class SectionItem {
  final String name;
  final String status; // 'ok', 'missing', 'weak'

  SectionItem({required this.name, required this.status});
}

class _SectionItemWidget extends StatelessWidget {
  final SectionItem section;

  const _SectionItemWidget({required this.section});

  @override
  Widget build(BuildContext context) {
    Color backgroundColor;
    Color borderColor;
    String content;

    switch (section.status) {
      case 'ok':
        backgroundColor = AppTheme.brandSecondary;
        borderColor = AppTheme.brandSecondary;
        content = '✓';
        break;
      case 'missing':
        backgroundColor = AppTheme.danger;
        borderColor = AppTheme.danger;
        content = '!';
        break;
      default:
        backgroundColor = const Color(0xFF23272f);
        borderColor = AppTheme.accentPrimary;
        content = '';
    }

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            width: 18,
            height: 18,
            decoration: BoxDecoration(
              color: backgroundColor,
              shape: BoxShape.circle,
              border: Border.all(color: borderColor, width: 2),
            ),
            child: Center(
              child: Text(
                content,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  height: 1.0,
                ),
                textAlign: TextAlign.center,
              ),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Text(
              section.name,
              style: AppTheme.body.copyWith(
                fontSize: 17.6, // 1.1rem
              ),
            ),
          ),
        ],
      ),
    );
  }
}

