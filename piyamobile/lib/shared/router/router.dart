import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/features/account/data/models/user.dart';
import 'package:piyamobile/features/account/data/notifiers/user_notifier.dart';
import 'package:piyamobile/features/account/presentation/pages/personal_info_page.dart';
import 'package:piyamobile/features/account/presentation/pages/profile_page.dart';
import 'package:piyamobile/features/account/presentation/pages/update_email_page.dart';
import 'package:piyamobile/features/account/presentation/pages/update_name_page.dart';
import 'package:piyamobile/features/account/presentation/pages/update_phone_page.dart';
import 'package:piyamobile/features/account/presentation/pages/verify_profile_phone_page.dart';
import 'package:piyamobile/features/auth/data/notifier/auth_provider.dart';
import 'package:piyamobile/features/auth/presentation/auth_view.dart';
import 'package:piyamobile/features/onboarding/presentation/onboarding_screen.dart';
import 'package:piyamobile/shared/constants/app_routes.dart';
import 'package:piyamobile/shared/constants/storage_keys.dart';
import 'package:piyamobile/shared/services/auth_service.dart';
import 'package:piyamobile/shared/services/platform_service.dart';
import 'package:piyamobile/shared/services/shared_preference_service.dart';
import 'package:piyamobile/shared/widgets/screens/app_loading_screen.dart';
import 'package:piyamobile/shared/widgets/tab_wrapper/tab_wrapper.dart';
import 'package:piyamobile/utils/helpers/logs.dart';

final appRouterServiceProvider = Provider<AppRouter>((ref) {
  return AppRouter(ref);
});

class AppRouter {
  final Ref ref;

  late GlobalKey<NavigatorState> navigationKey;
  late FToast toast;

  StatefulNavigationShell? navigationShell;

  AuthService get _authService => ref.read(authServiceProvider);
  UserNotifier get _userNotifier => ref.read(userNotifierProvider.notifier);
  BuildContext? get appBuildContext => navigationKey.currentState?.context;

  int? getBranchIndexByPath(String path) {
    final branches =
        navigationShell?.route.branches
            .map((e) => e.initialLocation!)
            .toList() ??
        [];

    final int index = branches.indexWhere((p) => p == path);

    return index != -1 ? index : null;
  }

  void goToBranchByPath(String path, {Function()? onNotFound}) {
    final index = getBranchIndexByPath(path);

    if (index != null) {
      navigationShell?.goBranch(index);
    }
  }

