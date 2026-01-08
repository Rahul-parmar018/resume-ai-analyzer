import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:resume_ai_flutter/src/features/finder/presentation/finder_list_screen.dart';
import 'package:resume_ai_flutter/src/features/score_checker/presentation/score_checker_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _AppColors.background,
      body: Stack(
        children: [
          const _HeroBackground(),
          SafeArea(
            child: Center(
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1280),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: const [
                      _Navbar(),
                      SizedBox(height: 56),
                      Expanded(child: _HeroSection()),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _Navbar extends StatelessWidget {
  const _Navbar();

  @override
  Widget build(BuildContext context) {
    final textTheme = GoogleFonts.interTextTheme(Theme.of(context).textTheme);

    return Row(
      children: [
        // Logo + title
        Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(10),
                gradient: const LinearGradient(
                  colors: [_AppColors.primary, _AppColors.accentPurple],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: _AppColors.primary.withOpacity(0.5),
                    blurRadius: 18,
                    spreadRadius: 1,
                  ),
                ],
              ),
              child: const Icon(Icons.auto_graph_rounded, size: 18, color: Colors.white),
            ),
            const SizedBox(width: 10),
            Text(
              'AI Resume Screener',
              style: textTheme.titleMedium?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
        const Spacer(),

        // Center nav
        LayoutBuilder(
          builder: (context, constraints) {
            if (constraints.maxWidth < 900) return const SizedBox.shrink();

            final items = [
              'Home',
              'Score Checker',
              'Candidate Finder',
              'Resume Review',
              'Improve Resume',
              'Pricing',
            ];

            return Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: items.map((label) {
                final isActive = label == 'Home';
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  child: Text(
                    label,
                    style: textTheme.bodyMedium?.copyWith(
                      color: isActive ? Colors.white : _AppColors.textMuted,
                      fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
                    ),
                  ),
                );
              }).toList(),
            );
          },
        ),

        const Spacer(),

        // Right controls
        Row(
          children: [
            _DarkModeToggle(textTheme: textTheme),
            const SizedBox(width: 12),
            Text(
              'Sign in',
              style: textTheme.bodyMedium?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(width: 16),
            const PrimaryButton(
              label: 'Get Started',
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            ),
          ],
        ),
      ],
    );
  }
}

class _DarkModeToggle extends StatelessWidget {
  const _DarkModeToggle({required this.textTheme});

  final TextTheme textTheme;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(999),
        color: const Color(0xFF020617),
        border: Border.all(color: Colors.white.withOpacity(0.08)),
      ),
      child: Row(
        children: [
          const Icon(Icons.dark_mode_rounded, size: 16, color: Colors.white),
          const SizedBox(width: 6),
          Text(
            'Dark',
            style: textTheme.bodySmall?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroSection extends StatelessWidget {
  const _HeroSection();

  @override
  Widget build(BuildContext context) {
    final textTheme = GoogleFonts.interTextTheme(Theme.of(context).textTheme);
    final isSmall = MediaQuery.of(context).size.width < 900;

    final content = Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        // Left content
        Expanded(
          flex: 6,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'AI that scores resumes, finds the best candidates, and improves your resume',
                style: textTheme.displaySmall?.copyWith(
                  fontSize: 46,
                  height: 1.15,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                  letterSpacing: -1.2,
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Upload resumes for instant scoring, rank candidates against your requirements, detect mistakes, and get AI‑powered improvements.',
                style: textTheme.bodyLarge?.copyWith(
                  color: _AppColors.textMuted,
                  height: 1.6,
                ),
              ),
              const SizedBox(height: 32),
              Wrap(
                spacing: 14,
                runSpacing: 12,
                children: [
                  PrimaryButton(
                    label: 'Check my resume',
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const ScoreCheckerScreen()),
                      );
                    },
                  ),
                  SecondaryButton(
                    label: 'Find best candidate',
                    onPressed: () {
                      Navigator.of(context).push(
                        MaterialPageRoute(builder: (_) => const FinderListScreen()),
                      );
                    },
                  ),
                ],
              ),
              const SizedBox(height: 24),
              const StarRatingRow(),
            ],
          ),
        ),

        const SizedBox(width: 40),

        // Right mockup
        const Expanded(
          flex: 5,
          child: Align(
            alignment: Alignment.centerRight,
            child: _HeroMockup(),
          ),
        ),
      ],
    );

    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 300),
      child: isSmall
          ? Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                content.children.first,
                const SizedBox(height: 32),
                const _HeroMockup(),
              ],
            )
          : content,
    );
  }
}

class _HeroMockup extends StatelessWidget {
  const _HeroMockup();

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 420,
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          // Accent blobs
          Positioned(
            top: -60,
            right: -40,
            child: _BlurCircle(
              size: 180,
              color: _AppColors.accentPurple.withOpacity(0.6),
            ),
          ),
          Positioned(
            bottom: -40,
            left: -40,
            child: _BlurCircle(
              size: 220,
              color: _AppColors.primary.withOpacity(0.45),
            ),
          ),

