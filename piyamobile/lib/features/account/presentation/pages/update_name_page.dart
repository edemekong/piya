import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/features/account/data/notifiers/user_notifier.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/app_toast.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:piyamobile/shared/widgets/layouts/bottom_padding.dart';
import 'package:piyamobile/shared/widgets/paddings.dart';
import 'package:piyamobile/shared/widgets/textfields/app_textfield.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/helpers/useful_functions.dart';
import 'package:piyamobile/utils/validations.dart';

class UpdateNamePage extends ConsumerStatefulWidget {
  const UpdateNamePage({super.key});

  @override
  ConsumerState<UpdateNamePage> createState() => _UpdateNamePageState();
}

class _UpdateNamePageState extends ConsumerState<UpdateNamePage> {
  final formKey = GlobalKey<FormState>();
  late final TextEditingController firstNameController;
  late final TextEditingController lastNameController;

  @override
  void initState() {
    super.initState();
    final user = ref.read(userNotifierProvider).data;
    final names = (user?.name ?? '').trim().split(RegExp(r'\s+'));
    firstNameController = TextEditingController(
      text: names.isEmpty ? '' : names.first,
    );
    lastNameController = TextEditingController(
      text: names.length > 1 ? names.sublist(1).join(' ') : '',
    );
  }

  @override
  void dispose() {
    firstNameController.dispose();
    lastNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(userNotifierProvider);

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
                  'Update your name',
                  context,
                  fontWeight: FontWeight.w700,
                ),
                const SizedBox(height: AppSpacings.elementSpacing),
                AppTexts.body(
                  'Please enter your name as it appears on your ID\nor Passport.',
                  context,
                ),
                const SizedBox(height: AppSpacings.cardPadding),
                AppPrimaryTextfield(
                  labelText: 'First name',
                  controller: firstNameController,
                  textCapitalization: TextCapitalization.words,
                  validator: (value) =>
                      AppValidations.validatedName(value, label: 'First name'),
                ),
                const SizedBox(height: AppSpacings.elementSpacing),
                AppPrimaryTextfield(
                  labelText: 'Last name',
                  controller: lastNameController,
                  textCapitalization: TextCapitalization.words,
                  validator: (value) =>
                      AppValidations.validatedName(value, label: 'Last name'),
                ),
                const Spacer(),
                AppPrimaryButton(
                  onPressed: _saveName,
                  state: state.isLoading
                      ? ButtonState.loading
                      : ButtonState.enabled,
                  title: 'Save',
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

  Future<void> _saveName() async {
    final valid = formKey.currentState?.validate() ?? false;
    final user = ref.read(userNotifierProvider).data;
    if (!valid || user == null) return;

    final updatedUser = user.copyWith(
      name:
          '${firstNameController.text.trim()} ${lastNameController.text.trim()}',
      updatedAt: DateTime.now().toUtc().millisecondsSinceEpoch,
    );

    final result = await ref
        .read(userNotifierProvider.notifier)
        .updateCurrentUser(
          updatedUser,
          onError: (error) => showToast(
            error is String ? error : 'Unable to update your name',
            ref: ref,
            toastType: AppToastType.error,
          ),
        );

    if (result != null && mounted) context.pop();
  }
}
