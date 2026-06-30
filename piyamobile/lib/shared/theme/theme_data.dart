import 'package:flutter/material.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'colors.dart';
import 'text_theme.dart';

class AppThemeData {
  static ThemeData themeDark = ThemeData(
    fontFamily: AppFonts.figtree,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: AppColors.darkBackground,
    primaryColor: AppColors.primaryColor,
    shadowColor: AppColors.darkBackground,
    canvasColor: AppColors.darkSurfaceTertiary,
    hintColor: AppColors.textOnDarkTertiary,
    unselectedWidgetColor: AppColors.darkUnselected,
    splashColor: AppColors.primaryMuted,
    highlightColor: AppColors.primarySubtle,

    colorScheme: const ColorScheme(
      brightness: Brightness.dark,
      primary: AppColors.primaryColor,
      onPrimary: AppColors.white,
      primaryContainer: AppColors.primaryDark,
      onPrimaryContainer: AppColors.primaryLighter,
      secondary: AppColors.secondaryColor,
      onSecondary: AppColors.white,
      secondaryContainer: AppColors.secondaryDark,
      onSecondaryContainer: AppColors.secondaryLighter,
      tertiary: AppColors.accentGold,
      onTertiary: AppColors.black,
      surface: AppColors.darkSurface,
      onSurface: AppColors.textOnDark,
      surfaceContainerHighest: AppColors.darkSurfaceTertiary,
      onSurfaceVariant: AppColors.textOnDarkSecondary,
      outline: AppColors.darkBorder,
      outlineVariant: AppColors.darkDivider,
      error: AppColors.error,
      onError: AppColors.white,
    ),

    textTheme: AppTextThemes.mobileTextThemeDark,

    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.darkBackground,
      foregroundColor: AppColors.textOnDark,
      elevation: 0,
      scrolledUnderElevation: 0.5,
      surfaceTintColor: Colors.transparent,
      centerTitle: true,
      toolbarHeight: 56,
      iconTheme: IconThemeData(color: AppColors.textOnDark, size: 24),
      titleTextStyle: TextStyle(
        fontFamily: AppFonts.figtree,
        fontSize: 17.0,
        fontWeight: FontWeight.w600,
        color: AppColors.textOnDark,
        letterSpacing: -0.2,
      ),
    ),

