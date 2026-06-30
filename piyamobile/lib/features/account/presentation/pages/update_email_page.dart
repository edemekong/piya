import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/features/account/data/notifiers/user_notifier.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/app_toast.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:piyamobile/shared/widgets/layouts/bottom_padding.dart';
import 'package:piyamobile/shared/widgets/paddings.dart';
import 'package:piyamobile/shared/widgets/textfields/app_textfield.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/helpers/useful_functions.dart';
import 'package:piyamobile/utils/validations.dart';

class UpdateEmailPage extends ConsumerStatefulWidget {
  const UpdateEmailPage({super.key});

  @override
  ConsumerState<UpdateEmailPage> createState() => _UpdateEmailPageState();
}

class _UpdateEmailPageState extends ConsumerState<UpdateEmailPage> {
  final formKey = GlobalKey<FormState>();
  late final TextEditingController emailController;

  @override
  void initState() {
    super.initState();
    emailController = TextEditingController(
      text: ref.read(userNotifierProvider).data?.email ?? '',
    );
  }

  @override
  void dispose() {
    emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(userNotifierProvider);
    final verified = state.data?.verification.emailVerified == true;

    return AppScaffold(
      body: SafeArea(
        child: Form(
          key: formKey,
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
                  'Your email',
                  context,
                  fontWeight: FontWeight.w700,
                ),
                const SizedBox(height: AppSpacings.cardPadding),
                AppPrimaryTextfield(
                  controller: emailController,
                  keyboardType: TextInputType.emailAddress,
                  validator: AppValidations.validatedEmail,
                  suffixIcon: verified
                      ? Padding(
                          padding: const EdgeInsets.only(
                            right: AppSpacings.elementSpacing,
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              AppTexts.caption1(
                                'Verified',
                                context,
                                color: AppColors.success,
                              ),
                              const SizedBox(
                                width: AppSpacings.elementSpacingSmall,
                              ),
                              const Icon(
                                Icons.check_circle,
                                color: AppColors.success,
                                size: 16,
                              ),
                            ],
                          ),
                        )
                      : const Icon(Icons.cancel),
                ),
                if (!verified) ...[
                  const SizedBox(height: AppSpacings.elementSpacing),
                  AppTexts.body(
                    'We’ll send an email to verify your address',
                    context,
                  ),
                ],
                const Spacer(),
                if (!verified)
                  AppPrimaryButton(
                    onPressed: _saveEmail,
                    state: state.isLoading
                        ? ButtonState.loading
                        : ButtonState.enabled,
                    title: 'Continue',
                  ),
                const AppBottomPadding(),
                const SizedBox(height: AppSpacings.elementSpacing),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Future<void> _saveEmail() async {
    final valid = formKey.currentState?.validate() ?? false;
    final user = ref.read(userNotifierProvider).data;
    if (!valid || user == null) return;

    final updatedUser = user.copyWith(
      email: emailController.text.trim(),
      verification: user.verification.copyWith(emailVerified: false),
      updatedAt: DateTime.now().toUtc().millisecondsSinceEpoch,
    );

    final result = await ref
        .read(userNotifierProvider.notifier)
        .updateCurrentUser(
          updatedUser,
          onError: (error) => showToast(
            error is String ? error : 'Unable to update your email',
            ref: ref,
            toastType: AppToastType.error,
          ),
        );

    if (result != null && mounted) context.pop();
  }
}
