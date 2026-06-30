import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/models/country.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/sheets/phone_code_select.dart';
import 'package:piyamobile/shared/widgets/sheets/scrollable_sheet.dart';
import 'package:piyamobile/shared/widgets/textfields/app_textfield.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/extensions/primary_extension.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';
import 'package:piyamobile/utils/helpers/useful_functions.dart';
import 'package:piyamobile/utils/validations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PhoneTextField extends ConsumerStatefulWidget {
  final String initialPhone;
  final FocusNode? focusNode;
  final bool inputRequired;
  final String? labelText;
  final bool filled;
  final Function(String phone)? onPhoneChanged;

  const PhoneTextField({
    super.key,
    this.initialPhone = '',
    this.onPhoneChanged,
    this.focusNode,
    this.inputRequired = false,
    this.labelText,
    this.filled = true,
  });

  @override
  ConsumerState<ConsumerStatefulWidget> createState() =>
      _SelectCountryCodeState();
}

class _SelectCountryCodeState extends ConsumerState<PhoneTextField> {
  late TextEditingController controller;

  List<Country> countries = [];
  String phoneCode = '234';

  Country? get selectedCountry {
    try {
      return countries.firstWhere(
        (element) => element.dial_code == phoneCode.replaceAll('+', ''),
      );
    } catch (e) {
      return null;
    }
  }

  @override
  void initState() {
    super.initState();
    controller = TextEditingController();

    getCountries().then((value) {
      countries = value;
      setState(() {});

      _parseInitialValue();
    });

    controller.addListener(_listenToTextChanges);
  }

  void _listenToTextChanges() {
    if (widget.onPhoneChanged != null) {
      widget.onPhoneChanged!(
        '+${selectedCountry?.dial_code ?? phoneCode}${controller.text}',
      );
    }
  }

  @override
  void didUpdateWidget(covariant PhoneTextField oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.initialPhone != widget.initialPhone) {
      if (mounted) {
        _parseInitialValue();
      }
    }
  }

  set setPhoneCode(String code) {
    setState(() {
      phoneCode = code;
    });
  }

  void _parseInitialValue() {
    final String? initialValue = widget.initialPhone.trim().isEmpty
        ? null
        : widget.initialPhone.trim();

    if (initialValue != null) {
      final String existingCode =
          countries.getPhoneCountry(initialValue) ?? phoneCode;
      setPhoneCode = existingCode;

      controller.text = (() {
        if (initialValue.startsWith(phoneCode) ||
            initialValue.startsWith('+$phoneCode')) {
          return initialValue.substring(
            phoneCode.length + (initialValue.startsWith('+') ? 1 : 0),
          );
        }
        return initialValue;
      })();

      setState(() {});
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (widget.labelText != null) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Flexible(
                child: AppTexts.button(
                  widget.labelText!,
                  context,
                  fontWeight: FontWeight.w500,
                  texts: (style) => [
                    if (widget.inputRequired) ...[
                      TextSpan(
                        text: ' *',
                        style: style.copyWith(color: AppColors.error),
                      ),
                    ],
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacings.elementSpacing),
        ],
        Row(
          spacing: AppSpacings.elementSpacing,
          children: [
            AppToggleButton(
              onTap: () async {
                final code = await ScrollableSheet.open(
                  ref,
                  builder: (context, scrollController, _) => PhoneCodeSelector(
                    scrollController: scrollController,
                    countries: countries,
                  ),
                );
                if (code is String) {
                  setPhoneCode = code;
                }
              },
              child: ValueListenableBuilder(
                valueListenable: controller,
                builder: (context, value, child) {
                  final hasText = controller.text.isNotEmpty;

                  return Padding(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacings.elementSpacing * 1.5,
                      vertical: AppSpacings.elementSpacing * 1.5,
                    ),
                    child: Row(
                      children: [
                        AppTexts.body(
                          '${selectedCountry?.flag} +${selectedCountry?.dial_code ?? phoneCode}',
                          context,
                          fontWeight: hasText
                              ? FontWeight.w600
                              : FontWeight.w400,
                          color: Theme.of(context).iconTheme.color,
                        ),
                        const SizedBox(width: AppSpacings.elementSpacing),
                        Icon(Icons.keyboard_arrow_down, size: 16),
                      ],
                    ),
                  ).addBorder(
                    color: Theme.of(context).inputDecorationTheme.fillColor!,
                    backgroundColor: Theme.of(
                      context,
                    ).inputDecorationTheme.fillColor!,
                  );
                },
              ),
            ),

            Expanded(
              child: AppPrimaryTextfield(
                hintText: 'Phone number',
                onChanged: (v) {},
                focusNode: widget.focusNode,
                validator: (p0) => AppValidations.validatedPhone(p0),
                controller: controller,
                textInputAction: TextInputAction.send,
                keyboardType: TextInputType.phone,
              ),
            ),
          ],
        ),
      ],
    );
  }
}
