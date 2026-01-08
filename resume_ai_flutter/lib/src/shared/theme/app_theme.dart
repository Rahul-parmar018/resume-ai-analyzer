import 'package:flutter/material.dart';

/// App Theme - 100% matching Django website CSS
/// Extracted from resumes/static/css/marketing.css
class AppTheme {
  // Color Palette - Exact values from CSS
  static const Color bgPrimary = Color(0xFF0b0c10);
  static const Color bgSecondary = Color(0xFF111827);
  static const Color bgSurface = Color(0xFF0d1117);
  
  static const Color textPrimary = Color(0xFFe5e7eb);
  static const Color textSecondary = Color(0xFFc9d1d9);
  static const Color textMuted = Color(0xFF9ca3af);
  static const Color textHeading = Color(0xFFFFFFFF);
  
  static const Color brandPrimary = Color(0xFF16a34a);
  static const Color brandSecondary = Color(0xFF22c55e);
  static const Color accentPrimary = Color(0xFF7c3aed);
  static const Color accentSecondary = Color(0xFF9333ea);
  
  static const Color success = Color(0xFF22c55e);
  static const Color warning = Color(0xFFf59e0b);
  static const Color danger = Color(0xFFef4444);
  static const Color info = Color(0xFF3b82f6);
  
  static Color borderColor = Colors.white.withOpacity(0.08);
  static Color cardColor = Colors.white.withOpacity(0.06);
  
  // Typography - Matching Django CSS
  static const String fontFamily = 'Inter';
  
  static const TextStyle display1 = TextStyle(
    fontSize: 48,
    fontWeight: FontWeight.bold,
    color: textHeading,
    height: 1.2,
    fontFamily: fontFamily,
  );
  
  static const TextStyle display2 = TextStyle(
    fontSize: 36,
    fontWeight: FontWeight.bold,
    color: textHeading,
    fontFamily: fontFamily,
  );
  
  static const TextStyle display3 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: textHeading,
    fontFamily: fontFamily,
  );
  
  static const TextStyle heading1 = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: textHeading,
    fontFamily: fontFamily,
  );
  
  static const TextStyle heading2 = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: textHeading,
    fontFamily: fontFamily,
  );
  
  static const TextStyle heading3 = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: textHeading,
    fontFamily: fontFamily,
  );
  
  static const TextStyle bodyLarge = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.normal,
    color: textPrimary,
    height: 1.6,
    fontFamily: fontFamily,
  );
  
  static const TextStyle body = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.normal,
    color: textPrimary,
    height: 1.5,
    fontFamily: fontFamily,
  );
  
  static const TextStyle bodySmall = TextStyle(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: textMuted,
    height: 1.5,
    fontFamily: fontFamily,
  );
  
  static const TextStyle lead = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.normal,
    color: textMuted,
    height: 1.5,
    fontFamily: fontFamily,
  );
  
  // Spacing - Matching Django CSS
  static const double spacingXs = 4.0;
  static const double spacingSm = 8.0;
  static const double spacingMd = 16.0;
  static const double spacingLg = 24.0;
  static const double spacingXl = 32.0;
  static const double spacing2xl = 40.0;
  static const double spacing3xl = 60.0;
  static const double spacing4xl = 80.0;
  
  // Border Radius - Matching Django CSS
  static const double radiusSm = 8.0;
  static const double radiusMd = 12.0;
  static const double radiusLg = 16.0;
  static const double radiusXl = 22.0;
  static const double radiusFull = 9999.0;
  
  // Shadows - Matching Django CSS
  static List<BoxShadow> get cardShadow => [
    BoxShadow(
      color: Colors.black.withOpacity(0.35),
      blurRadius: 35,
      offset: const Offset(0, 10),
    ),
    BoxShadow(
      color: Colors.black.withOpacity(0.25),
      blurRadius: 14,
      offset: const Offset(0, 4),
    ),
  ];
  
  static List<BoxShadow> get cardShadow3d => [
    BoxShadow(
      color: accentPrimary.withOpacity(0.18),
      blurRadius: 32,
      offset: const Offset(0, 12),
    ),
    BoxShadow(
      color: Colors.black.withOpacity(0.18),
      blurRadius: 8,
      offset: const Offset(0, 2),
    ),
  ];
  
  // Glass Morphism Card Decoration
  static BoxDecoration get glassCard => BoxDecoration(
    color: cardColor,
    borderRadius: BorderRadius.circular(radiusLg),
    border: Border.all(color: borderColor),
    boxShadow: cardShadow,
  );
  
  // 3D Card Decoration
  static BoxDecoration get card3d => BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [
        const Color(0xFF1e232d).withOpacity(0.98),
        accentPrimary.withOpacity(0.10),
      ],
    ),
    borderRadius: BorderRadius.circular(radiusXl),
    border: Border.all(color: const Color(0xFF23272f), width: 2),
    boxShadow: cardShadow3d,
  );
  
  // Button Styles
  static ButtonStyle get brandButton => ElevatedButton.styleFrom(
    backgroundColor: brandPrimary,
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(radiusSm),
    ),
    elevation: 0,
  );
  
  static ButtonStyle get outlineButton => OutlinedButton.styleFrom(
    side: const BorderSide(color: Colors.white),
    foregroundColor: Colors.white,
    padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(radiusSm),
    ),
  );
  
  // Theme Data
  static ThemeData get darkTheme => ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: bgPrimary,
    colorScheme: const ColorScheme.dark(
      primary: brandPrimary,
      secondary: accentPrimary,
      surface: bgSecondary,
      background: bgPrimary,
      error: danger,
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: textPrimary,
      onBackground: textPrimary,
      onError: Colors.white,
    ),
    fontFamily: fontFamily,
    textTheme: const TextTheme(
      displayLarge: display1,
      displayMedium: display2,
      displaySmall: display3,
      headlineLarge: heading1,
      headlineMedium: heading2,
      headlineSmall: heading3,
      bodyLarge: bodyLarge,
      bodyMedium: body,
      bodySmall: bodySmall,
    ),
  );
}

