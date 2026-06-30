import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/constants/storage_keys.dart';
import 'package:piyamobile/shared/services/shared_preference_service.dart';
import 'package:piyamobile/shared/theme/theme_data.dart';

final appThemeProvider = Provider<AppTheme>((ref) {
  return AppTheme(ref);
});

class AppTheme {
  final Ref ref;

  AppTheme(this.ref) {
    // setThemeFromLocalStorage();
  }

  String? themeKey;

  ValueNotifier<ThemeData> themeDataNotifier = ValueNotifier<ThemeData>(
    AppThemeData.themeLight,
  );

  bool isLightMode(BuildContext context) =>
      Theme.of(context).brightness == Brightness.light;

  bool isDarkMode(BuildContext context) =>
      Theme.of(context).brightness == Brightness.dark;

  void setThemeFromLocalStorage() async {
    final newThemeKey = SharedPreferenceService.getString(
      key: LocalStorageKeys.themeKey,
    );

    themeKey =
        newThemeKey ?? PlatformDispatcher.instance.platformBrightness.name;
    themeDataNotifier.value = _getTheme(newThemeKey);
    _applySystemUI(newThemeKey);
  }

  void changeTheme(ThemeData data) {
    themeDataNotifier.value = data;
    final themeName = data.brightness == Brightness.dark ? 'dark' : 'light';
    themeKey = themeName;
    _applySystemUI(themeName);
    SharedPreferenceService.setString(
      key: LocalStorageKeys.themeKey,
      value: themeName,
    );
  }

  void changeThemeFromName(String themeName) async {
    themeKey = themeName;
    themeDataNotifier.value = _getTheme(themeName);
    _applySystemUI(themeName);
    await SharedPreferenceService.setString(
      key: LocalStorageKeys.themeKey,
      value: themeName,
    );
  }

  ThemeData _getTheme(String? name) {
    switch (name) {
      case 'light':
        return AppThemeData.themeLight;
      case 'dark':
        return AppThemeData.themeDark;
      default:
        final systemBrightness = PlatformDispatcher.instance.platformBrightness;
        return systemBrightness == Brightness.dark
            ? AppThemeData.themeDark
            : AppThemeData.themeLight;
    }
  }

  void _applySystemUI(String? themeName) {
    SystemChrome.setEnabledSystemUIMode(
      SystemUiMode.manual,
      overlays: [SystemUiOverlay.top, SystemUiOverlay.bottom],
    );

    final isDark = _isDarkThemeName(themeName);

    final overlayStyle = isDark
        ? SystemUiOverlayStyle.light
        : SystemUiOverlayStyle.dark;

    SystemChrome.setSystemUIOverlayStyle(
      overlayStyle.copyWith(
        statusBarColor: Colors.transparent,
        statusBarBrightness: isDark ? Brightness.dark : Brightness.light,
        statusBarIconBrightness: isDark ? Brightness.light : Brightness.dark,
        systemNavigationBarColor: Colors.transparent,
        systemNavigationBarIconBrightness: isDark
            ? Brightness.light
            : Brightness.dark,
      ),
    );
  }

  bool _isDarkThemeName(String? name) {
    if (name == 'dark') return true;
    if (name == 'light') return false;
    return PlatformDispatcher.instance.platformBrightness == Brightness.dark;
  }
}
