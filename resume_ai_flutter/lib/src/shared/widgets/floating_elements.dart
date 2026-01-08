import 'package:flutter/material.dart';
import 'dart:math' as math;

/// Floating 3D background elements (cubes, spheres, pyramids) matching Django
class FloatingElements extends StatelessWidget {
  const FloatingElements({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Floating cubes
        _FloatingCube(offset: const Offset(100, 200), duration: 8),
        _FloatingCube(offset: const Offset(800, 400), duration: 10),
        _FloatingCube(offset: const Offset(1200, 100), duration: 12),
        
        // Floating spheres
        _FloatingSphere(offset: const Offset(300, 500), duration: 9),
        _FloatingSphere(offset: const Offset(1000, 300), duration: 11),
        
        // Floating pyramids
        _FloatingPyramid(offset: const Offset(600, 600), duration: 10),
        _FloatingPyramid(offset: const Offset(1400, 200), duration: 8),
      ],
    );
  }
}

class _FloatingCube extends StatefulWidget {
  final Offset offset;
  final double duration;

  const _FloatingCube({required this.offset, required this.duration});

  @override
  State<_FloatingCube> createState() => _FloatingCubeState();
}

class _FloatingCubeState extends State<_FloatingCube>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: widget.duration.toInt()),
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
        final value = _controller.value * 2 * math.pi;
        return Positioned(
          left: widget.offset.dx + math.sin(value) * 30,
          top: widget.offset.dy + math.cos(value) * 30,
          child: Transform.rotate(
            angle: value,
            child: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.05),
                border: Border.all(
                  color: Colors.white.withOpacity(0.1),
                  width: 1,
                ),
              ),
              transform: Matrix4.identity()
                ..setEntry(3, 2, 0.001)
                ..rotateX(0.5)
                ..rotateY(0.5),
            ),
          ),
        );
      },
    );
  }
}

class _FloatingSphere extends StatefulWidget {
  final Offset offset;
  final double duration;

  const _FloatingSphere({required this.offset, required this.duration});

  @override
  State<_FloatingSphere> createState() => _FloatingSphereState();
}

class _FloatingSphereState extends State<_FloatingSphere>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: widget.duration.toInt()),
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
        final value = _controller.value * 2 * math.pi;
        return Positioned(
          left: widget.offset.dx + math.cos(value) * 40,
          top: widget.offset.dy + math.sin(value) * 40,
          child: Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withOpacity(0.05),
              border: Border.all(
                color: Colors.white.withOpacity(0.1),
                width: 1,
              ),
            ),
          ),
        );
      },
    );
  }
}

class _FloatingPyramid extends StatefulWidget {
  final Offset offset;
  final double duration;

  const _FloatingPyramid({required this.offset, required this.duration});

  @override
  State<_FloatingPyramid> createState() => _FloatingPyramidState();
}

class _FloatingPyramidState extends State<_FloatingPyramid>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: Duration(seconds: widget.duration.toInt()),
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
        final value = _controller.value * 2 * math.pi;
        return Positioned(
          left: widget.offset.dx + math.sin(value * 0.5) * 35,
          top: widget.offset.dy + math.cos(value * 0.5) * 35,
          child: Transform.rotate(
            angle: value,
            child: CustomPaint(
              size: const Size(45, 45),
              painter: _PyramidPainter(),
            ),
          ),
        );
      },
    );
  }
}

class _PyramidPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.05)
      ..style = PaintingStyle.fill
      ..strokeWidth = 1;

    final borderPaint = Paint()
      ..color = Colors.white.withOpacity(0.1)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 1;

    final path = Path()
      ..moveTo(size.width / 2, 0)
      ..lineTo(0, size.height)
      ..lineTo(size.width, size.height)
      ..close();

    canvas.drawPath(path, paint);
    canvas.drawPath(path, borderPaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

