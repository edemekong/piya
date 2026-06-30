// ignore_for_file: constant_identifier_names

import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:piyamobile/shared/models/app_config_value.dart';
import 'package:piyamobile/utils/extensions/primary_extension.dart';

const String androidPlayStoreLink = "";
const String appleAppStoreLink = "";

enum AppFlavor { dev, prod }

class AppFlavorConfigs {
  AppFlavorConfigs._();

  AppFlavor flavor = AppFlavor.dev;

  static AppFlavorConfigs? _intance;

  set setFlavor(AppFlavor value) => flavor = value;

  bool get isDevelopment => flavor == AppFlavor.dev;

  Future<void> loadEnv(AppFlavor value) async {
    flavor = value;
    await dotenv.load(fileName: value.envFile);
  }

  static AppFlavorConfigs get instance {
    _intance ??= AppFlavorConfigs._();
    return _intance!;
  }

  AppConfigValues get config => _envConfig;

  AppConfigValues get _envConfig => AppConfigValues(
    mapApiKey: dotenv.env['MAP_API_KEY'] ?? '',
    googlePlacesApiKey: dotenv.env['GOOGLE_PLACES_API_KEY'] ?? '',
    algoliaAppId: dotenv.env['ALGOLIA_APP_ID'] ?? '',
    algoliaSearchKey: dotenv.env['ALGOLIA_SEARCH_KEY'] ?? '',
    agoraAppId: dotenv.env['AGORA_APP_ID'] ?? '',
    clientId: dotenv.env['CLIENT_ID'] ?? '',
    baseUrl: dotenv.env['BASE_URL'] ?? '',
  );
}
