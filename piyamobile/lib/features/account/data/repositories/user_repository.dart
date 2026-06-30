import 'dart:async';
import 'dart:io';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart' as auth;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/configs/app_config.dart';
import 'package:piyamobile/configs/base_api_repository.dart';
import 'package:piyamobile/features/account/data/models/user.dart';
import 'package:piyamobile/shared/constants/db_collection_paths.dart';
import 'package:piyamobile/shared/services/auth_service.dart';
import 'package:piyamobile/utils/extensions/primary_extension.dart';
import 'package:piyamobile/utils/helpers/logs.dart';
import 'package:piyamobile/utils/helpers/useful_functions.dart';

final userRepositoryProvider = Provider<UserRepository>((ref) {
  return UserRepository(ref);
});

class UserRepository extends BaseAPIRepository {
  UserRepository(super.ref);
  final CollectionReference<Map<String, dynamic>> _userFirestore =
      FirebaseFirestore.instance.collection(DBCollectionPaths.users);

  final ValueNotifier<UserData?> currentUserNotifier = ValueNotifier(null);

  StreamSubscription? _userSubscription;

  AuthService get _authService => ref.read(authServiceProvider);
  String? get firebaseUserID => _authService.currentFirebaseUser?.uid;

  Future<UserData?> getCurrentUser(String uid) async {
    try {
      final userSnapshot = await _userFirestore
          .doc(uid)
          .withConverter(
            fromFirestore: (snapshot, options) =>
                UserData.fromMap(snapshot.data()!),
            toFirestore: (value, options) => value.toMap(),
          )
          .get();

      if (userSnapshot.exists) {
        currentUserNotifier.value = userSnapshot.data();
        return userSnapshot.data();
      }
    } catch (e, _) {
      logPrint(e);
    }

    return null;
  }

  Future<void> listenToCurrentUser(
    String uid, {
    Function(UserData newUser)? onUserUpdate,
  }) async {
    try {
      final userSnapshot = _userFirestore.doc(uid).snapshots();

      _userSubscription = userSnapshot.listen((docSnap) async {
        if (docSnap.exists) {
          Map<String, dynamic> data = docSnap.data() as Map<String, dynamic>;
          final UserData user = UserData.fromMap(data);
          currentUserNotifier.value = user;

          if (onUserUpdate != null) onUserUpdate(currentUserNotifier.value!);
        }
      });
    } catch (e, _) {
      logPrint(e);
    }
  }

  Future<UserData?> verifyOTP(
    String code,
    Function(dynamic) onError, {
    required String emailOrPhone,
    required bool isPhone,
  }) async {
    try {
      final countries = await getCountries();
      final existingCode = countries.getPhoneCountry(emailOrPhone);

      Map<String, String> data = {
        "phoneOrEmail": emailOrPhone,
        "dialCode": existingCode ?? '',
        "code": code,
      };

      final responseData = await post(
        Uri.parse(urlController.verifyAuthOTP),
        body: data,
        onError: onError,
      );

      if (responseData?['status'] != 0) {
        onError(responseData?['message'] ?? 'An error occurred');
        return null;
      }

      final responsePayload = responseData?['data'];
      final authToken = responsePayload is Map
          ? responsePayload['authToken'] as String?
          : null;

      if (authToken == null) return null;

      final credential = await _authService.signInWithCustomToken(authToken);
      if (credential == null) return null;

      return getAuthenticatedUser(credential, onError: onError);
    } catch (e) {
      onError(e);
    }

    return null;
  }

  Future<UserData?> getAuthenticatedUser(
    auth.UserCredential userCredential, {
    required Function(dynamic) onError,
    String? name,
  }) async {
    final firebaseUser = userCredential.user;
    if (firebaseUser == null) return null;

    final oldUser = await getCurrentUser(firebaseUser.uid);
    if (oldUser != null) return oldUser;

    return createNewUser(
      firebaseUser.uid,
      email: firebaseUser.email ?? "",
      name: name ?? firebaseUser.displayName ?? "",
      phone: firebaseUser.phoneNumber ?? "",
      profileImageUrl: firebaseUser.photoURL ?? "",
      isEmailVerified: firebaseUser.emailVerified,
      isPhoneVerified: firebaseUser.phoneNumber != null,
      onError: onError,
    );
  }

