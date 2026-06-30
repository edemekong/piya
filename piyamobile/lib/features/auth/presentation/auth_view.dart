import 'package:piyamobile/features/auth/data/notifier/auth_provider.dart';
import 'package:piyamobile/features/auth/presentation/pages/request_email_auth_page.dart';
import 'package:piyamobile/features/auth/presentation/pages/verify_email_otp_page.dart';
import 'package:piyamobile/features/auth/presentation/pages/verify_phone_page.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class AuthenticationView extends ConsumerStatefulWidget {
  final String? initialPage;
  const AuthenticationView({super.key, this.initialPage});

  @override
  ConsumerState<AuthenticationView> createState() => _AuthenticationViewState();
}

class _AuthenticationViewState extends ConsumerState<AuthenticationView> {
  @override
  void initState() {
    super.initState();

    final authState = ref.read(authNotifierProvider.notifier);

    authState.initPageViewer(initialPage: widget.initialPage);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.read(authNotifierProvider.notifier);

    return AppScaffold(
      body: SafeArea(
        child: PageView(
          controller: authState.pageViewerController,
          physics: const NeverScrollableScrollPhysics(),
          children: authState.pages.map((page) {
            return switch (page) {
              AuthNotifier.REQUEST_EMAIL_AUTH => const RequestEmailAuthPage(),
              AuthNotifier.VERIFY_PHONE => const VerifyPhoneNumberPage(),
              AuthNotifier.VERIFY_EMAIL_OTP => const VerifyEmailOTPPage(),
              _ => const SizedBox.shrink(),
            };
          }).toList(),
        ),
      ),
    );
  }
}
