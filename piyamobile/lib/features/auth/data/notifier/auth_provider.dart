// ignore_for_file: constant_identifier_names

import 'dart:async';

import 'package:piyamobile/utils/helpers/response.dart';
import 'package:piyamobile/configs/app_config.dart';
import 'package:piyamobile/features/account/data/models/user.dart';
import 'package:piyamobile/features/account/data/notifiers/user_notifier.dart';
import 'package:piyamobile/features/account/data/repositories/user_repository.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/shared/constants/app_routes.dart';
import 'package:piyamobile/shared/router/router.dart';
import 'package:piyamobile/shared/widgets/app_toast.dart';
import 'package:piyamobile/shared/widgets/layouts/base_page_viewer.dart';
import 'package:piyamobile/utils/helpers/useful_functions.dart';

final authNotifierProvider =
    NotifierProvider<AuthNotifier, DataResult<String?>>(AuthNotifier.new);

class AuthNotifier extends Notifier<DataResult<String?>> with PageViewer {
  static const String REQUEST_EMAIL_AUTH = "request_email_auth";
  static const String VERIFY_EMAIL_OTP = "verify_email";
  static const String VERIFY_PHONE = "verify_phone_number";

  final DataResult<String?> _lastResult = DataResult.initial(
    data: null,
    meta: {
      'isEmailLoading': false,
      'isPhoneLoading': false,
      'emailOTPCodeCountDown': 30,
      'phoneOTPCodeCountDown': 30,
      'isPhoneOTPCodeSent': false,
      "verifyingOTP": false,
      "verifyingPhoneOTP": false,
    },
  );

  Timer? timer;

  late FocusNode phoneFocusNode, emailFocusNode;

  TextEditingController emailController = TextEditingController(),
      emailOTPController = TextEditingController(),
      phoneOTPController = TextEditingController();

  String phoneNumber = '';
  String? _phoneOTPRequestedFor;

  UserRepository get _userRepository => ref.read(userRepositoryProvider);
  UserNotifier get userNotifier => ref.read(userNotifierProvider.notifier);

  bool get isEmailLoading => state.meta['isEmailLoading'] as bool? ?? false;
  bool get isPhoneLoading => state.meta['isPhoneLoading'] as bool? ?? false;
  bool get isVerifyingOTP => state.meta['verifyingOTP'] as bool? ?? false;
  bool get isVerifyingPhoneOTP =>
      state.meta['verifyingPhoneOTP'] as bool? ?? false;
  bool get isPhoneOTPCodeSent =>
      state.meta['isPhoneOTPCodeSent'] as bool? ?? false;

  @override
  List<String> get pages => [
    REQUEST_EMAIL_AUTH,
    VERIFY_EMAIL_OTP,
    VERIFY_PHONE,
  ];

  @override
  DataResult<String?> build() {
    phoneFocusNode = FocusNode();
    emailFocusNode = FocusNode();

    _initializeAuthProvider();
    return _lastResult;
  }

  void _initializeAuthProvider() {
    emailController.addListener(_textListener);
  }

  void _textListener() {
    if (state == _lastResult) return;
    state = _lastResult;
  }

  void _cancelTimer() {
    timer?.cancel();
    timer = null;
  }

  void _startOTPCountdown(String metaKey, {int from = 30}) {
    _cancelTimer();
    state = state.copyWith(meta: {...state.meta, metaKey: from});

    timer = Timer.periodic(const Duration(seconds: 1), (newTimer) {
      final currentCount = state.meta[metaKey] as int? ?? from;
      final next = currentCount - 1;
      state = state.copyWith(meta: {...state.meta, metaKey: next});

      if (next <= 0) {
        state = state.copyWith(meta: {...state.meta, metaKey: 0});
        newTimer.cancel();
        _cancelTimer();
      }
    });
  }

  void _startEmailOTPCountdown({int from = 30}) =>
      _startOTPCountdown('emailOTPCodeCountDown', from: from);
  void _startPhoneOTPCountdown({int from = 30}) =>
      _startOTPCountdown('phoneOTPCodeCountDown', from: from);

  void completeStartPhoneOrEmailSignIn([bool isCodeSent = false]) {
    if (isEmailLoading) {
      state = state.copyWith(meta: {...state.meta, 'isEmailLoading': false});

      if (isCodeSent) {
        animateToPage(VERIFY_EMAIL_OTP);
        _startEmailOTPCountdown();
      }
    }
  }

  Future<void> requestOTPForEmail(BuildContext context) async {
    if (isEmailLoading == false) {
      state = state.copyWith(meta: {...state.meta, 'isEmailLoading': true});
      state = state.copyWith(data: emailController.text.trim());

      await _userRepository.requestOTPForPhoneOrEmail(
        emailController.text.trim(),
        isPhone: false,
        onCodeSent: (code) {
          completeStartPhoneOrEmailSignIn(true);

          if (AppFlavorConfigs.instance.isDevelopment &&
              code != null &&
              int.tryParse(code) != null) {
            Future.delayed(const Duration(milliseconds: 3000), () {
              emailOTPController.text = code;
            });
          }
        },
        onError: (error) {
          completeStartPhoneOrEmailSignIn();

          if (error is FirebaseException) {
            showToast(
              error.message ?? "an error occured",
              ref: ref,
              toastType: AppToastType.error,
            );
          } else if (error is String) {
            showToast(error, ref: ref, toastType: AppToastType.error);
          }
        },
      );
    }
  }