  Future<void> requestOTPForPhoneOrEmail(
    String phoneOrEmail, {
    required Function(dynamic e) onError,
    Function(String?)? onCodeSent,
    required bool isPhone,
  }) async {
    try {
      final countries = await getCountries();
      final existingCode = countries.getPhoneCountry(phoneOrEmail);

      Map<String, String> data = {
        "phoneOrEmail": phoneOrEmail,
        "dialCode": existingCode ?? '',
        "type": "sms",
      };

      final result = await post(
        Uri.parse(urlController.requestAuthOTP),
        body: data,
        onError: onError,
      );

      if (result != null && result['status'] == 0) {
        if (AppFlavorConfigs.instance.isDevelopment) {
          final code = result['otp_code'] ?? result['data']?['otp_code'] ?? "";
          onCodeSent?.call('$code');
        } else {
          onCodeSent?.call('${result['code']}');
        }
      } else {
        onError(result?['message'] ?? "Failed to send OTP");
      }
    } catch (e) {
      onError(e);
    }
  }

  Future<String?> verifyOTPForPhoneOrEmailUpdate(
    String code,
    Function(dynamic) onError, {
    required String emailOrPhone,
    required bool isPhone,
  }) async {
    final countries = await getCountries();
    final existingCode = countries.getPhoneCountry(emailOrPhone);

    Map<String, String> data = {
      "phoneOrEmail": emailOrPhone,
      "dialCode": existingCode ?? '',
      "code": code,
    };

    final responseData = await post(
      Uri.parse(urlController.verifyAuthOTP),
      body: data,
      withToken: isPhone,
      onError: onError,
    );

    if (responseData?['status'] == 0) return emailOrPhone;

    onError(responseData?['message'] ?? 'An error occurred');
    return null;
  }

  Future<UserData?> verifyAndUpdatePhoneNumber(
    String phoneNumber,
    String code,
    Function(dynamic) onError,
  ) async {
    final currentUser = currentUserNotifier.value;
    if (currentUser == null) {
      onError('Unable to update phone number');
      return null;
    }

    final verifiedPhone = await verifyOTPForPhoneOrEmailUpdate(
      code,
      onError,
      emailOrPhone: phoneNumber,
      isPhone: true,
    );

    if (verifiedPhone == null) return null;

    final updatedUser = currentUser.copyWith(
      phoneNumber: verifiedPhone,
      verification: currentUser.verification.copyWith(phoneVerified: true),
      updatedAt: DateTime.now().toUtc().millisecondsSinceEpoch,
    );

    try {
      final responseData = await post(
        Uri.parse(urlController.createUser),
        body: updatedUser.toMap(),
        withToken: true,
        onError: onError,
      );

      if (responseData?['status'] == 0) {
        final responsePayload = responseData?['data'];
        final userData = responsePayload is Map
            ? responsePayload['user']
            : null;
        final user = userData is Map
            ? UserData.fromMap(userData.cast<String, dynamic>())
            : updatedUser;
        currentUserNotifier.value = user;
        return user;
      }

      onError(responseData?['message'] ?? 'Unable to update phone number');
    } catch (e) {
      onError(e);
    }

    return null;
  }

  Future<UserData?> setupUserAccount({
    required UserAccountType accountType,
    required String name,
    required String dob,
    required GenderType gender,
    required String profileImage,
    required Function(dynamic) onError,
  }) async {
    try {
      final names = name
          .trim()
          .split(RegExp(r'\s+'))
          .where((part) => part.isNotEmpty)
          .toList();

      final responseData = await post(
        Uri.parse(urlController.setupUserAccount),
        body: {
          'accountType': accountType.name,
          'personalInformation': {
            'firstName': names.isEmpty ? name.trim() : names.first,
            'lastName': names.length > 1 ? names.sublist(1).join(' ') : '',
            'dob': dob,
            'gender': gender.name,
            'personalPhoto': profileImage,
          },
        },
        withToken: true,
        onError: onError,
      );

      if (responseData?['status'] == 0) {
        final data = responseData?['data'];
        final userData = data is Map ? data['user'] : responseData?['user'];
        final user = userData is Map
            ? UserData.fromMap(userData.cast<String, dynamic>())
            : null;

        if (user == null) {
          onError('Unable to read updated user');
          return null;
        }

        currentUserNotifier.value = user;
        return user;
      }

      onError(responseData?['message'] ?? 'Unable to update user');
    } catch (e) {
      onError(e);
    }

    return null;
  }

