import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/features/account/data/notifiers/user_notifier.dart';
import 'package:piyamobile/features/account/data/repositories/user_repository.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/app_toast.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:piyamobile/shared/widgets/layouts/bottom_padding.dart';
import 'package:piyamobile/shared/widgets/paddings.dart';
import 'package:piyamobile/shared/widgets/textfields/pin_code_widget.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/helpers/useful_functions.dart';

class VerifyProfilePhonePage extends ConsumerStatefulWidget {
  final String phoneNumber;

  const VerifyProfilePhonePage({super.key, required this.phoneNumber});

  @override
  ConsumerState<VerifyProfilePhonePage> createState() =>
      _VerifyProfilePhonePageState();
}

class _VerifyProfilePhonePageState
    extends ConsumerState<VerifyProfilePhonePage> {
  final otpController = TextEditingController();
  bool isLoading = false;

  @override
  void dispose() {
    otpController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AppScaffold(
      body: SafeArea(
        child: CardPadding(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppSpacings.cardPadding),
              IconButton(
                padding: EdgeInsets.zero,
                alignment: Alignment.centerLeft,
                onPressed: () => context.pop(),
                icon: const Icon(Icons.arrow_back),
              ),
              const SizedBox(height: AppSpacings.cardPadding),
              AppTexts.title1(
                'Enter the 6-Digit Code',
                context,
                fontWeight: FontWeight.w700,
              ),
              const SizedBox(height: AppSpacings.elementSpacingSmall),
              AppTexts.body(
                'We sent it to ${widget.phoneNumber} via SMS',
                context,
              ),
              const SizedBox(height: AppSpacings.cardPadding),
              PinCodeWidget(
                length: 6,
                isPinInvalid: false,
                controller: otpController,
                onComplete: (_) => _verifyPhone(),
              ),
              const Spacer(),
              AppPrimaryButton(
                onPressed: _verifyPhone,
                state: isLoading ? ButtonState.loading : ButtonState.enabled,
                title: 'Verify',
              ),
              const AppBottomPadding(),
              const SizedBox(height: AppSpacings.elementSpacing),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _verifyPhone() async {
    if (otpController.text.trim().length < 4 || isLoading) return;

    setState(() => isLoading = true);
    final user = await ref
        .read(userRepositoryProvider)
        .verifyAndUpdatePhoneNumber(
          widget.phoneNumber,
          otpController.text.trim(),
          (error) => showToast(
            error is String ? error : 'Unable to verify phone number',
            ref: ref,
            toastType: AppToastType.error,
          ),
        );

    if (user != null) {
      ref.read(userNotifierProvider.notifier).updateNewUser = user;
      await ref.read(userNotifierProvider.notifier).refreshCurrentUser();

      if (!mounted) return;
      context.pop();
      context.pop();
    }

    if (mounted) setState(() => isLoading = false);
  }
}