          // Main glass card with image
          Align(
            alignment: Alignment.centerRight,
            child: GlassCard(
              width: 420,
              height: 380,
              borderRadius: 32,
              child: ClipRRect(
                borderRadius: BorderRadius.circular(28),
                child: Image.asset(
                  'assets/branding/mockups/hero_resume.png',
                  fit: BoxFit.cover,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _HeroBackground extends StatelessWidget {
  const _HeroBackground();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Color(0xFF020617),
            Color(0xFF020617),
            Color(0xFF0B1120),
          ],
        ),
      ),
      child: CustomPaint(
        painter: _ParticlePainter(),
      ),
    );
  }
}

class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.width,
    this.height,
    this.borderRadius = 24,
  });

  final Widget child;
  final double? width;
  final double? height;
  final double borderRadius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(borderRadius),
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.16),
            Colors.white.withOpacity(0.04),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border.all(
          color: Colors.white.withOpacity(0.18),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.65),
            blurRadius: 40,
            offset: const Offset(0, 24),
          ),
        ],
      ),
      child: child,
    );
  }
}

class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    this.onPressed,
    this.padding = const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
  });

  final String label;
  final VoidCallback? onPressed;
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final textTheme = GoogleFonts.interTextTheme(Theme.of(context).textTheme);

    return _BaseButton(
      onPressed: onPressed,
      padding: padding,
      background: const LinearGradient(
        colors: [_AppColors.primary, _AppColors.primaryBright],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      borderColor: Colors.transparent,
      child: Text(
        label,
        style: textTheme.bodyMedium?.copyWith(
          color: Colors.white,
          fontWeight: FontWeight.w600,
        ),
      ),
    );
  }
}

class SecondaryButton extends StatelessWidget {
  const SecondaryButton({
    super.key,
    required this.label,
    this.onPressed,
  });

  final String label;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    final textTheme = GoogleFonts.interTextTheme(Theme.of(context).textTheme);

    return _BaseButton(
      onPressed: onPressed,
      padding: const EdgeInsets.symmetric(horizontal: 26, vertical: 15),
      background: const LinearGradient(
        colors: [Color(0xFF020617), Color(0xFF020617)],
      ),
      borderColor: Colors.white.withOpacity(0.16),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            label,
            style: textTheme.bodyMedium?.copyWith(
              color: Colors.white,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class _BaseButton extends StatelessWidget {
  const _BaseButton({
    required this.child,
    required this.background,
    required this.borderColor,
    this.padding = const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
    this.onPressed,
  });

  final Widget child;
  final LinearGradient background;
  final Color borderColor;
  final EdgeInsetsGeometry padding;
  final VoidCallback? onPressed;

  @override
  Widget build(BuildContext context) {
    return MouseRegion(
      cursor: SystemMouseCursors.click,
      child: GestureDetector(
        onTap: onPressed,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 160),
          padding: padding,
          decoration: BoxDecoration(
            gradient: background,
            borderRadius: BorderRadius.circular(999),
            border: Border.all(color: borderColor, width: 1.2),
            boxShadow: onPressed == null
                ? []
                : [
                    const BoxShadow(
                      color: Color(0x66022C22),
                      blurRadius: 24,
                      offset: Offset(0, 16),
                    ),
                  ],
          ),
          child: child,
        ),
      ),
    );
  }
}

class StarRatingRow extends StatelessWidget {
  const StarRatingRow({super.key});

  @override
  Widget build(BuildContext context) {
    final textTheme = GoogleFonts.interTextTheme(Theme.of(context).textTheme);

    return Row(
      children: [
        ...List.generate(
          4,
          (_) => const Icon(Icons.star_rounded, color: Color(0xFFFACC15), size: 20),
        ),
        const Icon(Icons.star_half_rounded, color: Color(0xFFFACC15), size: 20),
        const SizedBox(width: 10),
        Text(
          '4.8 from 1,200+ reviews',
          style: textTheme.bodySmall?.copyWith(
            color: _AppColors.textMuted,
          ),
        ),
      ],
    );
  }
}

class _BlurCircle extends StatelessWidget {
  const _BlurCircle({required this.size, required this.color});

  final double size;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(0.7),
            blurRadius: 120,
            spreadRadius: 10,
          ),
        ],
      ),
    );
  }
}

class _ParticlePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.12)
      ..style = PaintingStyle.fill;

    for (var i = 0; i < 60; i++) {
      final dx = (size.width) * (i / 60);
      final dy = (size.height) * ((i * 7 % 60) / 60);
      final radius = 0.8 + (i % 3) * 0.4;
      paint.color = Colors.white.withOpacity(0.05 + (i % 5) * 0.02);
      canvas.drawCircle(Offset(dx, dy), radius, paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}

class _AppColors {
  static const background = Color(0xFF020617);
  static const primary = Color(0xFF16A34A);
  static const primaryBright = Color(0xFF22C55E);
  static const accentPurple = Color(0xFF7C3AED);
  static const textMuted = Color(0xFF9CA3AF);
}


