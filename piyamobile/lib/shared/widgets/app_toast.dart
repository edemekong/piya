import 'dart:ui';

import 'package:flutter/cupertino.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';

enum AppToastType { success, warning, info, error }

class AppToast extends StatefulWidget {
  final String message;
  final AppToastType toastType;
  final Function() onCancel;

  const AppToast({
    super.key,
    required this.message,
    this.toastType = AppToastType.info,
    required this.onCancel,
  });

  @override
  State<AppToast> createState() => _AppToastState();
}

class _AppToastState extends State<AppToast> {
  @override
  void initState() {
    super.initState();

    switch (widget.toastType) {
      case AppToastType.error:
      case AppToastType.warning:
        HapticFeedback.heavyImpact();
        break;
      case AppToastType.success:
        HapticFeedback.mediumImpact();
        break;
      case AppToastType.info:
        HapticFeedback.lightImpact();
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final success = (
      color: AppColors.success,
      iconData: CupertinoIcons.checkmark_circle,
    );

    const warning = (
      color: AppColors.warning,
      iconData: CupertinoIcons.exclamationmark_triangle,
    );

    final info = (color: AppColors.white, iconData: CupertinoIcons.info_circle);

    final error = (
      color: AppColors.error,
      iconData: CupertinoIcons.xmark_circle,
    );

    final type = switch (widget.toastType) {
      AppToastType.success => success,
      AppToastType.warning => warning,
      AppToastType.error => error,
      AppToastType.info => info,
    };

    return Padding(
      padding: const EdgeInsets.only(
        bottom: kBottomNavigationBarHeight + AppSpacings.elementSpacing,
      ),
      child: ClipRRect(
        borderRadius: AppSpacings.defaultBorderRadius,
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            constraints: BoxConstraints(
              minHeight: kTextTabBarHeight,
              maxWidth: kIsWeb ? 300 : MediaQuery.of(context).size.width,
            ),
            padding: const EdgeInsets.all(AppSpacings.elementSpacing),
            decoration: BoxDecoration(
              color: context.appTheme.shadowColor.withAppOpacity(0.7),
              borderRadius: AppSpacings.defaultBorderRadius,
              border: Border.all(color: type.color, width: 1.5),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(type.iconData, color: type.color),
                const SizedBox(width: AppSpacings.elementSpacing),
                Expanded(
                  child: AppTexts.body(
                    widget.message,
                    context,
                    fontWeight: FontWeight.w500,
                    color: type.color,
                  ),
                ),
                const SizedBox(width: AppSpacings.elementSpacing),
                InkWell(
                  onTap: widget.onCancel,
                  child: Icon(Icons.close, size: 16, color: type.color),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
