import 'package:flutter/material.dart';

/// 3D emoji verdict matching Django CSS
/// CSS: width:64px; height:64px; border-radius:50%;
/// background: radial-gradient(circle at 35% 30%, rgba(255,255,255,.6) 0 16%, transparent 17%),
///             linear-gradient(145deg, var(--c1), var(--c2));
class Emoji3D extends StatelessWidget {
  final String emoji;
  final Color color1;
  final Color color2;

  const Emoji3D({
    super.key,
    required this.emoji,
    required this.color1,
    required this.color2,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 64,
      height: 64,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [color1, color2],
        ),
        boxShadow: [
          BoxShadow(
            color: color1.withOpacity(0.35),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Radial highlight
          Positioned(
            left: 22.4, // 35% of 64
            top: 19.2, // 30% of 64
            child: Container(
              width: 10.24, // 16% of 64
              height: 10.24,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.6),
              ),
            ),
          ),
          // Emoji
          Center(
            child: Text(
              emoji,
              style: const TextStyle(fontSize: 32),
            ),
          ),
        ],
      ),
    );
  }
}

