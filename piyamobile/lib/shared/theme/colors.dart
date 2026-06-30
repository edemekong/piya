import 'package:flutter/material.dart';

class AppColors {
  const AppColors._();

  static const Color primaryColor = Color(0xFFFF2347);
  static const Color primaryLight = Color(0xFFFFDFDE);
  static const Color primaryLighter = Color(0xFFFFDFDE);
  static const Color primaryDark = Color(0xFFD92D20);
  static const Color primaryDarker = Color(0xFF1A1A1A);
  static const Color primaryMuted = Color(0x1AFF2347);
  static const Color primarySubtle = Color(0x0DFF2347);

  static const Color secondaryColor = Color(0xFF7192FF);
  static const Color secondaryLight = Color(0xFF0A89D3);
  static const Color secondaryLighter = Color(0xFFF4F5F8);
  static const Color secondaryDark = Color(0xFF4A4A4A);
  static const Color secondaryDarker = Color(0xFF1A1A1A);
  static const Color secondaryMuted = Color(0x1A7192FF);
  static const Color secondarySubtle = Color(0x0D7192FF);

  static const Color accentGold = Color(0xFFFFB800);
  static const Color accentGoldLight = Color(0xFFF7B27A);
  static const Color accentGoldDark = Color(0xFF757575);

  static const Color success = Color(0xFF34A853);
  static const Color successLight = Color(0xFF2ECC71);
  static const Color warning = Color(0xFFF7B27A);
  static const Color warningLight = Color(0xFFFFB800);
  static const Color error = Color(0xFFD92D20);
  static const Color errorLight = Color(0xFFFFDFDE);
  static const Color info = Color(0xFF7192FF);
  static const Color infoLight = Color(0xFF0A89D3);

  static const Color white = Color(0xFFFFFFFF);
  static const Color black = Color(0xFF000000);

  static const List<Color> confettiColors = [
    primaryColor,
    secondaryColor,
    accentGold,
    success,
    warning,
  ];

  static const Color lightBackground = Color(0xFFFFFFFF);
  static const Color lightBackgroundElevated = Color(0xFFFFFFFF);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceSecondary = Color(0xFFF5F5F5);
  static const Color lightSurfaceTertiary = Color(0xFFF4F5F8);

  static const Color lightText = Color(0xFF1A1A1A);
  static const Color lightTextBody = Color(0xFF595959);
  static const Color lightTextSecondary = Color(0xFF4A4A4A);
  static const Color lightTextTertiary = Color(0xFF9E9E9E);
  static const Color lightTextQuaternary = Color(0xFFBDBDBD);

  static const Color lightBorder = Color(0xFFE4E7EC);
  static const Color lightBorderOpaque = Color(0xFFE0E0E0);
  static const Color lightDivider = Color(0xFFE0E0E0);
  static const Color lightFill = Color(0xFFF4F5F8);
  static const Color lightFillSecondary = Color(0xFFF0F0F0);

  static const Color lightUnselected = Color(0xFFBDBDBD);
  static const Color lightOverlay = Color(0x0D000000);

  static const Color darkBackground = Color(0xFF000000);
  static const Color darkBackgroundElevated = Color(0xFF1A1A1A);
  static const Color darkSurface = Color(0xFF1A1A1A);
  static const Color darkSurfaceSecondary = Color(0xFF4A4A4A);
  static const Color darkSurfaceTertiary = Color(0xFF757575);

  static const Color textOnDark = Color(0xFFFFFFFF);
  static const Color textOnDarkSecondary = Color(0xFFF5F5F5);
  static const Color textOnDarkTertiary = Color(0xFFE0E0E0);
  static const Color textOnDarkQuaternary = Color(0xFFBDBDBD);

  static const Color darkBorder = Color(0xFF4A4A4A);
  static const Color darkBorderOpaque = Color(0xFF757575);
  static const Color darkDivider = Color(0xFF4A4A4A);
  static const Color darkFill = Color(0xFF1A1A1A);
  static const Color darkFillSecondary = Color(0xFF4A4A4A);

  static const Color darkUnselected = Color(0xFF757575);
  static const Color darkOverlay = Color(0x0DFFFFFF);

  static const Color lightBackground2 = lightSurfaceSecondary;
  static const Color lightSurfaceRaised = lightSurface;
  static const Color lightSurfaceMid = lightSurfaceTertiary;
  static const Color lightTextGhost = Color(0x1A1A1A1A);
  static const Color darkBackground2 = darkBackgroundElevated;
  static const Color darkSurfaceRaised = darkSurfaceTertiary;
  static const Color darkSurfaceMid = darkSurfaceSecondary;
  static const Color darkTextGhost = Color(0x1AFFFFFF);

  static const LinearGradient launchGradientDark = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [darkSurfaceSecondary, darkBackground],
  );

  static const LinearGradient launchGradientLight = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [lightSurfaceSecondary, lightBackground],
  );

  static const LinearGradient heroGradientDark = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [darkSurfaceTertiary, darkBackground],
  );

  static const LinearGradient heroGradientLight = LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: [lightSurface, lightBackground],
  );

  static const LinearGradient primaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryLight, primaryColor],
  );

  static const LinearGradient secondaryGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [secondaryLight, secondaryColor],
  );

  static const LinearGradient wheelGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryColor, secondaryColor],
  );

  static const LinearGradient warmGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [primaryLighter, secondaryLighter],
  );
}
