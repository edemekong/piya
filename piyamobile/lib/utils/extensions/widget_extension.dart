import 'dart:ui';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';

String get languageCode => PlatformDispatcher.instance.locale.languageCode;

extension XBuildContext on BuildContext {
  Size get appSize => MediaQuery.of(this).size;
  ThemeData get appTheme => Theme.of(this);

  bool get isDark => appTheme.brightness == Brightness.dark;
  bool get isLight => appTheme.brightness == Brightness.light;

  Color get sheetColor =>
      isDark ? appTheme.scaffoldBackgroundColor : appTheme.cardColor;

  Color get appBackground => appTheme.scaffoldBackgroundColor;
  Color get appSurface => appTheme.cardColor;
  Color get appDivider => appTheme.dividerColor;
  Color get appCanvasColor => appTheme.canvasColor;
  Color get appBorder => isDark ? AppColors.darkBorder : AppColors.lightBorder;

  Color get appText => appTheme.textTheme.bodyMedium!.color!;
  Color get appTextSecondary => appTheme.textTheme.bodySmall!.color!;
  Color get appTextGhost =>
      appTheme.textTheme.bodySmall!.color!.withValues(alpha: 0.12);
}

extension XWidget on Widget {
  Widget greyOut({bool grey = true, Color? color, Function()? onTap}) {
    return Builder(
      key: key,
      builder: (context) {
        return GestureDetector(
          onTap: onTap,
          child: Container(
            color: Colors.transparent,
            child: IgnorePointer(
              ignoring: grey,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  this,
                  if (grey)
                    Positioned(
                      left: 0,
                      right: 0,
                      bottom: 0,
                      top: 0,
                      child: DecoratedBox(
                        position: DecorationPosition.foreground,
                        decoration: BoxDecoration(
                          color:
                              color ??
                              Theme.of(context).scaffoldBackgroundColor,
                          backgroundBlendMode: BlendMode.saturation,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  Widget debugBorder({Color? color}) {
    if (kDebugMode) {
      return DecoratedBox(
        decoration: BoxDecoration(
          border: Border.all(color: color ?? Colors.red, width: 4),
        ),
        child: this,
      );
    } else {
      return this;
    }
  }

  Widget addBorder({
    double width = 0.8,
    Color color = Colors.black,
    Color? backgroundColor,
  }) {
    return DecoratedBox(
      decoration: BoxDecoration(
        border: Border.all(width: width, color: color),
        borderRadius: AppSpacings.defaultBorderRadius,
        color: backgroundColor,
      ),
      child: this,
    );
  }
}
