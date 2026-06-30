import 'dart:convert';
import 'dart:math';

import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/cupertino.dart';
import 'package:piyamobile/configs/app_config.dart';
import 'package:piyamobile/shared/models/country.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';

extension AppFlavorExtension on AppFlavor {
  String get envFile {
    return switch (this) {
      AppFlavor.dev => '.env.dev',
      AppFlavor.prod => '.env.prod',
    };
  }
}

extension Countries on List<Country> {
  String? getPhoneCountry(String phone) {
    final countries = where(
      (element) =>
          phone.startsWith(element.dial_code) ||
          phone
              .replaceAll('+', '')
              .startsWith(element.dial_code.replaceAll('+', '')),
    ).toList();
    return countries.firstOrNull?.dial_code;
  }
}

extension XString on String {
  String get getRequestLocation {
    final isLink = Uri.tryParse(this)?.hasAbsolutePath ?? false;

    if (isLink) {
      final uri = Uri.parse(this);
      return uri.host.replaceFirst('www.', '');
    } else {
      return this;
    }
  }

  Color get hashColor {
    return Color(RANDOM_COLORS[hashCode % RANDOM_COLORS.length]);
  }

  bool hasLength(int length) {
    return trim().length >= length;
  }

  String get capitalize {
    return split(' ').map((str) => toBeginningOfSentenceCase(str)).join(' ');
  }

  bool get hasUppercase => contains(RegExp(r'[A-Z]'));
  bool get hasLowercase => contains(RegExp(r'[a-z]'));
  bool get hasNumber => contains(RegExp(r'[0-9]'));

  dynamic get tryDecode {
    try {
      return jsonDecode(this);
    } catch (e) {
      return this;
    }
  }

  bool get hasBothUpperAndLowercase => hasLowercase && hasUppercase;

  String get getFirstAndMiddleName {
    String firstName = '';
    final names = split(' ');

    if (names.isNotEmpty) {
      firstName = names[0];

      if (names.length > 1 && names[1] != names.last) {
        firstName = '$firstName ${names[1]}';
      }
    }

    return firstName;
  }

  String get getFirstName {
    String firstName = '';
    final names = split(' ');

    if (names.isNotEmpty) {
      firstName = names[0];
    }

    return firstName;
  }

  String get getLastName {
    String lastName = '';
    final names = split(' ');

    if (names.length > 1) {
      lastName = names.last;
    }

    return lastName;
  }

  bool get hasOnlyNumber {
    final numericRegex = RegExp(r'^\d+$');
    return numericRegex.hasMatch(this);
  }

  String take(int value) => toString().substring(0, min(length, value));

  String get nameInitials {
    String first = '';
    String last = '';

    final names = split(' ');

    if (names.isNotEmpty) {
      first = names[0].isNotEmpty ? names[0].characters.first : '';

      if (names.length > 1) {
        last = names.last.isNotEmpty ? names.last.characters.first : '';
      }
    }

    return ('$first$last').toUpperCase();
  }

  String translate({
    List<String>? args,
    Map<String, String>? namedArgs,
    String? gender,
    BuildContext? context,
  }) {
    final localize = this.tr(
      args: args,
      namedArgs: {...?namedArgs},
      gender: gender,
      context: context,
    );

    return localize.replaceAll(r'\n', '');
  }
}
