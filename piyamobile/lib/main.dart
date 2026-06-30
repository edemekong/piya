// ignore_for_file: depend_on_referenced_packages

import 'dart:async';
import 'package:easy_localization/easy_localization.dart';
import 'package:easy_localization_loader/easy_localization_loader.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_web_plugins/url_strategy.dart';
import 'package:piyamobile/app.dart';
import 'package:piyamobile/utils/localizations/app_localizations.dart';

void main() {
  runZonedGuarded<Future<void>>(
    () async {
      usePathUrlStrategy();
      await configureApp();

      return runApp(
        const ProviderScope(child: SetupLocalization(child: PiyaApp())),
      );
    },
    (error, stack) {
      debugPrint(error.toString());
    },
  );
}

class SetupLocalization extends StatelessWidget {
  final Widget child;

  const SetupLocalization({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return EasyLocalization(
      supportedLocales: AppLocalizations.supportedLocales,
      fallbackLocale: const Locale('en', 'US'),
      useOnlyLangCode: true,
      saveLocale: true,
      assetLoader: CsvAssetLoader(),
      path: 'assets/translations.csv',
      child: child,
    );
  }
}
