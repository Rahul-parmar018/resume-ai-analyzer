import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

/// 3D modal with animated gradient border matching Django CSS
/// CSS: .fx-modal-border with conic gradient animation
class Modal3D extends StatelessWidget {
  final String title;
  final Widget child;
  final List<Widget>? actions;
  final bool showCloseButton;
  final VoidCallback? onClose;

  const Modal3D({
    super.key,
    required this.title,
    required this.child,
    this.actions,
    this.showCloseButton = true,
    this.onClose,
  });

  static Future<T?> show<T>({
    required BuildContext context,
    required String title,
    required Widget child,
    List<Widget>? actions,
    bool showCloseButton = true,
  }) {
    return showDialog<T>(
      context: context,
      barrierColor: Colors.black.withOpacity(0.7),
      builder: (context) => Modal3D(
        title: title,
        child: child,
        actions: actions,
        showCloseButton: showCloseButton,
        onClose: () => Navigator.of(context).pop(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Colors.transparent,
      insetPadding: const EdgeInsets.all(24),
      child: Container(
        constraints: const BoxConstraints(maxWidth: 800),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: const Color(0xFF0e121a),
        ),
        child: Stack(
          children: [
            // Animated gradient border
            _AnimatedBorder(),
            // Content
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    border: Border(
                      bottom: BorderSide(
                        color: Colors.white.withOpacity(0.08),
                        width: 1,
                      ),
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: Text(
                          title,
                          style: AppTheme.heading2,
                        ),
                      ),
                      if (showCloseButton)
                        IconButton(
                          icon: const Icon(
                            Icons.close,
                            color: AppTheme.textPrimary,
                          ),
                          onPressed: onClose ?? () => Navigator.of(context).pop(),
                        ),
                    ],
                  ),
                ),
                // Body
                Flexible(
                  child: SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: child,
                    ),
                  ),
                ),
                // Footer
                if (actions != null && actions!.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      border: Border(
                        top: BorderSide(
                          color: Colors.white.withOpacity(0.08),
                          width: 1,
                        ),
                      ),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: actions!,
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _AnimatedBorder extends StatefulWidget {
  @override
  State<_AnimatedBorder> createState() => _AnimatedBorderState();
}

class _AnimatedBorderState extends State<_AnimatedBorder>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 8),
      vsync: this,
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return CustomPaint(
          painter: _AnimatedBorderPainter(
            angle: _controller.value * 2 * 3.14159,
          ),
          child: Container(),
        );
      },
    );
  }
}

class _AnimatedBorderPainter extends CustomPainter {
  final double angle;

  _AnimatedBorderPainter({required this.angle});

  @override
  void paint(Canvas canvas, Size size) {
    final rect = Rect.fromLTWH(0, 0, size.width, size.height);
    final paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 2
      ..shader = ui.Gradient.sweep(
        Offset(size.width / 2, size.height / 2),
        [
          AppTheme.accentPrimary,
          AppTheme.brandSecondary,
          AppTheme.info,
          AppTheme.accentPrimary,
        ],
        [0.0, 0.33, 0.66, 1.0],
        TileMode.clamp,
        angle,
        angle + 2 * 3.14159,
      );

    final path = Path()
      ..addRRect(RRect.fromRectAndRadius(rect, const Radius.circular(16)));

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant _AnimatedBorderPainter oldDelegate) {
    return oldDelegate.angle != angle;
  }
}