  void _resetPhoneOTPState() {
    _phoneOTPRequestedFor = null;
    phoneOTPController.clear();
    _cancelTimer();
    state = state.copyWith(
      meta: {
        ...state.meta,
        'isPhoneOTPCodeSent': false,
        'phoneOTPCodeCountDown': 30,
        'verifyingPhoneOTP': false,
      },
    );
  }

  void updatePhoneNumber(String phone) {
    final updatedPhone = phone.trim();
    final shouldResetOTP =
        isPhoneOTPCodeSent &&
        updatedPhone != (_phoneOTPRequestedFor ?? phoneNumber);

    phoneNumber = updatedPhone;

    if (shouldResetOTP) {
      _resetPhoneOTPState();
    }
  }

  Future<void> requestOTPForPhone(BuildContext context) async {
    if (isPhoneLoading) return;

    if (phoneNumber.trim().length < 7) {
      showToast(
        "Please enter a valid phone number",
        ref: ref,
        toastType: AppToastType.error,
      );
      return;
    }

    state = state.copyWith(meta: {...state.meta, 'isPhoneLoading': true});

    await _userRepository.requestOTPForPhoneOrEmail(
      phoneNumber.trim(),
      isPhone: true,
      onCodeSent: (code) {
        state = state.copyWith(
          meta: {
            ...state.meta,
            'isPhoneLoading': false,
            'isPhoneOTPCodeSent': true,
          },
        );
        _phoneOTPRequestedFor = phoneNumber.trim();
        _startPhoneOTPCountdown();

        if (AppFlavorConfigs.instance.isDevelopment &&
            code != null &&
            int.tryParse(code) != null) {
          Future.delayed(const Duration(milliseconds: 3000), () {
            phoneOTPController.text = code;
          });
        }
      },
      onError: (error) {
        state = state.copyWith(meta: {...state.meta, 'isPhoneLoading': false});

        if (error is FirebaseException) {
          showToast(
            error.message ?? "an error occured",
            ref: ref,
            toastType: AppToastType.error,
          );
        } else if (error is String) {
          showToast(error, ref: ref, toastType: AppToastType.error);
        }
      },
    );
  }

  Future<void> verifyEmailOTPCode(BuildContext context) async {
    if (isVerifyingOTP) return;

    if (emailOTPController.text.trim().isEmpty ||
        emailOTPController.text.trim().length < 4) {
      showToast(
        "Please enter a valid OTP",
        ref: ref,
        toastType: AppToastType.error,
      );
      return;
    }

    state = state.copyWith(meta: {...state.meta, 'verifyingOTP': true});

    final UserData? userData = await _userRepository.verifyOTP(
      emailOTPController.text.trim(),
      (error) {
        if (error is FirebaseAuthException) {
          showToast(error.message ?? "Something went wrong", ref: ref);
        } else if (error is String) {
          showToast(error, ref: ref);
        }
      },
      emailOrPhone: emailController.text.trim(),
      isPhone: false,
    );

    state = state.copyWith(meta: {...state.meta, 'verifyingOTP': false});

    if (userData != null) {
      _completeAuthenticatedUser(userData);
    }
  }

  Future<void> verifyPhoneOTPCode(BuildContext context) async {
    if (!isPhoneOTPCodeSent) {
      await requestOTPForPhone(context);
      return;
    }

    if (isVerifyingPhoneOTP) return;

    if (phoneOTPController.text.trim().isEmpty ||
        phoneOTPController.text.trim().length < 4) {
      showToast(
        "Please enter a valid OTP",
        ref: ref,
        toastType: AppToastType.error,
      );
      return;
    }

    state = state.copyWith(meta: {...state.meta, 'verifyingPhoneOTP': true});

    final UserData? userData = await _userRepository.verifyAndUpdatePhoneNumber(
      phoneNumber.trim(),
      phoneOTPController.text.trim(),
      (error) {
        if (error is FirebaseAuthException) {
          showToast(error.message ?? "Something went wrong", ref: ref);
        } else if (error is String) {
          showToast(error, ref: ref);
        }
      },
    );

    state = state.copyWith(meta: {...state.meta, 'verifyingPhoneOTP': false});

    if (userData != null) {
      userNotifier.updateNewUser = userData;
      state = state.copyWith(data: userData.email);

      if (!context.mounted) return;
      context.go(AppRoutes.HOME.path);
    }
  }

  void _completeAuthenticatedUser(UserData userData) {
    userNotifier.updateNewUser = userData;
    state = state.copyWith(data: userData.email);

    if (!userData.phoneVerified) {
      ref
          .read(appRouterServiceProvider)
          .go(
            getRoutePath(
              AppRoutes.AUTH.path,
              quary: {'initialPage': VERIFY_PHONE},
            ),
          );
      animateToPage(VERIFY_PHONE);
    }
  }
}