  Future<UserData?> updateUserProfile(
    UserData user, {
    required Function(dynamic) onError,
  }) async {
    try {
      final responseData = await patch(
        Uri.parse(urlController.updateUser),
        body: _profileUpdateBody(user),
        withToken: true,
        onError: onError,
      );

      if (responseData?['status'] == 0) {
        final data = responseData?['data'];
        final userData = data is Map ? data['user'] : responseData?['user'];
        final updatedUser = userData is Map
            ? UserData.fromMap(userData.cast<String, dynamic>())
            : user;

        currentUserNotifier.value = updatedUser;
        return updatedUser;
      }

      onError(responseData?['message'] ?? 'Unable to update user');
    } catch (e) {
      onError(e);
    }

    return null;
  }

  Map<String, dynamic> _profileUpdateBody(UserData user) {
    return _withoutNullValues({
      'name': user.name,
      'profileImageUrl': user.profileImageUrl,
      'dob': user.dob,
      'gender': user.gender?.name,
      'device': user.device.toMap(),
      'settings': user.settings.toMap(),
      'lastKnownLocation': user.lastKnownLocation?.toMap(),
    });
  }

  Map<String, dynamic> _withoutNullValues(Map<String, dynamic> map) {
    final result = <String, dynamic>{};

    for (final entry in map.entries) {
      final value = entry.value;
      if (value == null) continue;

      if (value is Map<String, dynamic>) {
        result[entry.key] = _withoutNullValues(value);
      } else {
        result[entry.key] = value;
      }
    }

    return result;
  }

  Future<UserData?> createNewUser(
    String uid, {
    required String email,
    required String name,
    required String phone,
    required String profileImageUrl,
    required bool isEmailVerified,
    required bool isPhoneVerified,
    UserStatus status = UserStatus.active,
    Function(dynamic)? onError,
  }) async {
    final providers =
        _authService.currentFirebaseUser?.providerData
            .map((provider) => provider.providerId)
            .toList() ??
        const <String>[];

    final now = DateTime.now();
    final user = UserData(
      id: uid,
      email: email,
      phoneNumber: phone.isEmpty ? null : phone,
      accountType: UserAccountType.customer,
      name: name,
      profileImageUrl: profileImageUrl,
      device: DeviceData(
        currentAppVersion: "v1.0.0+1",
        locale: Platform.localeName,
        timezone: TimezoneData(
          timezoneId: now.timeZoneName,
          offset: now.timeZoneOffset.inMilliseconds,
        ),
      ),
      dob: null,
      gender: null,
      business: null,
      verification: VerificationData(
        emailVerified: isEmailVerified,
        phoneVerified: isPhoneVerified,
        authProviders: providers,
      ),
      lastKnownLocation: null,
      settings: const UserSettingsData(
        notifications: NotificationSettingsData(
          enabledPushNotification: true,
          enabledEmailNotification: true,
          enabledSmsNotification: true,
        ),
      ),
      createdAt: now.toUtc().millisecondsSinceEpoch,
      updatedAt: now.toUtc().millisecondsSinceEpoch,
    );

    try {
      final responseData = await post(
        Uri.parse(urlController.createUser),
        body: user.toMap(),
        withToken: true,
        onError: onError,
      );

      final responsePayload = responseData?['data'];
      final userData = responsePayload is Map ? responsePayload['user'] : null;

      if (responseData?['status'] == 0 && userData is Map) {
        final createdUser = UserData.fromMap(userData.cast<String, dynamic>());
        currentUserNotifier.value = createdUser;
        return createdUser;
      }

      onError?.call(responseData?['message'] ?? 'Unable to create user');
    } catch (e) {
      onError?.call(e);
    }

    return null;
  }

  void clearUserSubscription() {
    _userSubscription?.cancel();
    _userSubscription = null;
  }
}
