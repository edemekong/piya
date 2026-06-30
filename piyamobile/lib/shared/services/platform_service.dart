
// ignore_for_file: library_prefixes

import 'dart:io';
import 'package:flutter/foundation.dart' as kIsWeb;

enum AppPlatform { android, ios, web }

extension DevicePlatform on AppPlatform {
  String toDBString() {
    return toString().split('.')[1].toLowerCase();
  }

  String toDisplayString() {
    return toString().split('.')[1];
  }
}

class AppPlatformService {
  static bool get isIOS => getPlatform == AppPlatform.ios;

  static bool get isAndroid => getPlatform == AppPlatform.android;

  static bool get isWeb => getPlatform == AppPlatform.web;

  static AppPlatform get getPlatform {
    final platform = (() {
      if (kIsWeb.kIsWeb) {
        return AppPlatform.web;
      } else if (Platform.isAndroid) {
        return AppPlatform.android;
      } else if (Platform.isIOS) {
        return AppPlatform.ios;
      } else {
        return AppPlatform.android;
      }
    })();

    return platform;
  }
}
