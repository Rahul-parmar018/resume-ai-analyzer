import 'package:flutter/material.dart';
import 'package:resume_ai_flutter/src/shared/theme/app_theme.dart';

/// 3D flip card for mistakes/fixes matching Django CSS exactly
/// CSS: .flip-card with 3D transform and hover effects
class FlipCard extends StatefulWidget {
  final String type;
  final String description;
  final String? fixHow;
  final String? fixWhy;

  const FlipCard({
    super.key,
    required this.type,
    required this.description,
    this.fixHow,
    this.fixWhy,
  });

  @override
  State<FlipCard> createState() => _FlipCardState();
}

class _FlipCardState extends State<FlipCard>
    with SingleTickerProviderStateMixin {
  bool _isFlipped = false;
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 600),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeInOut,
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _toggleFlip() {
    setState(() {
      _isFlipped = !_isFlipped;
      if (_isFlipped) {
        _controller.forward();
      } else {
        _controller.reverse();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _toggleFlip,
      child: Container(
        constraints: const BoxConstraints(minHeight: 180),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              const Color(0xFF23272f).withOpacity(0.8),
              AppTheme.accentPrimary.withOpacity(0.13),
            ],
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.3),
              blurRadius: 18,
              offset: const Offset(0, 6),
            ),
            BoxShadow(
              color: AppTheme.accentPrimary.withOpacity(0.2),
              blurRadius: 0,
              spreadRadius: 2,
            ),
          ],
        ),
        child: AnimatedBuilder(
          animation: _animation,
          builder: (context, child) {
            final angle = _animation.value * 3.14159; // π radians = 180 degrees
            return Transform(
              alignment: Alignment.center,
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001) // perspective
                ..rotateY(angle),
              child: _isFlipped ? _buildBack() : _buildFront(),
            );
          },
        ),
      ),
    );
  }

  Widget _buildFront() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        color: Colors.transparent,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            '⚠️',
            style: const TextStyle(fontSize: 24),
          ),
          const SizedBox(height: 8),
          Text(
            widget.type,
            style: AppTheme.heading3,
          ),
          const SizedBox(height: 8),
          Text(
            widget.description,
            style: AppTheme.bodySmall.copyWith(
              color: AppTheme.textMuted,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            'Tap to see fix',
            style: AppTheme.bodySmall.copyWith(
              color: AppTheme.textMuted,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBack() {
    return Transform(
      alignment: Alignment.center,
      transform: Matrix4.identity()..rotateY(3.14159), // 180 degrees
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: AppTheme.brandSecondary.withOpacity(0.10),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (widget.fixWhy != null) ...[
              Text(
                widget.fixWhy!,
                style: AppTheme.bodySmall.copyWith(
                  color: AppTheme.warning,
                ),
              ),
              const SizedBox(height: 6),
            ],
            if (widget.fixHow != null) ...[
              Text(
                widget.fixHow!,
                style: AppTheme.bodySmall.copyWith(
                  color: AppTheme.info,
                ),
              ),
            ],
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.accentPrimary,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                'AI Fix',
                style: AppTheme.bodySmall.copyWith(
                  color: Colors.white,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