  AppRouter(this.ref) {
    navigationKey = GlobalKey<NavigatorState>();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      Future.delayed(const Duration(milliseconds: 2000), () {
        if (navigationKey.currentContext != null) {
          _initToast(navigationKey.currentContext!);
        }
      });
    });
  }

  void _initToast(BuildContext context) {
    toast = FToast();
    toast = toast.init(context);
  }

  GoRouter get routerConfig {
    return GoRouter(
      navigatorKey: navigationKey,
      refreshListenable: Listenable.merge([_userNotifier.isUserAvailable]),
      initialLocation: AppRoutes.ONBOARDING.path,
      redirect: (context, state) {
        final authUser = _authService.currentFirebaseUser;
        final UserData? userData =
            _userNotifier.userRepository.currentUserNotifier.value;

        logPrint(
          "GoRouter redirect called with path: ${state.uri.path}, authUser: ${authUser != null}, userData: ${userData != null}",
        );

        final String path = state.uri.path;
        final String currentLocation = state.uri.toString();
        final String authVerifyPhonePath = getRoutePath(
          AppRoutes.AUTH.path,
          quary: {'initialPage': AuthNotifier.VERIFY_PHONE},
        );

        String? redirectTo(String target) {
          final targetUri = Uri.parse(target);
          final isSameLocation = currentLocation == target;
          final isSamePathWithoutQuery =
              targetUri.query.isEmpty && path == targetUri.path;

          return isSameLocation || isSamePathWithoutQuery ? null : target;
        }

        final bool isLoadingRoute = path == AppRoutes.APP_LOADING.path;
        final bool isOnboardingRoutes = [
          AppRoutes.ONBOARDING.path,
          AppRoutes.AUTH.path,
          AppRoutes.APP_LOADING.path,
        ].contains(path);
        final bool isOnboardingComplete = SharedPreferenceService.getBool(
          key: LocalStorageKeys.onboardingCompletedKey,
        );

        if (authUser != null) {
          if (userData == null) {
            return isLoadingRoute
                ? null
                : redirectTo(AppRoutes.APP_LOADING.path);
          }

          if (!userData.phoneVerified) {
            final isVerifyPhoneRoute =
                path == AppRoutes.AUTH.path &&
                state.uri.queryParameters['initialPage'] ==
                    AuthNotifier.VERIFY_PHONE;

            return isVerifyPhoneRoute ? null : redirectTo(authVerifyPhonePath);
          }

          if (isOnboardingRoutes) {
            return redirectTo(AppRoutes.HOME.path);
          }
          return null;
        }

        if (!isOnboardingComplete) {
          return path == AppRoutes.ONBOARDING.path
              ? null
              : redirectTo(AppRoutes.ONBOARDING.path);
        }

        if (path == AppRoutes.ONBOARDING.path) {
          return redirectTo(AppRoutes.AUTH.path);
        }

        if (path == AppRoutes.AUTH.path) {
          return null;
        }

        return redirectTo(AppRoutes.AUTH.path);
      },
      routes: [
        StatefulShellRoute.indexedStack(
          parentNavigatorKey: navigationKey,
          builder: (context, state, navigationShell) {
            this.navigationShell = navigationShell;
            return TabWrapper(navigationShell: navigationShell);
          },
          branches: [
            StatefulShellBranch(
              initialLocation: AppRoutes.HOME.path,
              routes: [
                GoRoute(
                  path: AppRoutes.HOME.path,
                  name: AppRoutes.HOME.name,
                  pageBuilder: (context, state) {
                    return buildPlatformPage(
                      const Scaffold(),
                      key: state.pageKey,
                      name: state.name,
                    );
                  },
                ),
              ],
            ),
            StatefulShellBranch(
              initialLocation: AppRoutes.DELIVERY.path,
              routes: [
                GoRoute(
                  path: AppRoutes.DELIVERY.path,
                  name: AppRoutes.DELIVERY.name,
                  pageBuilder: (context, state) {
                    return buildPlatformPage(
                      const Scaffold(),
                      key: state.pageKey,
                      name: state.name,
                    );
                  },
                ),
              ],
            ),
            StatefulShellBranch(
              initialLocation: AppRoutes.ACCOUNT.path,
              routes: [
                GoRoute(
                  path: AppRoutes.ACCOUNT.path,
                  name: AppRoutes.ACCOUNT.name,
                  pageBuilder: (context, state) {
                    return buildPlatformPage(
                      const ProfilePage(),
                      key: state.pageKey,
                      name: state.name,
                    );
                  },
                ),
              ],
            ),
          ],
        ),
        GoRoute(
          parentNavigatorKey: navigationKey,
          name: AppRoutes.PERSONAL_INFO.name,
          path: AppRoutes.PERSONAL_INFO.path,
          pageBuilder: (context, state) {
            return buildPlatformPage(
              const PersonalInfoPage(),
              key: state.pageKey,
              name: state.name,
            );
          },
        ),
        GoRoute(
          parentNavigatorKey: navigationKey,
          name: AppRoutes.UPDATE_NAME.name,
          path: AppRoutes.UPDATE_NAME.path,
          pageBuilder: (context, state) {
            return buildPlatformPage(
              const UpdateNamePage(),
              key: state.pageKey,
              name: state.name,
            );
          },
        ),
        GoRoute(
          parentNavigatorKey: navigationKey,
          name: AppRoutes.UPDATE_PHONE.name,
          path: AppRoutes.UPDATE_PHONE.path,
          pageBuilder: (context, state) {
            return buildPlatformPage(
              const UpdatePhonePage(),
              key: state.pageKey,
              name: state.name,
            );
          },
        ),
        GoRoute(
          parentNavigatorKey: navigationKey,
          name: AppRoutes.UPDATE_EMAIL.name,
          path: AppRoutes.UPDATE_EMAIL.path,
          pageBuilder: (context, state) {
            return buildPlatformPage(
              const UpdateEmailPage(),
              key: state.pageKey,
              name: state.name,
            );
          },
        ),
        GoRoute(
          parentNavigatorKey: navigationKey,
          name: AppRoutes.VERIFY_PROFILE_PHONE.name,
          path: AppRoutes.VERIFY_PROFILE_PHONE.path,
          pageBuilder: (context, state) {
            return buildPlatformPage(
              VerifyProfilePhonePage(phoneNumber: state.extra as String? ?? ''),
              key: state.pageKey,
              name: state.name,
            );
          },
        ),
        GoRoute(
          parentNavigatorKey: navigationKey,
          name: AppRoutes.APP_LOADING.name,
          path: AppRoutes.APP_LOADING.path,
          pageBuilder: (context, state) {
            return buildPlatformPage(
              const AppLoadingScreen(),
              key: state.pageKey,
              name: state.name,
            );
          },
        ),
        GoRoute(
          parentNavigatorKey: navigationKey,
          name: AppRoutes.ONBOARDING.name,
          path: AppRoutes.ONBOARDING.path,
          pageBuilder: (context, state) {
            return buildPlatformPage(
              const OnboardingScreen(),
              key: state.pageKey,
              name: state.name,
            );
          },
        ),

        GoRoute(
          parentNavigatorKey: navigationKey,
          name: AppRoutes.AUTH.name,
          path: AppRoutes.AUTH.path,
          pageBuilder: (context, state) {
            return buildPlatformPage(
              AuthenticationView(
                initialPage: state.uri.queryParameters['initialPage'],
              ),
              key: state.pageKey,
              name: state.name,
            );
          },
        ),
      ],
    );
  }

  Page buildPlatformPage(
    Widget page, {
    LocalKey? key,
    String? name,
    bool maintainState = true,
    bool fullscreenDialog = false,
  }) {
    if (AppPlatformService.isIOS) {
      return CupertinoPage(
        key: key,
        name: name,
        child: page,
        maintainState: maintainState,
        fullscreenDialog: fullscreenDialog,
      );
    } else {
      return MaterialPage(
        key: key,
        name: name,
        child: page,
        maintainState: maintainState,
        fullscreenDialog: fullscreenDialog,
      );
    }
  }

  void goNamed(String name, {Map<String, String>? queryParameters}) {
    if (appBuildContext != null) {
      appBuildContext!.goNamed(name, queryParameters: queryParameters ?? {});
    }
  }

  void go(String path) {
    if (appBuildContext != null) {
      appBuildContext!.go(path);
    }
  }

  void pushNamed(String name, {Map<String, String>? queryParameters}) {
    if (appBuildContext != null) {
      appBuildContext!.pushNamed(name, queryParameters: queryParameters ?? {});
    }
  }
}

String getRoutePath(String path, {Map<String, dynamic> quary = const {}}) {
  return Uri(path: path, queryParameters: quary).toString();
}
