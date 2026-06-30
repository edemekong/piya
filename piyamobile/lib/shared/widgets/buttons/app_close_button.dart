import 'package:flutter/material.dart';
import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';

class AppCloseButton extends StatelessWidget {
  final Function() onTap;

  const AppCloseButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return AppToggleButton(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(AppSpacings.elementSpacing),
        decoration: BoxDecoration(
          color: Theme.of(context).unselectedWidgetColor.withAppOpacity(.2),
          borderRadius: AppSpacings.chipBorderRadius,
        ),
        child: const Center(child: Icon(Icons.close, size: 18)),
      ),
    );
  }
}
