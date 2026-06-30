import 'dart:async';

import 'package:flutter/cupertino.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/features/account/data/models/user.dart';
import 'package:piyamobile/features/account/data/repositories/user_repository.dart';
import 'package:piyamobile/shared/models/location_data.dart';
import 'package:piyamobile/shared/constants/storage_keys.dart';
import 'package:piyamobile/shared/router/router.dart';
import 'package:piyamobile/shared/services/auth_service.dart';
import 'package:piyamobile/shared/services/shared_preference_service.dart';
import 'package:piyamobile/shared/services/ui_service.dart';
import 'package:piyamobile/utils/helpers/logs.dart';
import 'package:piyamobile/utils/helpers/response.dart';

final userNotifierProvider =
    NotifierProvider<UserNotifier, DataResult<UserData?>>(UserNotifier.new);

class UserNotifier extends Notifier<DataResult<UserData?>>
    with WidgetsBindingObserver {
  final DataResult<UserData?> _lastResult = DataResult.initial(data: null);

  ValueNotifier<bool> isCurrentUserProfileLoading = ValueNotifier(false);
  ValueNotifier<bool> isUserAvailable = ValueNotifier<bool>(false);

  ValueNotifier<LocationData?> userLocationNotifier =
      ValueNotifier<LocationData?>(null);

  bool _launchSetUp = true, _fetchUserDocumentComplete = false;

  AuthService get _authService => ref.read(authServiceProvider);
  UserRepository get userRepository => ref.read(userRepositoryProvider);
  AppRouter get appRouterService => ref.read(appRouterServiceProvider);
  UIService get uiService => ref.read(uiServiceProvider);

  @override
  DataResult<UserData?> build() {
    WidgetsBinding.instance.addObserver(this);
    _initializeUser();
    return _lastResult;
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    switch (state) {
      case AppLifecycleState.resumed:
      case AppLifecycleState.paused:
      case AppLifecycleState.inactive:
      case AppLifecycleState.detached:
        break;
      default:
    }
  }

  set updateNewUser(UserData? user) {
    state = state.copyWith(data: user);
    userRepository.currentUserNotifier.value = user;
  }

  Future<void> _initializeUser() async {
    _authService.userAuthStream(
      userOnChanged: (firebaseUser) async {
        if (firebaseUser == null) {
          logPrint("USER IS NOT AUTHENTICATED");

          isCurrentUserProfileLoading.value = false;

          _onUserEvent(null);
          return;
        }

        logPrint("USER IS AUTHENTICATED: ${firebaseUser.uid}");
        isCurrentUserProfileLoading.value = true;

        await _fetchUserDocuments(firebaseUser.uid);
      },
    );

    userRepository.currentUserNotifier.addListener(() async {
      final UserData? user = userRepository.currentUserNotifier.value;

      if (_fetchUserDocumentComplete == false && user != null) {
        _fetchUserDocumentComplete = true;
        await _fetchUserDocuments(user.userId);
      }
    });
  }

  Future<void> _fetchUserDocuments(String uid) async {
    final user = await userRepository.getCurrentUser(uid);

    isCurrentUserProfileLoading.value = false;
    state = state.copyWith(data: user);

    if (user != null) _onUserEvent(user);
  }

  Future<void> refreshCurrentUser() async {
    final uid = _authService.currentFirebaseUser?.uid ?? state.data?.userId;
    if (uid == null || uid.isEmpty) return;

    isCurrentUserProfileLoading.value = true;
    await _fetchUserDocuments(uid);
  }

  Future<UserData?> updateCurrentUser(
    UserData user, {
    required Function(dynamic) onError,
  }) async {
    state = state.copyWith(state: ResultState.loading);

    final updatedUser = await userRepository.updateUserProfile(
      user,
      onError: onError,
    );

    if (updatedUser != null) {
      updateNewUser = updatedUser;
      await refreshCurrentUser();
    }

    state = state.copyWith(
      data: updatedUser ?? state.data,
      state: ResultState.idle,
    );
    return updatedUser;
  }

  Future<void> _onUserEvent(UserData? user) async {
    if (user != null) {
      isUserAvailable.value = true;

      if (_launchSetUp) {
        _launchSetUp = false;
        _appStartUserAvailable(user);
      }

      userRepository.listenToCurrentUser(
        user.userId,
        onUserUpdate: (user) => updateNewUser = user,
      );
    }
  }

  Future<void> logoutCurrentUser(Function() onDone) async {
    final result = await _authService.signOut();
    if (result) {
      isUserAvailable.value = false;

      _clearUserCachedData();

      userRepository.currentUserNotifier.value = null;
      updateNewUser = null;

      onDone();
    }
  }

  Future<void> _appStartUserAvailable(UserData user) async {}

  void _clearUserCachedData() {
    SharedPreferenceService.clearAll(preserveKeys: [LocalStorageKeys.themeKey]);
    userRepository.clearUserSubscription();
  }
}
