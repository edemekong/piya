import 'package:piyamobile/features/auth/data/notifier/auth_provider.dart';
import 'package:piyamobile/shared/constants/app_assets.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/widgets/textfields/app_textfield.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/helpers/response.dart';
import 'package:piyamobile/utils/validations.dart';

class RequestEmailAuthPage extends ConsumerStatefulWidget {
  const RequestEmailAuthPage({super.key});

  @override
  ConsumerState<RequestEmailAuthPage> createState() =>
      _AuthSelectionPageState();
}

class _AuthSelectionPageState extends ConsumerState<RequestEmailAuthPage> {
  late GlobalKey<FormState> formKey;

  @override
  void initState() {
    super.initState();

    formKey = GlobalKey<FormState>();
  }

  @override
  Widget build(BuildContext context) {
    final AuthNotifier notifier = ref.read(authNotifierProvider.notifier);
    final DataResult state = ref.watch(authNotifierProvider);

    return ListenableBuilder(
      listenable: Listenable.merge([
        notifier.emailFocusNode,
        notifier.emailController,
      ]),
      builder: (context, child) {
        return Padding(
          padding: EdgeInsets.symmetric(horizontal: AppSpacings.cardPadding),
          child: Form(
            key: formKey,
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
                  Center(child: Image.asset(AppAssets.logo, height: 30)),
                  SizedBox(height: AppSpacings.cardPadding * 2),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      AppTexts.title1(
                        'Enter your Email address',
                        context,
                        fontWeight: FontWeight.w600,
                        center: true,
                      ),
                      const SizedBox(height: AppSpacings.elementSpacing),
                      AppTexts.body(
                        'We will send a confirmation code to it',
                        context,
                      ),
                    ],
                  ),
                  const SizedBox(height: AppSpacings.cardPadding),
                  AppPrimaryTextfield(
                    controller: notifier.emailController,
                    focusNode: notifier.emailFocusNode,
                    hintText: "Email address",
                    keyboardType: TextInputType.emailAddress,
                    textCapitalization: TextCapitalization.none,
                    validator: (value) => AppValidations.validatedEmail(value),
                  ),
                  const SizedBox(height: AppSpacings.cardPadding * 2),
                  AppPrimaryButton(
                    state: (state.meta['isEmailLoading'] == true)
                        ? ButtonState.loading
                        : ButtonState.loaded,
                    onPressed: () {
                      final bool validate =
                          formKey.currentState?.validate() ?? false;
                      if (validate) {
                        notifier.requestOTPForEmail(context);
                      }
                    },
                    title: 'Continue',
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
