import 'package:either_dart/either.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/router/router.dart';
import 'package:piyamobile/shared/services/ui_service.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/layouts/device_responsive_view.dart';
import 'package:piyamobile/shared/widgets/layouts/popup_layout.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';

class SheetGenerator {
  const SheetGenerator._();

  static Future<T?> showScrollableSheet<T>(
    BuildContext context, {
    required Widget child,
  }) {
    return showModalBottomSheet<T?>(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacings.defaultBorderRadiusTextField.copyWith(
          bottomLeft: Radius.zero,
          bottomRight: Radius.zero,
        ),
      ),
      useRootNavigator: true,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      isDismissible: true,
      builder: (contextX) {
        return Stack(
          children: [
            GestureDetector(
              onTap: () => Navigator.pop(contextX),
              child: Container(
                color: Colors.transparent,
                width: MediaQuery.of(context).size.width,
                height: MediaQuery.of(context).size.height,
              ),
            ),
            child,
          ],
        );
      },
    );
  }

  static Future<T?> dynamicSheet<T>(
    dynamic providerRef, {
    BuildContext? navigatorContext,
    required Widget child,
    double? width,
    bool? enableDrag,
  }) {
    final Either<WidgetRef, Ref> ref;

    if (providerRef is WidgetRef) {
      ref = Left(providerRef);
    } else {
      ref = Right(providerRef as Ref);
    }

    final routerService = ref.isRight
        ? ref.right.read(appRouterServiceProvider)
        : ref.left.read(appRouterServiceProvider);

    final uiService = ref.isRight
        ? ref.right.read(uiServiceProvider)
        : ref.left.read(uiServiceProvider);

    final context = navigatorContext ?? routerService.appBuildContext!;

    final DeviceDetails deviceType =
        uiService.deviceTypeNotifier.value ??
        DeviceDetails.fromMediaQuery(context);

    if (deviceType.isComputer || deviceType.isTablet) {
      return showCupertinoModalPopup(
        context: context,
        useRootNavigator: true,
        barrierColor: AppColors.black.withAppOpacity(.8),
        builder: (innerContext) => PopupLayout(
          popUp: true,
          child: SizedBox(
            width: width ?? (deviceType.isWidescreen ? 900 : 800),
            child: child,
          ),
        ),
      );
    }

    return showModalBottomSheet<T?>(
      context: context,
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacings.defaultBorderRadius.copyWith(
          bottomLeft: Radius.zero,
          bottomRight: Radius.zero,
        ),
      ),
      enableDrag: enableDrag ?? true,
      useRootNavigator: true,
      backgroundColor: Colors.transparent,
      barrierColor: AppColors.darkBackground.withAppOpacity(.8),
      isScrollControlled: true,
      builder: (contextX) {
        return Stack(
          children: [
            if (enableDrag ?? true)
              GestureDetector(
                onTap: () => Navigator.pop(contextX),
                child: Container(
                  color: Colors.transparent,
                  width: MediaQuery.of(context).size.width,
                  height: MediaQuery.of(context).size.height,
                ),
              ),
            PopupLayout(popUp: false, child: child),
          ],
        );
      },
    );
  }
}
