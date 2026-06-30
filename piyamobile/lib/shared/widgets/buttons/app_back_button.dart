import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:piyamobile/utils/extensions/primary_extension.dart';

class AppBackButton extends StatelessWidget {
  final VoidCallback onTap;
  final Color? color;
  final String? text;

  const AppBackButton({super.key, required this.onTap, this.color, this.text});

  @override
  Widget build(BuildContext context) {
    final newColor = color ?? Theme.of(context).textTheme.titleLarge?.color;
    return AppToggleButton(
      onTap: onTap,
      child: Container(
        color: Colors.transparent,
        child: Row(
          children: [
            Icon(CupertinoIcons.arrow_left, size: 24, color: newColor),
            const SizedBox(width: AppSpacings.elementSpacing),
            AppTexts.body(
              text ?? 'shared.button.back'.translate(),
              context,
              color: newColor,
            ),
          ],
        ),
      ),
    );
  }
}
