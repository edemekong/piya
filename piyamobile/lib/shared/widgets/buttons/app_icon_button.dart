import 'package:flutter/material.dart';
import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';

class AppIconButton extends StatelessWidget {
  final Widget icon;
  final Function() onTap;

  const AppIconButton({super.key, required this.onTap, required this.icon});

  @override
  Widget build(BuildContext context) {
    return AppToggleButton(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacings.elementSpacing),
        decoration: BoxDecoration(
          color: Theme.of(context).canvasColor,
          borderRadius: AppSpacings.chipBorderRadius,
        ),
        child: Center(
          child: IconTheme(
            data: IconThemeData(
              color: Theme.of(context).iconTheme.color,
              size: 18,
            ),
            child: icon,
          ),
        ),
      ),
    );
  }
}
