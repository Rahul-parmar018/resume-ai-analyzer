import 'package:flutter/material.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

/// Holographic card matching Django CSS exactly
/// CSS: background: linear-gradient(#0b0f16,#0b0f16) padding-box,
///      linear-gradient(135deg, rgba(124,58,237,.6), rgba(34,197,94,.6)) border-box;
class HolographicCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final bool subtle;

  const HolographicCard({
    super.key,
    required this.child,
    this.padding,
    this.subtle = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(1), // Border width
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: subtle
            ? LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.white.withOpacity(0.15),
                  Colors.white.withOpacity(0.05),
                ],
              )
            : LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  AppTheme.accentPrimary.withOpacity(0.6),
                  AppTheme.brandSecondary.withOpacity(0.6),
                ],
              ),
        boxShadow: const [
          BoxShadow(
            color: Colors.black,
            blurRadius: 40,
            offset: Offset(0, 18),
            spreadRadius: 0,
          ),
        ],
      ),
      child: Container(
        padding: padding ?? const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(15),
          color: const Color(0xFF0b0f16),
        ),
        child: child,
      ),
    );
  }
}

