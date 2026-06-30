// ignore_for_file: depend_on_referenced_packages

import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

abstract class AppLocalizations {
  AppLocalizations(String locale)
    : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
        delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
      ];

  static const List<Locale> supportedLocales = <Locale>[
    Locale('en', 'US'), // English (US) - fully supported
    Locale('sv', 'SE'), // Swedish - custom app localization only
    Locale('fr', 'FR'), // French - fully supported
    Locale('es', 'ES'), // Spanish - fully supported
  ];
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) {
    return <String>['en', 'sv', 'fr', 'es', 'de'].contains(locale.languageCode);
  }

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  return switch (locale.languageCode) {
    'en' => ENLocalizations(),
    'sv' => SVLocalizations(),
    'fr' => FRLocalizations(),
    'es' => ESLocalizations(),
    _ => throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.',
    ),
  };
}

class ENLocalizations extends AppLocalizations {
  ENLocalizations([super.locale = 'en']);
}

class SVLocalizations extends AppLocalizations {
  SVLocalizations([super.locale = 'sv']);
}

class FRLocalizations extends AppLocalizations {
  FRLocalizations([super.locale = 'fr']);
}

class ESLocalizations extends AppLocalizations {
  ESLocalizations([super.locale = 'es']);
}
