import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/constants/app_routes.dart';
import 'package:piyamobile/shared/services/platform_service.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/paddings.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';

class AppBottomNavigationBar extends ConsumerStatefulWidget {
  final StatefulNavigationShell shell;

  final bool hasKeyboard;
  const AppBottomNavigationBar({
    super.key,
    required this.shell,
    required this.hasKeyboard,
  });
  @override
  ConsumerState<ConsumerStatefulWidget> createState() =>
      _AppBottomNavigationBarState();
}

class _AppBottomNavigationBarState
    extends ConsumerState<AppBottomNavigationBar> {
  @override
  Widget build(BuildContext context) {
    final bool hasKeyboard = widget.hasKeyboard;

    final StatefulNavigationShell shell = widget.shell;
    final String? currentPath = GoRouterState.of(context).fullPath;

    return Builder(
      builder: (context) {
        final List<String> paths = [
          AppRoutes.HOME.path,
          AppRoutes.DELIVERY.path,
          AppRoutes.ACCOUNT.path,
        ];

        return Container(
          color: context.appTheme.cardColor,
          height: (() {
            if (hasKeyboard) return kToolbarHeight * 0.8;

            final platform = AppPlatformService.getPlatform;
            final height =
                kBottomNavigationBarHeight +
                MediaQuery.viewPaddingOf(context).bottom;

            return switch (platform) {
              AppPlatform.ios => height + AppSpacings.elementSpacing * 1.5,
              _ => height + (AppSpacings.elementSpacing * 1.5),
            };
          })(),
          child: Column(
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Divider(
                height: 0,
                thickness: 0.25,
                color: context.appTheme.dividerColor,
              ),
              const SizedBox(height: AppSpacings.elementSpacing * 0.5),
              Center(
                child: ElementPadding(
                  child: CardPadding(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: paths.indexed.map((e) {
                        final String path = e.$2;
                        final int page = e.$1;

                        final int pageIndex = shell.route.branches.indexWhere(
                          (branch) => branch.initialLocation == path,
                        );

                        final isCurrentPath = currentPath == path;

                        final bool active = isCurrentPath;

                        final bool grey = !active && hasKeyboard;
                        final color = grey
                            ? context.appTheme.iconTheme.color
                            : (active
                                  ? context.appTheme.primaryColor
                                  : Theme.of(context)
                                        .textTheme
                                        .headlineMedium!
                                        .color
                                        ?.withAppOpacity(0.8));

                        final data = getNavigationBarIcon(
                          ref,
                          context,
                          path,
                          active: active,
                          color: color,
                        );

                        return AppToggleButton(
                          onTap: () => shell.goBranch(
                            pageIndex,
                            initialLocation: page == shell.currentIndex,
                          ),
                          child: Builder(
                            builder: (context) {
                              if (hasKeyboard) {
                                return Row(
                                  children: [
                                    SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: data.icon,
                                    ),
                                    const SizedBox(
                                      width: AppSpacings.elementSpacing * 0.25,
                                    ),
                                    AppTexts.caption1(
                                      data.name,
                                      context,
                                      color: color,
                                    ),
                                  ],
                                );
                              }
                              return Column(
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(
                                      top: AppSpacings.elementSpacing * 0.8,
                                      bottom: AppSpacings.elementSpacing * 0.8,
                                    ),
                                    child: data.icon,
                                  ),
                                  AppTexts.caption1(
                                    data.name,
                                    context,
                                    color: color,
                                    fontWeight: active
                                        ? FontWeight.w600
                                        : FontWeight.w400,
                                  ),
                                ],
                              );
                            },
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

({String name, Widget icon}) getNavigationBarIcon(
  WidgetRef ref,
  BuildContext context,
  String path, {
  bool active = false,
  Color? color,
}) {
  final route = AppRoutes.values
      .where((route) => path == route.path)
      .firstOrNull;

  final newColor =
      color ??
      (active ? context.appTheme.primaryColor : context.appTheme.disabledColor);
  const double size = 26.0;

  final ({Widget icon, String name}) data = switch (route) {
    AppRoutes.HOME => (
      name: 'Home',
      icon: Icon(
        active ? CupertinoIcons.house_alt_fill : CupertinoIcons.house_alt,
        color: newColor,
        size: size,
      ),
    ),
    AppRoutes.DELIVERY => (
      name: 'Rides',
      icon: Icon(
        active ? CupertinoIcons.heart_fill : CupertinoIcons.heart,
        color: newColor,
        size: size,
      ),
    ),
    AppRoutes.ACCOUNT || _ => (
      name: 'Account',
      icon: Icon(
        active
            ? CupertinoIcons.person_2_square_stack_fill
            : CupertinoIcons.person_2_square_stack,
        color: newColor,
        size: size,
      ),
    ),
  };

  return data;
}