    cardColor: AppColors.darkSurface,
    cardTheme: CardThemeData(
      color: AppColors.darkSurface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.darkBorder, width: 0.5),
      ),
      margin: const EdgeInsets.symmetric(vertical: 6),
    ),

    dividerColor: AppColors.darkDivider,
    dividerTheme: const DividerThemeData(
      color: AppColors.darkDivider,
      thickness: 0.5,
      space: 0.5,
    ),

    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.darkBackgroundElevated,
      elevation: 0,
      type: BottomNavigationBarType.fixed,
      showSelectedLabels: false,
      showUnselectedLabels: false,
      selectedItemColor: AppColors.primaryColor,
      unselectedItemColor: AppColors.darkUnselected,
      selectedIconTheme: IconThemeData(color: AppColors.primaryColor, size: 24),
      unselectedIconTheme: IconThemeData(
        color: AppColors.darkUnselected,
        size: 24,
      ),
    ),

    iconTheme: const IconThemeData(color: AppColors.textOnDark, size: 24),
    primaryIconTheme: const IconThemeData(
      color: AppColors.primaryColor,
      size: 24,
    ),

    inputDecorationTheme: InputDecorationTheme(
      fillColor: AppColors.darkFill,
      filled: true,
      hintStyle: const TextStyle(
        fontFamily: AppFonts.figtree,
        fontSize: 17.0,
        color: AppColors.textOnDarkTertiary,
        fontWeight: FontWeight.w400,
      ),
      iconColor: AppColors.textOnDarkSecondary,
      prefixIconColor: AppColors.textOnDarkSecondary,
      suffixIconColor: AppColors.textOnDarkSecondary,
      border: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.darkBorder),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.darkBorder),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.primaryColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.error),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.error, width: 2),
      ),
      disabledBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.darkDivider),
      ),
      isDense: true,
      contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primaryColor,
        foregroundColor: AppColors.white,
        minimumSize: const Size(280, 50),
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacings.defaultBorderRadius,
        ),
        elevation: 0,
        textStyle: const TextStyle(
          fontFamily: AppFonts.figtree,
          fontSize: 17.0,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.0,
        ),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.primaryColor,
        minimumSize: const Size(280, 50),
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacings.defaultBorderRadius,
        ),
        side: const BorderSide(color: AppColors.primaryColor, width: 1.5),
        textStyle: const TextStyle(
          fontFamily: AppFonts.figtree,
          fontSize: 17.0,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),

    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: AppColors.primaryColor,
        textStyle: const TextStyle(
          fontFamily: AppFonts.figtree,
          fontSize: 17.0,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),

    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return AppColors.primaryColor;
        }
        return Colors.transparent;
      }),
      checkColor: WidgetStateProperty.all(AppColors.white),
      side: const BorderSide(color: AppColors.darkBorderOpaque, width: 1.5),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
    ),

    radioTheme: RadioThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return AppColors.primaryColor;
        }
        return AppColors.darkUnselected;
      }),
    ),

    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) return AppColors.white;
        return AppColors.textOnDarkSecondary;
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return AppColors.primaryColor;
        }
        return AppColors.darkFill;
      }),
      trackOutlineColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return Colors.transparent;
        }
        return AppColors.darkBorder;
      }),
    ),

    chipTheme: ChipThemeData(
      backgroundColor: AppColors.darkFill,
      selectedColor: AppColors.primaryColor,
      disabledColor: AppColors.darkSurfaceSecondary,
      labelStyle: const TextStyle(
        fontFamily: AppFonts.figtree,
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: AppColors.textOnDark,
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      side: const BorderSide(color: AppColors.darkBorder, width: 0.5),
    ),

    listTileTheme: const ListTileThemeData(
      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      tileColor: Colors.transparent,
      iconColor: AppColors.textOnDarkSecondary,
      textColor: AppColors.textOnDark,
    ),

    bottomSheetTheme: const BottomSheetThemeData(
      backgroundColor: AppColors.darkSurface,
      modalBackgroundColor: AppColors.darkSurface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
    ),

    dialogTheme: DialogThemeData(
      backgroundColor: AppColors.darkSurface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      titleTextStyle: const TextStyle(
        fontFamily: AppFonts.figtree,
        fontSize: 17,
        fontWeight: FontWeight.w600,
        color: AppColors.textOnDark,
      ),
    ),
  );

  static ThemeData themeLight = ThemeData(
    fontFamily: AppFonts.figtree,
    brightness: Brightness.light,
    scaffoldBackgroundColor: AppColors.lightBackground,
    primaryColor: AppColors.primaryColor,
    shadowColor: AppColors.lightText,
    canvasColor: AppColors.lightSurface,
    hintColor: AppColors.lightTextTertiary,
    unselectedWidgetColor: AppColors.lightUnselected,
    splashColor: AppColors.primaryMuted,
    highlightColor: AppColors.primarySubtle,

    colorScheme: const ColorScheme(
      brightness: Brightness.light,
      primary: AppColors.primaryColor,
      onPrimary: AppColors.white,
      primaryContainer: AppColors.primaryLighter,
      onPrimaryContainer: AppColors.primaryDarker,
      secondary: AppColors.secondaryColor,
      onSecondary: AppColors.white,
      secondaryContainer: AppColors.secondaryLighter,
      onSecondaryContainer: AppColors.secondaryDarker,
      tertiary: AppColors.accentGold,
      onTertiary: AppColors.white,
      surface: AppColors.lightSurface,
      onSurface: AppColors.lightText,
      surfaceContainerHighest: AppColors.lightSurfaceSecondary,
      onSurfaceVariant: AppColors.lightTextSecondary,
      outline: AppColors.lightBorder,
      outlineVariant: AppColors.lightDivider,
      error: AppColors.error,
      onError: AppColors.white,
    ),

    textTheme: AppTextThemes.mobileTextThemeLight,

    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.lightBackground,
      foregroundColor: AppColors.lightText,
      elevation: 0,
      scrolledUnderElevation: 0.5,
      surfaceTintColor: Colors.transparent,
      centerTitle: true,
      toolbarHeight: 56,
      iconTheme: IconThemeData(color: AppColors.lightText, size: 24),
      titleTextStyle: TextStyle(
        fontFamily: AppFonts.figtree,
        fontSize: 17.0,
        fontWeight: FontWeight.w600,
        color: AppColors.lightText,
        letterSpacing: -0.2,
      ),
    ),

    cardColor: AppColors.lightSurface,
    cardTheme: CardThemeData(
      color: AppColors.lightSurface,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: AppColors.lightBorder, width: 0.5),
      ),
      margin: const EdgeInsets.symmetric(vertical: 6),
    ),

    dividerColor: AppColors.lightDivider,
    dividerTheme: const DividerThemeData(
      color: AppColors.lightDivider,
      thickness: 0.5,
      space: 0.5,
    ),

    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: AppColors.lightBackgroundElevated,
      elevation: 0,
      type: BottomNavigationBarType.fixed,
      showSelectedLabels: false,
      showUnselectedLabels: false,
      selectedItemColor: AppColors.primaryColor,
      unselectedItemColor: AppColors.lightUnselected,
      selectedIconTheme: IconThemeData(color: AppColors.primaryColor, size: 24),
      unselectedIconTheme: IconThemeData(
        color: AppColors.lightUnselected,
        size: 24,
      ),
    ),

    iconTheme: const IconThemeData(color: AppColors.lightText, size: 24),
    primaryIconTheme: const IconThemeData(
      color: AppColors.primaryColor,
      size: 24,
    ),

    inputDecorationTheme: InputDecorationTheme(
      fillColor: AppColors.lightFill,
      filled: true,
      hintStyle: const TextStyle(
        fontFamily: AppFonts.figtree,
        fontSize: 17.0,
        color: AppColors.lightTextTertiary,
        fontWeight: FontWeight.w400,
      ),
      iconColor: AppColors.lightTextSecondary,
      prefixIconColor: AppColors.lightTextSecondary,
      suffixIconColor: AppColors.lightTextSecondary,
      border: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.lightFill),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.lightFill),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.primaryColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.error, width: 2),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.error, width: 2),
      ),
      disabledBorder: OutlineInputBorder(
        borderRadius: AppSpacings.defaultBorderRadius,
        borderSide: const BorderSide(color: AppColors.lightDivider),
      ),
      isDense: true,
      contentPadding: const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
    ),

    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primaryColor,
        foregroundColor: AppColors.white,
        minimumSize: const Size(280, 50),
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacings.defaultBorderRadius,
        ),
        elevation: 0,
        textStyle: const TextStyle(
          fontFamily: AppFonts.figtree,
          fontSize: 17.0,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.0,
        ),
      ),
    ),

    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: AppColors.primaryColor,
        minimumSize: const Size(280, 50),
        shape: RoundedRectangleBorder(
          borderRadius: AppSpacings.defaultBorderRadius,
        ),
        side: const BorderSide(color: AppColors.primaryColor, width: 1.5),
        textStyle: const TextStyle(
          fontFamily: AppFonts.figtree,
          fontSize: 17.0,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),

    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: AppColors.primaryColor,
        textStyle: const TextStyle(
          fontFamily: AppFonts.figtree,
          fontSize: 17.0,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),

    checkboxTheme: CheckboxThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return AppColors.primaryColor;
        }
        return Colors.transparent;
      }),
      checkColor: WidgetStateProperty.all(AppColors.white),
      side: const BorderSide(color: AppColors.lightBorderOpaque, width: 1.5),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
    ),

    radioTheme: RadioThemeData(
      fillColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return AppColors.primaryColor;
        }
        return AppColors.lightUnselected;
      }),
    ),

    switchTheme: SwitchThemeData(
      thumbColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) return AppColors.white;
        return AppColors.lightTextSecondary;
      }),
      trackColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return AppColors.primaryColor;
        }
        return AppColors.lightFill;
      }),
      trackOutlineColor: WidgetStateProperty.resolveWith((states) {
        if (states.contains(WidgetState.selected)) {
          return Colors.transparent;
        }
        return AppColors.lightBorder;
      }),
    ),

    chipTheme: ChipThemeData(
      backgroundColor: AppColors.lightFill,
      selectedColor: AppColors.primaryColor,
      disabledColor: AppColors.lightSurfaceSecondary,
      labelStyle: const TextStyle(
        fontFamily: AppFonts.figtree,
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: AppColors.lightText,
      ),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      side: const BorderSide(color: AppColors.lightBorder, width: 0.5),
    ),

    listTileTheme: const ListTileThemeData(
      contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      tileColor: Colors.transparent,
      iconColor: AppColors.lightTextSecondary,
      textColor: AppColors.lightText,
    ),

    bottomSheetTheme: const BottomSheetThemeData(
      backgroundColor: AppColors.lightSurface,
      modalBackgroundColor: AppColors.lightSurface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
    ),

    dialogTheme: DialogThemeData(
      backgroundColor: AppColors.lightSurface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      titleTextStyle: const TextStyle(
        fontFamily: AppFonts.figtree,
        fontSize: 17,
        fontWeight: FontWeight.w600,
        color: AppColors.lightText,
      ),
    ),
  );
}
