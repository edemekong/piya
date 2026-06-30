import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';

class PersonalInfoTile extends StatelessWidget {
  final String icon;
  final String value;
  final VoidCallback onEdit;
  final String? actionLabel;

  const PersonalInfoTile({
    super.key,
    required this.icon,
    required this.value,
    required this.onEdit,
    this.actionLabel,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: AppSpacings.elementSpacing),
      child: Row(
        children: [
          SvgPicture.asset(icon, fit: BoxFit.scaleDown),
          const SizedBox(width: AppSpacings.elementSpacing),
          Expanded(
            child: AppTexts.body(value, context, fontWeight: FontWeight.w500),
          ),
          TextButton(
            onPressed: onEdit,
            child: AppTexts.body(
              actionLabel ?? 'Edit',
              context,
              color: AppColors.success,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }
}
