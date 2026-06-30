import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:timezone/data/latest.dart' as tz;
import 'package:piyamobile/configs/app_config.dart';
import 'package:piyamobile/shared/router/router.dart';
import 'package:piyamobile/shared/services/shared_preference_service.dart';
import 'package:piyamobile/shared/services/ui_service.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/theme/theme.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';
import 'package:piyamobile/utils/localizations/app_localizations.dart';

Future<void> configureApp([AppFlavor flavor = AppFlavor.dev]) async {
  WidgetsFlutterBinding.ensureInitialized();

  await AppFlavorConfigs.instance.loadEnv(flavor);
  await EasyLocalization.ensureInitialized();
  await Firebase.initializeApp();
  await SharedPreferenceService.initialisePreference();

  tz.initializeTimeZones();
}

class PiyaApp extends ConsumerWidget {
  const PiyaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appRoute = ref.read(appRouterServiceProvider);
    final appTheme = ref.read(appThemeProvider);
    final uiService = ref.read(uiServiceProvider);

    return ValueListenableBuilder<ThemeData>(
      valueListenable: appTheme.themeDataNotifier,
      builder: (context, theme, _) {
        return MaterialApp.router(
          theme: appTheme.themeDataNotifier.value,
          debugShowCheckedModeBanner: false,
          routerConfig: appRoute.routerConfig,
          localizationsDelegates: [
            ...AppLocalizations.localizationsDelegates,
            ...context.localizationDelegates,
          ],
          locale: context.locale,
          supportedLocales: AppLocalizations.supportedLocales,
          shortcuts: {
            LogicalKeySet(LogicalKeyboardKey.space): const ActivateIntent(),
          },
          title: "Piya App",
          builder: (context, widget) => Stack(
            children: [
              Overlay(
                initialEntries: [
                  OverlayEntry(
                    builder: (context) {
                      return widget ?? const SizedBox.shrink();
                    },
                  ),
                ],
              ),
              ValueListenableBuilder<bool>(
                valueListenable: uiService.uiLoading,
                builder: (context, loadingText, _) {
                  if (!loadingText) return const SizedBox();
                  return Container(
                    color: AppColors.white.withAppOpacity(.6),
                    child: const Center(
                      child: CircularProgressIndicator(strokeWidth: 4),
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}
