import 'package:piyamobile/shared/models/location_data.dart';

enum GenderType { male, female, other }

enum UserStatus { active, inactive, blocked }

enum UserAccountType { customer, rider, admin }

class UserData {
  final String id;
  final String email;
  final String? phoneNumber;
  final UserAccountType? accountType;
  final String name;
  final String profileImageUrl;
  final DeviceData device;
  final String? dob;
  final GenderType? gender;
  final UserBusinessData? business;
  final VerificationData verification;
  final LocationData? lastKnownLocation;
  final UserSettingsData settings;
  final int createdAt;
  final int updatedAt;

  bool get accountSetupComplete {
    return accountType != null && gender != null && dob != null;
  }

  bool get phoneVerified =>
      verification.phoneVerified &&
      phoneNumber != null &&
      phoneNumber!.isNotEmpty;

  const UserData({
    required this.id,
    required this.email,
    required this.phoneNumber,
    required this.accountType,
    required this.name,
    required this.profileImageUrl,
    required this.device,
    required this.dob,
    required this.gender,
    required this.business,
    required this.verification,
    required this.lastKnownLocation,
    required this.settings,
    required this.createdAt,
    required this.updatedAt,
  });

  String get userId => id;

  factory UserData.fromMap(Map<String, dynamic> map) {
    return UserData(
      id: (map['id'] ?? map['userId'] ?? '') as String,
      email: (map['email'] ?? '') as String,
      phoneNumber: map['phoneNumber'] as String?,
      accountType: _enumFromName(
        UserAccountType.values,
        map['accountType'] as String?,
      ),
      name: (map['name'] ?? '') as String,
      profileImageUrl: (map['profileImageUrl'] ?? '') as String,
      device: DeviceData.fromMap(
        (map['device'] as Map?)?.cast<String, dynamic>() ?? const {},
      ),
      dob: map['dob'] as String?,
      gender: _enumFromName(GenderType.values, map['gender'] as String?),
      business: map['business'] == null
          ? null
          : UserBusinessData.fromMap(
              (map['business'] as Map).cast<String, dynamic>(),
            ),
      verification: VerificationData.fromMap(
        ((map['verification'] ?? map['verifications']) as Map?)
                ?.cast<String, dynamic>() ??
            const {},
      ),
      lastKnownLocation: map['lastKnownLocation'] == null
          ? null
          : LocationData.fromMap(
              (map['lastKnownLocation'] as Map).cast<String, dynamic>(),
            ),
      settings: UserSettingsData.fromMap(
        (map['settings'] as Map?)?.cast<String, dynamic>() ?? const {},
      ),
      createdAt: _intValue(map['createdAt']),
      updatedAt: _intValue(map['updatedAt']),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'email': email,
      'phoneNumber': phoneNumber,
      'accountType': accountType?.name,
      'name': name,
      'profileImageUrl': profileImageUrl,
      'device': device.toMap(),
      'dob': dob,
      'gender': gender?.name,
      'business': business?.toMap(),
      'verification': verification.toMap(),
      'lastKnownLocation': lastKnownLocation?.toMap(),
      'settings': settings.toMap(),
      'createdAt': createdAt,
      'updatedAt': updatedAt,
    };
  }

