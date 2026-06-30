import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';

class ProfilePillButton extends StatelessWidget {
  final String icon;
  final String title;
  final VoidCallback onTap;

  const ProfilePillButton({
    super.key,
    required this.icon,
    required this.title,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: AppSpacings.defaultCircularRadius,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(
          vertical: AppSpacings.elementSpacing * 1.2,
        ),
        decoration: BoxDecoration(
          color: Theme.of(context).inputDecorationTheme.fillColor,
          borderRadius: AppSpacings.defaultCircularRadius,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SvgPicture.asset(icon, fit: BoxFit.scaleDown),
            const SizedBox(width: AppSpacings.elementSpacingSmall),
            AppTexts.body(
              title,
              context,
              color: AppColors.primaryColor,
              fontWeight: FontWeight.w600,
            ),
          ],
        ),
      ),
    );
  }
}
