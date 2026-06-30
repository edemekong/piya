import 'package:flutter/material.dart';
import 'colors.dart';

class AppSpacings {
  AppSpacings._();

  static const double webWidth = 1080;

  static const double screenPadding = 28;
  static const double k48 = 48;
  static const double cardPadding = screenPadding * 0.8;
  static const double elementSpacing = cardPadding * 0.5;
  static const double elementSpacingSmall = elementSpacing * 0.5;

  static const double radius = 5;
  static const double outlineWidth = 0.5;
  static const double cardOutlineWidth = 0.5;

  static const BorderRadius defaultBorderRadius = BorderRadius.all(Radius.circular(radius * 2.50));
  static const BorderRadius defaultSecondBorderRadius = BorderRadius.all(
    Radius.circular(radius * 3.50),
  );

  static const BorderRadius defaultBorderRadiusTextField = BorderRadius.all(
    Radius.circular(radius * 1.5),
  );

  static const BorderRadius largeBorderRadius = BorderRadius.all(Radius.circular(radius * 3));

  static const BorderRadius chipBorderRadius = BorderRadius.all(Radius.circular(999));

  static const BorderRadius defaultCircularRadius = BorderRadius.all(Radius.circular(999));

  static const OutlineInputBorder outLineBorder = OutlineInputBorder(
    borderRadius: defaultBorderRadiusTextField,
    borderSide: BorderSide(color: AppColors.darkBorder, width: outlineWidth),
  );

  static const OutlineInputBorder focusedOutLineBorder = OutlineInputBorder(
    borderRadius: defaultBorderRadiusTextField,
    borderSide: BorderSide(color: AppColors.primaryColor, width: 1.5),
  );

  static const OutlineInputBorder disabledOutLineBorder = OutlineInputBorder(
    borderRadius: defaultBorderRadiusTextField,
    borderSide: BorderSide(color: AppColors.darkDivider, width: outlineWidth),
  );

  static const OutlineInputBorder errorLineBorder = OutlineInputBorder(
    borderRadius: defaultBorderRadiusTextField,
    borderSide: BorderSide(color: AppColors.error, width: 1.5),
  );

  static const OutlineInputBorder errorFocusedBorder = OutlineInputBorder(
    borderRadius: defaultBorderRadiusTextField,
    borderSide: BorderSide(color: AppColors.error, width: 1.5),
  );
}
