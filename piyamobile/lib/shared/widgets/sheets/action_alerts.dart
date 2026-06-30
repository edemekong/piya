import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:piyamobile/shared/services/platform_service.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';
import 'package:piyamobile/utils/extensions/primary_extension.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';

class ActionAlert {
  static Future<bool> showAlert({
    required BuildContext context,
    String? title,
    required String content,
    String? yesButtonTitle,
  }) async {
    bool? response;

    final isLight = context.isLight;

    await showDialog(
      context: context,
      barrierColor: AppColors.black.withAppOpacity(.85),
      builder: (context) {
        final platform = AppPlatformService.getPlatform;

        final border = (() {
          if (platform == AppPlatform.ios) return null;

          return WidgetStatePropertyAll(
            RoundedRectangleBorder(
              borderRadius: AppSpacings.defaultBorderRadiusTextField,
              side: BorderSide(color: Theme.of(context).dividerColor),
            ),
          );
        })();

        final Widget yesButton = Padding(
          padding: const EdgeInsets.only(right: AppSpacings.elementSpacing),
          child: TextButton(
            style: ButtonStyle(shape: border),
            child: AppTexts.button(
              yesButtonTitle ?? 'shared.button.yes'.translate(),
              context,
              color: AppColors.secondaryColor,
            ),
            onPressed: () {
              response = true;
              Navigator.pop(context);
            },
          ),
        );

        final Widget noButton = Padding(
          padding: const EdgeInsets.only(left: AppSpacings.elementSpacing),
          child: TextButton(
            style: ButtonStyle(shape: border),
            child: AppTexts.button(
              'shared.button.cancel'.translate(),
              context,
              color: isLight ? AppColors.black : AppColors.white,
            ),
            onPressed: () {
              response = false;
              Navigator.pop(context);
            },
          ),
        );

        if (platform == AppPlatform.android) {
          return AlertDialog(
            backgroundColor: Theme.of(context).cardColor,
            actionsAlignment: MainAxisAlignment.center,
            shape: RoundedRectangleBorder(
              borderRadius: AppSpacings.defaultBorderRadius,
              side: BorderSide(color: Theme.of(context).dividerColor),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSpacings.cardPadding,
              vertical: AppSpacings.elementSpacing,
            ),
            title: Center(
              child: Padding(
                padding: const EdgeInsets.only(
                  bottom: AppSpacings.elementSpacing * 0.5,
                ),
                child: title == null
                    ? null
                    : AppTexts.body(
                        title,
                        context,
                        center: true,
                        fontWeight: FontWeight.w600,
                        color: isLight ? AppColors.black : AppColors.white,
                      ),
              ),
            ),
            content: AppTexts.bodySecondary(
              content,
              context,
              center: true,
              fontWeight: FontWeight.w400,
              color: isLight ? AppColors.black : AppColors.white,
            ),
            actions: <Widget>[yesButton, noButton],
          );
        }

        return CupertinoAlertDialog(
          title: Center(
            child: Padding(
              padding: const EdgeInsets.only(
                bottom: AppSpacings.elementSpacing * 0.5,
              ),
              child: title == null
                  ? null
                  : AppTexts.body(
                      title,
                      context,
                      center: true,
                      fontWeight: FontWeight.w600,
                      color: isLight ? AppColors.black : AppColors.white,
                    ),
            ),
          ),
          content: AppTexts.body(
            content,
            context,
            center: true,
            color: isLight ? AppColors.black : AppColors.white,
          ),
          actions: <Widget>[yesButton, noButton],
        );
      },
    );
    return response ?? false;
  }
}
