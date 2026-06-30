import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/features/account/data/notifiers/user_notifier.dart';
import 'package:piyamobile/features/account/data/repositories/user_repository.dart';
import 'package:piyamobile/shared/constants/app_routes.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/app_toast.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:piyamobile/shared/widgets/layouts/bottom_padding.dart';
import 'package:piyamobile/shared/widgets/paddings.dart';
import 'package:piyamobile/shared/widgets/textfields/phone_textfield.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/helpers/useful_functions.dart';

class UpdatePhonePage extends ConsumerStatefulWidget {
  const UpdatePhonePage({super.key});

  @override
  ConsumerState<UpdatePhonePage> createState() => _UpdatePhonePageState();
}

class _UpdatePhonePageState extends ConsumerState<UpdatePhonePage> {
  String phoneNumber = '';
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    phoneNumber = ref.read(userNotifierProvider).data?.phoneNumber ?? '';
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(userNotifierProvider).data;

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
                'Update phone number',
                context,
                fontWeight: FontWeight.w700,
              ),
              const SizedBox(height: AppSpacings.elementSpacingSmall),
              AppTexts.body('We will send a confirmation code to it', context),
              const SizedBox(height: AppSpacings.cardPadding),
              PhoneTextField(
                initialPhone: user?.phoneNumber ?? '',
                onPhoneChanged: (phone) => phoneNumber = phone,
              ),
              const Spacer(),
              AppPrimaryButton(
                onPressed: _requestPhoneOtp,
                state: isLoading ? ButtonState.loading : ButtonState.enabled,
                title: 'Save',
              ),
              const AppBottomPadding(),
              const SizedBox(height: AppSpacings.elementSpacing),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _requestPhoneOtp() async {
    if (phoneNumber.trim().length < 7 || isLoading) return;

    setState(() => isLoading = true);
    await ref
        .read(userRepositoryProvider)
        .requestOTPForPhoneOrEmail(
          phoneNumber.trim(),
          isPhone: true,
          onCodeSent: (_) {
            if (!mounted) return;
            context.push(
              AppRoutes.VERIFY_PROFILE_PHONE.path,
              extra: phoneNumber.trim(),
            );
          },
          onError: (error) {
            showToast(
              error is String ? error : 'Unable to send code',
              ref: ref,
              toastType: AppToastType.error,
            );
          },
        );

    if (mounted) setState(() => isLoading = false);
  }
}
