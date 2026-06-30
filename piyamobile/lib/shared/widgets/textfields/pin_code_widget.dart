import 'package:flutter/material.dart';
import 'package:pin_code_fields/pin_code_fields.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';

class PinCodeWidget extends StatelessWidget {
  const PinCodeWidget({
    super.key,
    required this.isPinInvalid,
    this.onChanged,
    required this.controller,
    this.onComplete,
    this.length = 6,
  });

  final TextEditingController controller;
  final Function(String)? onChanged;
  final bool isPinInvalid;
  final Function(String)? onComplete;
  final int length;

  @override
  Widget build(BuildContext context) {
    return PinCodeTextField(
      autoDisposeControllers: false,
      controller: controller,
      onCompleted: onComplete,
      appContext: context,
      keyboardAppearance: context.appTheme.brightness,
      backgroundColor: context.appTheme.scaffoldBackgroundColor,
      pastedTextStyle: const TextStyle(
        color: Colors.black,
        fontWeight: FontWeight.bold,
      ),
      showCursor: true,
      blinkWhenObscuring: true,
      cursorColor: context.appTheme.colorScheme.onSurfaceVariant,
      length: length,
      keyboardType: TextInputType.number,
      animationType: AnimationType.scale,
      animationDuration: const Duration(milliseconds: 100),
      textStyle: context.appTheme.textTheme.headlineLarge?.copyWith(
        color: context.appTheme.iconTheme.color,
        fontWeight: FontWeight.w600,
        letterSpacing: 8,
      ),
      pinTheme: PinTheme(
        shape: PinCodeFieldShape.underline,
        fieldHeight: 60,
        borderWidth: 1,
        activeBorderWidth: 1.3,
        selectedBorderWidth: 1.3,
        fieldWidth: context.appSize.width * (length == 4 ? 0.18 : 0.125),
        inactiveColor: Colors.black,
        activeColor: isPinInvalid ? Colors.red : Colors.black,
        selectedColor: Colors.black,
        fieldOuterPadding: EdgeInsets.zero,
      ),
      onChanged: onChanged,
    );
  }
}
