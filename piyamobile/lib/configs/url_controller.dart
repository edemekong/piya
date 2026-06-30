// ignore_for_file: constant_identifier_names

import 'package:piyamobile/configs/app_config.dart';
import 'package:piyamobile/shared/models/location_data.dart';

class URLController {
  late final String _urlPrefix;

  URLController() {
    _urlPrefix = AppFlavorConfigs.instance.config.baseUrl;
  }

  String get baseUrl => _urlPrefix;

  String get requestAuthOTP => "$_urlPrefix/v1/auth/request-otp";
  String get verifyAuthOTP => "$_urlPrefix/v1/auth/verify-otp";
  String get createUser => "$_urlPrefix/v1/users/create";
  String get updateUser => "$_urlPrefix/v1/users/update";
  String user(String id) => "$_urlPrefix/v1/users/fetch/$id";
  String get setupUserAccount => "$_urlPrefix/v1/users/setup-account";
  String get setupRiderAccount => "$_urlPrefix/v1/riders/setup-account";

  static String staticMapUrl({
    required GeoPointData pickup,
    required GeoPointData dropoff,
    String? encodedPolyline,
  }) {
    final pathParam = encodedPolyline != null
        ? '&path=color:0x4285F4FF%7Cweight:4%7Cenc:${Uri.encodeComponent(encodedPolyline)}'
        : '&path=color:0x4285F4FF%7Cweight:4%7C${pickup.lat},${pickup.lng}%7C${dropoff.lat},${dropoff.lng}';

    return 'https://maps.googleapis.com/maps/api/staticmap'
        '?size=600x200'
        '&scale=2'
        '&markers=color:green%7Clabel:P%7C${pickup.lat},${pickup.lng}'
        '&markers=color:red%7Clabel:D%7C${dropoff.lat},${dropoff.lng}'
        '$pathParam'
        '&key=${AppFlavorConfigs.instance.config.mapApiKey}';
  }
}
