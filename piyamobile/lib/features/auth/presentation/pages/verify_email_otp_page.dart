import 'package:piyamobile/features/auth/data/notifier/auth_provider.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/buttons/app_back_button.dart';
import 'package:piyamobile/shared/widgets/buttons/linked_text.dart';
import 'package:piyamobile/shared/widgets/layouts/bottom_padding.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/widgets/textfields/pin_code_widget.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/extensions/primary_extension.dart';

class VerifyEmailOTPPage extends ConsumerStatefulWidget {
  const VerifyEmailOTPPage({super.key});

  @override
  ConsumerState<VerifyEmailOTPPage> createState() => _VerifyEmailOTPPageState();
}

class _VerifyEmailOTPPageState extends ConsumerState<VerifyEmailOTPPage> {
  @override
  Widget build(BuildContext context) {
    final state = ref.watch(authNotifierProvider);

    final String? email = state.data;
    final int emailOTPCodeCountDown =
        state.meta['emailOTPCodeCountDown'] as int? ?? 30;

    final AuthNotifier notifier = ref.read(authNotifierProvider.notifier);
    return Form(
      child: Column(
        children: [
          const SizedBox(height: AppSpacings.cardPadding),
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacings.cardPadding,
            ),
            child: Row(
              children: [
                AppBackButton(onTap: () => notifier.moveToPreviousPage()),
              ],
            ),
          ),
          const SizedBox(height: AppSpacings.cardPadding),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacings.cardPadding,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: AppSpacings.cardPadding),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppTexts.title1(
                        'Enter the 4-Digit Code',
                        context,
                        fontWeight: FontWeight.w600,
                      ),
                      const SizedBox(height: AppSpacings.elementSpacing),
                      Builder(
                        builder: (context) {
                          final pretext = email != null && email.length > 4
                              ? ('${email.take(3)}****${email.substring(email.length - 2)}')
                              : '';
                          return AppTexts.body(
                            'We have sent a code to $pretext',
                            context,
                          );
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacings.elementSpacing),
                  PinCodeWidget(
                    length: 4,
                    isPinInvalid: false,
                    controller: notifier.emailOTPController,
                  ),
                  const SizedBox(height: AppSpacings.cardPadding * 2),
                  AppTexts.bodySecondary(
                    'Resend code in ${emailOTPCodeCountDown}s',
                    context,
                    center: true,
                  ),
                  if (emailOTPCodeCountDown < 2) ...[
                    const SizedBox(height: AppSpacings.elementSpacing * 0.5),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: [
                        AppTexts.bodySecondary('Didn\'t get a code?', context),
                        const SizedBox(width: AppSpacings.elementSpacing * 0.5),
                        LinkedText(
                          link: "Try again",
                          underline: true,
                          onLinkTap: () {
                            if (emailOTPCodeCountDown == 0) {
                              notifier.requestOTPForEmail(context);
                            }
                          },
                        ),
                      ],
                    ),
                  ],
                  const SizedBox(height: AppSpacings.cardPadding),
                  AppPrimaryButton(
                    onPressed: () => notifier.verifyEmailOTPCode(context),
                    state: state.meta['verifyingOTP'] as bool? ?? false
                        ? ButtonState.loading
                        : ButtonState.loaded,
                    title: 'Verify',
                  ),
                ],
              ),
            ),
          ),

          const AppBottomPadding(),
        ],
      ),
    );
  }
}