  UserData copyWith({
    String? id,
    String? email,
    String? phoneNumber,
    UserAccountType? accountType,
    String? name,
    String? profileImageUrl,
    DeviceData? device,
    String? dob,
    GenderType? gender,
    UserBusinessData? business,
    VerificationData? verification,
    LocationData? lastKnownLocation,
    UserSettingsData? settings,
    int? createdAt,
    int? updatedAt,
  }) {
    return UserData(
      id: id ?? this.id,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      accountType: accountType ?? this.accountType,
      name: name ?? this.name,
      profileImageUrl: profileImageUrl ?? this.profileImageUrl,
      device: device ?? this.device,
      dob: dob ?? this.dob,
      gender: gender ?? this.gender,
      business: business ?? this.business,
      verification: verification ?? this.verification,
      lastKnownLocation: lastKnownLocation ?? this.lastKnownLocation,
      settings: settings ?? this.settings,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

class DeviceData {
  final String currentAppVersion;
  final String locale;
  final TimezoneData timezone;

  const DeviceData({
    required this.currentAppVersion,
    required this.locale,
    required this.timezone,
  });

  factory DeviceData.fromMap(Map<String, dynamic> map) {
    return DeviceData(
      currentAppVersion: (map['currentAppVersion'] ?? '') as String,
      locale: (map['locale'] ?? '') as String,
      timezone: TimezoneData.fromMap(
        (map['timezone'] as Map?)?.cast<String, dynamic>() ?? const {},
      ),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'currentAppVersion': currentAppVersion,
      'locale': locale,
      'timezone': timezone.toMap(),
    };
  }
}

class TimezoneData {
  final String timezoneId;
  final int offset;

  const TimezoneData({required this.timezoneId, required this.offset});

  factory TimezoneData.fromMap(Map<String, dynamic> map) {
    return TimezoneData(
      timezoneId: (map['timezoneId'] ?? map['name'] ?? '') as String,
      offset: _intValue(map['offset']),
    );
  }

  Map<String, dynamic> toMap() {
    return {'timezoneId': timezoneId, 'offset': offset};
  }
}

class UserSettingsData {
  final NotificationSettingsData notifications;

  const UserSettingsData({required this.notifications});

  factory UserSettingsData.fromMap(Map<String, dynamic> map) {
    return UserSettingsData(
      notifications: NotificationSettingsData.fromMap(
        ((map['notifications'] ?? map) as Map?)?.cast<String, dynamic>() ??
            const {},
      ),
    );
  }

  Map<String, dynamic> toMap() {
    return {'notifications': notifications.toMap()};
  }
}

class NotificationSettingsData {
  final bool enabledPushNotification;
  final bool enabledEmailNotification;
  final bool enabledSmsNotification;

  const NotificationSettingsData({
    required this.enabledPushNotification,
    required this.enabledEmailNotification,
    required this.enabledSmsNotification,
  });

  factory NotificationSettingsData.fromMap(Map<String, dynamic> map) {
    return NotificationSettingsData(
      enabledPushNotification: (map['enabledPushNotification'] ?? true) as bool,
      enabledEmailNotification:
          (map['enabledEmailNotification'] ?? true) as bool,
      enabledSmsNotification: (map['enabledSmsNotification'] ?? true) as bool,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'enabledPushNotification': enabledPushNotification,
      'enabledEmailNotification': enabledEmailNotification,
      'enabledSmsNotification': enabledSmsNotification,
    };
  }
}

class UserBusinessData {
  final List<String> businessIds;
  final Map<String, List<String>> businessRoleTypes;

  const UserBusinessData({
    required this.businessIds,
    required this.businessRoleTypes,
  });

  factory UserBusinessData.fromMap(Map<String, dynamic> map) {
    return UserBusinessData(
      businessIds: List<String>.from(map['businessIds'] ?? const []),
      businessRoleTypes: ((map['businessRoleTypes'] as Map?) ?? const {}).map(
        (key, value) => MapEntry('$key', List<String>.from(value as List)),
      ),
    );
  }

  Map<String, dynamic> toMap() {
    return {'businessIds': businessIds, 'businessRoleTypes': businessRoleTypes};
  }
}

class VerificationData {
  final bool emailVerified;
  final bool phoneVerified;
  final List<String> authProviders;

  const VerificationData({
    required this.emailVerified,
    required this.phoneVerified,
    required this.authProviders,
  });

  factory VerificationData.fromMap(Map<String, dynamic> map) {
    return VerificationData(
      emailVerified: (map['emailVerified'] ?? false) as bool,
      phoneVerified: (map['phoneVerified'] ?? false) as bool,
      authProviders: List<String>.from(
        map['authProviders'] ?? map['providers'] ?? const [],
      ),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'emailVerified': emailVerified,
      'phoneVerified': phoneVerified,
      'authProviders': authProviders,
    };
  }

  VerificationData copyWith({
    bool? emailVerified,
    bool? phoneVerified,
    List<String>? authProviders,
  }) {
    return VerificationData(
      emailVerified: emailVerified ?? this.emailVerified,
      phoneVerified: phoneVerified ?? this.phoneVerified,
      authProviders: authProviders ?? this.authProviders,
    );
  }
}

T? _enumFromName<T extends Enum>(List<T> values, String? name) {
  if (name == null) return null;
  for (final value in values) {
    if (value.name == name) return value;
  }
  return null;
}

int _intValue(dynamic value) {
  if (value is int) return value;
  if (value is num) return value.toInt();
  return int.tryParse('$value') ?? 0;
}
