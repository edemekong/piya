import 'package:piyamobile/features/auth/data/notifier/auth_provider.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/buttons/app_back_button.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/widgets/textfields/pin_code_widget.dart';
import 'package:piyamobile/shared/widgets/textfields/phone_textfield.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/helpers/response.dart';

class VerifyPhoneNumberPage extends ConsumerStatefulWidget {
  const VerifyPhoneNumberPage({super.key});

  @override
  ConsumerState<VerifyPhoneNumberPage> createState() =>
      _VerifyPhoneNumberPageState();
}

class _VerifyPhoneNumberPageState extends ConsumerState<VerifyPhoneNumberPage> {
  @override
  Widget build(BuildContext context) {
    final AuthNotifier notifier = ref.read(authNotifierProvider.notifier);
    final DataResult state = ref.watch(authNotifierProvider);

    return ListenableBuilder(
      listenable: Listenable.merge([
        notifier.phoneFocusNode,
        notifier.phoneOTPController,
      ]),
      builder: (context, child) {
        final bool isPhoneOTPCodeSent =
            (state.meta['isPhoneOTPCodeSent'] as bool? ?? false);
        final bool isPhoneLoading =
            state.meta['isPhoneLoading'] as bool? ?? false;
        final bool isVerifyingPhoneOTP =
            state.meta['verifyingPhoneOTP'] as bool? ?? false;

        return Padding(
          padding: EdgeInsets.symmetric(horizontal: AppSpacings.cardPadding),
          child: Form(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.start,
                children: [
                  SizedBox(
                    height:
                        MediaQuery.of(context).viewPadding.top +
                        AppSpacings.cardPadding,
                  ),
                  AppBackButton(onTap: () => notifier.moveToPreviousPage()),
                  SizedBox(height: AppSpacings.cardPadding * 2),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppTexts.title1(
                        "Let's verify your Phone Number",
                        context,
                        fontWeight: FontWeight.w600,
                      ),
                      const SizedBox(height: AppSpacings.elementSpacing),
                      AppTexts.body(
                        'We will send a confirmation code to it',
                        context,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacings.cardPadding),
                  PhoneTextField(
                    focusNode: notifier.phoneFocusNode,
                    onPhoneChanged: notifier.updatePhoneNumber,
                  ),
                  if (isPhoneOTPCodeSent) ...[
                    const SizedBox(height: AppSpacings.cardPadding * 2),
                    AppTexts.title3(
                      "Verify Phone Number",
                      context,
                      fontWeight: FontWeight.w600,
                    ),
                    const SizedBox(height: AppSpacings.elementSpacing),
                    AppTexts.body(
                      'Enter the 4-digit code sent to your phone',
                      context,
                    ),
                    const SizedBox(height: AppSpacings.elementSpacing),
                    PinCodeWidget(
                      length: 4,
                      isPinInvalid: false,
                      controller: notifier.phoneOTPController,
                      onComplete: (_) => notifier.verifyPhoneOTPCode(context),
                    ),
                  ],
                  const SizedBox(height: AppSpacings.cardPadding * 2),
                  AppPrimaryButton(
                    state: (isPhoneLoading || isVerifyingPhoneOTP)
                        ? ButtonState.loading
                        : ButtonState.loaded,
                    onPressed: () => notifier.verifyPhoneOTPCode(context),
                    title: isPhoneOTPCodeSent ? 'Verify' : 'Continue',
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
