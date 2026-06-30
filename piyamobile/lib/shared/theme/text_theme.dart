import 'package:flutter/material.dart';
import 'colors.dart';

class AppFonts {
  static const String figtree = 'Figtree';

  static const List<String> fallbackFonts = [
    'SF Pro Display',
    'Roboto',
    '-apple-system',
    'sans-serif',
  ];
}

class AppTextThemes {
  static const double largeTitle = 34.0;
  static const double title1 = 28.0;
  static const double title2 = 22.0;
  static const double title3 = 20.0;
  static const double headline = 17.0;
  static const double body = 17.0;
  static const double callout = 16.0;
  static const double subheadline = 15.0;
  static const double footnote = 13.0;
  static const double caption1 = 12.0;
  static const double caption2 = 11.0;
  static const double micro = 11.0;

  static const double _largeTitleHeight = 1.21;
  static const double _title1Height = 1.21;
  static const double _title2Height = 1.27;
  static const double _title3Height = 1.25;
  static const double _headlineHeight = 1.29;
  static const double _bodyHeight = 1.29;
  static const double _calloutHeight = 1.31;
  static const double _subheadlineHeight = 1.33;
  static const double _footnoteHeight = 1.38;
  static const double _caption1Height = 1.33;
  static const double _caption2Height = 1.18;

  static const TextStyle spinnerLabel = TextStyle(
    fontFamily: AppFonts.figtree,
    fontSize: 24.0,
    fontWeight: FontWeight.w700,
    letterSpacing: -0.5,
    height: 1.21,
  );

  static const TextStyle spinnerResult = TextStyle(
    fontFamily: AppFonts.figtree,
    fontSize: 32.0,
    fontWeight: FontWeight.w800,
    letterSpacing: -0.5,
    height: 1.21,
  );

  static const TextStyle chipLabel = TextStyle(
    fontFamily: AppFonts.figtree,
    fontSize: caption2,
    fontWeight: FontWeight.w600,
    letterSpacing: 0.6,
    height: _caption2Height,
  );

  static const TextTheme mobileTextThemeDark = TextTheme(
    displayLarge: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: largeTitle,
      color: AppColors.textOnDark,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.37,
      height: _largeTitleHeight,
    ),
    displayMedium: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: title1,
      color: AppColors.textOnDark,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.36,
      height: _title1Height,
    ),
    displaySmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: title2,
      color: AppColors.primaryLight,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.26,
      height: _title2Height,
    ),
    headlineMedium: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: title3,
      color: AppColors.textOnDark,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.45,
      height: _title3Height,
    ),
    headlineSmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: headline,
      color: AppColors.textOnDark,
      fontWeight: FontWeight.w600,
      letterSpacing: -0.43,
      height: _headlineHeight,
    ),
    titleLarge: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: callout,
      color: AppColors.textOnDarkSecondary,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.31,
      height: _calloutHeight,
    ),
    titleMedium: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: subheadline,
      color: AppColors.textOnDark,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.23,
      height: _subheadlineHeight,
    ),
    titleSmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: footnote,
      color: AppColors.textOnDarkSecondary,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.08,
      height: _footnoteHeight,
    ),
    bodyLarge: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: body,
      color: AppColors.textOnDarkSecondary,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.43,
      height: _bodyHeight,
    ),
    bodyMedium: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: body,
      color: AppColors.textOnDark,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.43,
      height: _bodyHeight,
    ),
    bodySmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: caption1,
      color: AppColors.textOnDarkSecondary,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.0,
      height: _caption1Height,
    ),
    labelLarge: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: subheadline,
      color: AppColors.white,
      fontWeight: FontWeight.w600,
      letterSpacing: -0.23,
      height: _subheadlineHeight,
    ),
    labelSmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: caption2,
      color: AppColors.textOnDarkTertiary,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.06,
      height: _caption2Height,
    ),
  );

  static const TextTheme mobileTextThemeLight = TextTheme(
    displayLarge: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: largeTitle,
      color: AppColors.lightText,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.37,
      height: _largeTitleHeight,
    ),
    displayMedium: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: title1,
      color: AppColors.lightText,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.36,
      height: _title1Height,
    ),
    displaySmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: title2,
      color: AppColors.primaryDark,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.26,
      height: _title2Height,
    ),
    headlineMedium: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: title3,
      color: AppColors.lightText,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.45,
      height: _title3Height,
    ),
    headlineSmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: headline,
      color: AppColors.lightText,
      fontWeight: FontWeight.w600,
      letterSpacing: -0.43,
      height: _headlineHeight,
    ),
    titleLarge: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: callout,
      color: AppColors.lightTextSecondary,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.31,
      height: _calloutHeight,
    ),
    titleMedium: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: subheadline,
      color: AppColors.lightText,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.23,
      height: _subheadlineHeight,
    ),
    titleSmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: footnote,
      color: AppColors.lightTextSecondary,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.08,
      height: _footnoteHeight,
    ),
    bodyLarge: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: body,
      color: AppColors.lightTextSecondary,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.43,
      height: _bodyHeight,
    ),
    bodyMedium: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: body,
      color: AppColors.lightTextBody,
      fontWeight: FontWeight.w400,
      letterSpacing: -0.43,
      height: _bodyHeight,
    ),
    bodySmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: caption1,
      color: AppColors.lightTextSecondary,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.0,
      height: _caption1Height,
    ),
    labelLarge: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: subheadline,
      color: AppColors.lightText,
      fontWeight: FontWeight.w600,
      letterSpacing: -0.23,
      height: _subheadlineHeight,
    ),
    labelSmall: TextStyle(
      fontFamily: AppFonts.figtree,
      fontSize: caption2,
      color: AppColors.lightTextTertiary,
      fontWeight: FontWeight.w400,
      letterSpacing: 0.06,
      height: _caption2Height,
    ),
  );
}
