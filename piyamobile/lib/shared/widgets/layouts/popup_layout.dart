import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';

class PopupLayout extends StatelessWidget {
  final bool popUp;
  final Widget child;

  const PopupLayout({super.key, required this.popUp, required this.child});

  @override
  Widget build(BuildContext context) {
    if (popUp) {
      return Align(
        alignment: const Alignment(0.0, -0.5),
        child: Padding(
          padding: const EdgeInsets.all(AppSpacings.cardPadding),
          child: ClipRRect(
            borderRadius: AppSpacings.defaultBorderRadius,
            child: Material(
              color: context.appTheme.scaffoldBackgroundColor,
              child: child,
            ),
          ),
        ),
      );
    }

    final bottomInset = MediaQuery.of(context).viewInsets.bottom;
    final screenHeight = MediaQuery.of(context).size.height;
    final availableHeight = screenHeight - bottomInset;
    final maxHeight = math.max(availableHeight * 0.9, 200.0);

    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      children: [
        AnimatedContainer(
          duration: const Duration(milliseconds: 100),
          margin: EdgeInsets.only(bottom: bottomInset),
          constraints: BoxConstraints(maxHeight: maxHeight),
          child: ClipRRect(
            borderRadius: AppSpacings.defaultBorderRadiusTextField.copyWith(
              bottomLeft: Radius.zero,
              bottomRight: Radius.zero,
            ),
            child: Material(
              color: context.appTheme.scaffoldBackgroundColor,
              child: child,
            ),
          ),
        ),
      ],
    );
  }
}
