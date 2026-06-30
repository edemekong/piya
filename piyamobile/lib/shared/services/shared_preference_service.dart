import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:piyamobile/utils/helpers/logs.dart';

class SharedPreferenceService {
  static SharedPreferences? _sharedPreferences;

  static Future<void> initialisePreference() async {
    if (_sharedPreferences != null) return;
    try {
      _sharedPreferences = await SharedPreferences.getInstance();
    } catch (e) {
      logPrint('Error initializing SharedPreferences: $e');
    }
  }

  // Set methods
  static Future<void> setString({
    required String key,
    required String value,
  }) async {
    await _sharedPreferences?.setString(key, value);
  }

  static Future<void> setBool({
    required String key,
    required bool value,
  }) async {
    await _sharedPreferences?.setBool(key, value);
  }

  static Future<void> setInt({required String key, required int value}) async {
    await _sharedPreferences?.setInt(key, value);
  }

  static Future<void> setDouble({
    required String key,
    required double value,
  }) async {
    await _sharedPreferences?.setDouble(key, value);
  }

  static Future<void> setStringList({
    required String key,
    required List<String> value,
  }) async {
    await _sharedPreferences?.setStringList(key, value);
  }

  static Future<void> setObject({
    required String key,
    required Object value,
  }) async {
    final jsonString = json.encode(value);
    await _sharedPreferences?.setString(key, jsonString);
  }

  static Future<void> setObjectList({
    required String key,
    required Object value,
  }) async {
    final objectList = getObjectList<Map<String, dynamic>>(
      key: key,
      fromMap: (list) => list,
    );
    List<Map<String, dynamic>> existingList = objectList ?? [];

    if (value is List) {
      existingList.addAll(value.map((item) => item as Map<String, dynamic>));
    } else if (value is Map<String, dynamic>) {
      existingList.add(value);
    } else {
      logPrint(
        'Unsupported value type for setObjectList: ${value.runtimeType}',
      );
      return;
    }
    await _sharedPreferences?.setString(key, json.encode(existingList));
  }

  // Get methods (sync)
  static String? getString({required String key}) {
    return _sharedPreferences?.getString(key);
  }

  static bool getBool({required String key}) {
    if (key.isEmpty) return false;
    return _sharedPreferences?.getBool(key) ?? false;
  }

  static int? getInt({required String key}) {
    return _sharedPreferences?.getInt(key);
  }

  static double? getDouble({required String key}) {
    return _sharedPreferences?.getDouble(key);
  }

  static List<String>? getStringList({required String key}) {
    return _sharedPreferences?.getStringList(key);
  }

  static T? getObject<T>({
    required String key,
    required T Function(Map<String, dynamic>) fromMap,
  }) {
    final jsonString = _sharedPreferences?.getString(key);
    if (jsonString != null) {
      final Map<String, dynamic> map =
          json.decode(jsonString) as Map<String, dynamic>;
      return fromMap(map);
    }
    return null;
  }

  static List<T>? getObjectList<T>({
    required String key,
    required T Function(Map<String, dynamic>) fromMap,
  }) {
    try {
      final jsonString = _sharedPreferences?.getString(key);
      if (jsonString == null) return null;

      final listDynamic = json.decode(jsonString) as List<dynamic>;
      return listDynamic
          .cast<Map<String, dynamic>>()
          .map((map) => fromMap(map))
          .toList();
    } catch (e) {
      logPrint('Error decoding object list for key: $key, Error: $e');
      return null;
    }
  }

  static bool containsKey({required String key}) {
    return _sharedPreferences?.containsKey(key) ?? false;
  }

  // Remove methods
  static Future<void> remove({
    required String key,
    List<String>? values,
  }) async {
    if (values != null && values.isNotEmpty) {
      for (String value in values) {
        await _sharedPreferences?.remove(value);
      }
      return;
    }
    await _sharedPreferences?.remove(key);
  }

  static Future<void> clearAll({List<String> preserveKeys = const []}) async {
    final preservedValues = <String, Object?>{
      for (final key in preserveKeys) key: _sharedPreferences?.get(key),
    };

    await _sharedPreferences?.clear();

    for (final entry in preservedValues.entries) {
      final value = entry.value;
      if (value is String) {
        await _sharedPreferences?.setString(entry.key, value);
      } else if (value is bool) {
        await _sharedPreferences?.setBool(entry.key, value);
      } else if (value is int) {
        await _sharedPreferences?.setInt(entry.key, value);
      } else if (value is double) {
        await _sharedPreferences?.setDouble(entry.key, value);
      } else if (value is List<String>) {
        await _sharedPreferences?.setStringList(entry.key, value);
      }
    }
  }
}
