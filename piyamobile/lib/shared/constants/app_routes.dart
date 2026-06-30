// ignore_for_file: constant_identifier_names

enum AppRoutes {
  APP_LOADING('app_loading', '/loading'),
  ONBOARDING('onboarding', '/onboarding'),
  HOME('home', '/home'),
  DELIVERY('delivery', '/delivery'),
  AUTH('auth', '/auth'),
  ACCOUNT('account', '/account'),
  PERSONAL_INFO('personal_info', '/account/personal-info'),
  UPDATE_NAME('update_name', '/account/personal-info/name'),
  UPDATE_PHONE('update_phone', '/account/personal-info/phone'),
  UPDATE_EMAIL('update_email', '/account/personal-info/email'),
  VERIFY_PROFILE_PHONE(
    'verify_profile_phone',
    '/account/personal-info/phone/verify',
  );

  const AppRoutes(this.id, this.path);

  final String id;
  final String path;
}
