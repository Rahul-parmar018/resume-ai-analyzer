import 'package:flutter/material.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

/// 3D card widget with hover effects matching Django CSS exactly
class Card3D extends StatefulWidget {
  final Widget child;
  final EdgeInsets? padding;
  final VoidCallback? onTap;

  const Card3D({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
  });

  @override
  State<Card3D> createState() => _Card3DState();
}

class _Card3DState extends State<Card3D> {
  bool _isHovered = false;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      onEnter: (_) => setState(() => _isHovered = true),
      onExit: (_) => setState(() => _isHovered = false),
      child: GestureDetector(
        onTap: widget.onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          padding: widget.padding ?? const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                const Color(0xFF1e232d).withOpacity(0.98),
                AppTheme.accentPrimary.withOpacity(0.10),
              ],
            ),
            borderRadius: BorderRadius.circular(AppTheme.radiusXl),
            border: Border.all(
              color: _isHovered ? AppTheme.accentPrimary : const Color(0xFF23272f),
              width: 2,
            ),
            boxShadow: _isHovered
                ? [
                    BoxShadow(
                      color: AppTheme.accentPrimary.withOpacity(0.18),
                      blurRadius: 60,
                      offset: const Offset(0, 24),
                    ),
                    BoxShadow(
                      color: Colors.black.withOpacity(0.03),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : AppTheme.cardShadow3d,
          ),
          transform: _isHovered
              ? (Matrix4.identity()
                ..translate(0.0, -4.0)
                ..scale(1.01))
              : Matrix4.identity(),
          child: widget.child,
        ),
      ),
    );
  }
}

