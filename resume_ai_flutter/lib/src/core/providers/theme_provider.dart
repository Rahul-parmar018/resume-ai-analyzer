import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

/// Theme Mode State
enum AppThemeMode {
  light,
  dark,
}

/// Theme Provider
class ThemeNotifier extends StateNotifier<AppThemeMode> {
  ThemeNotifier() : super(AppThemeMode.dark) {
    _loadTheme();
  }

  Future<void> _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final savedTheme = prefs.getString('theme');
    if (savedTheme == 'light') {
      state = AppThemeMode.light;
    } else {
      state = AppThemeMode.dark;
    }
  }

  Future<void> toggleTheme() async {
    final newTheme = state == AppThemeMode.dark
        ? AppThemeMode.light
        : AppThemeMode.dark;
    state = newTheme;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'theme',
      newTheme == AppThemeMode.light ? 'light' : 'dark',
    );
  }

  Future<void> setTheme(AppThemeMode theme) async {
    state = theme;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(
      'theme',
      theme == AppThemeMode.light ? 'light' : 'dark',
    );
  }
}

final themeProvider =
    StateNotifierProvider<ThemeNotifier, AppThemeMode>((ref) {
  return ThemeNotifier();
});

