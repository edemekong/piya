import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:piyamobile/shared/models/country.dart';
import 'package:piyamobile/shared/router/router.dart';
import 'package:piyamobile/shared/widgets/app_toast.dart';

Future<List<Country>> getCountries() async {
  String data = await rootBundle.loadString("assets/jsons/countries.json");
  final jsonResult = jsonDecode(data);

  final countries =
      List.from(jsonResult).map((e) => Country.fromMap(e)).toList()
        ..sort((a, b) => a.name.compareTo(b.name));

  return countries;
}

void showToast(
  String message, {
  required ref,
  AppToastType toastType = AppToastType.info,
  ToastGravity? direction,
}) async {
  final navigationService = ref.read(appRouterServiceProvider);

  final toast = navigationService.toast as FToast;
  toast.removeCustomToast();

  toast.showToast(
    child: AppToast(
      message: message,
      toastType: toastType,
      onCancel: toast.removeCustomToast,
    ),
    gravity:
        direction ?? (!kIsWeb ? ToastGravity.BOTTOM : ToastGravity.TOP_RIGHT),
    toastDuration: const Duration(milliseconds: 2500),
    fadeDuration: const Duration(milliseconds: 300),
  );
}
