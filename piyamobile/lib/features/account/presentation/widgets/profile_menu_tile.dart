import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_svg/svg.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';

class ProfileMenuTile extends StatelessWidget {
  final String icon;
  final String title;
  final VoidCallback onTap;
  final Color? color;

  const ProfileMenuTile({
    super.key,
    required this.icon,
    required this.title,
    required this.onTap,
    this.color,
  });

  @override
  Widget build(BuildContext context) {
    final tileColor = color ?? Theme.of(context).textTheme.bodyMedium?.color;

    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: AppSpacings.cardPadding),
        child: Row(
          children: [
            SvgPicture.asset(
              icon,
              fit: BoxFit.scaleDown,
              colorFilter: tileColor == null
                  ? null
                  : ColorFilter.mode(tileColor, BlendMode.srcIn),
            ),
            const SizedBox(width: AppSpacings.elementSpacing),
            Expanded(
              child: AppTexts.body(
                title,
                context,
                color: tileColor,
                fontWeight: FontWeight.w500,
              ),
            ),
            Icon(CupertinoIcons.chevron_right, size: 18, color: tileColor),
          ],
        ),
      ),
    );
  }
}
