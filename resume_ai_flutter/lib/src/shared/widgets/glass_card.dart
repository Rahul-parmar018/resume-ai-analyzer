import 'package:flutter/material.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

/// Glass morphism card widget matching Django CSS exactly
class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets? padding;
  final double? borderRadius;
  final Color? backgroundColor;
  final Color? borderColor;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.borderRadius,
    this.backgroundColor,
    this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding ?? const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppTheme.cardColor,
        borderRadius: BorderRadius.circular(borderRadius ?? AppTheme.radiusLg),
        border: Border.all(
          color: borderColor ?? AppTheme.borderColor,
          width: 1,
        ),
        boxShadow: AppTheme.cardShadow,
      ),
      child: child,
    );
  }
}

