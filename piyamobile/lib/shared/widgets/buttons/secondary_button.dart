import 'package:flutter/material.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';

class AppSecondaryButton extends StatelessWidget {
  final String title;
  final OnPressedButton onPressed;
  final OnPressedButton? onDisabledPressed;
  final ButtonState state;
  final BorderRadius? borderRadius;
  final double height;
  final Widget? icon;
  final Widget? trailing;

  const AppSecondaryButton({
    super.key,
    required this.title,
    required this.onPressed,
    this.onDisabledPressed,
    this.state = ButtonState.enabled,
    this.height = 50,
    this.borderRadius,
    this.icon,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return AppPrimaryButton(
      title: title,
      onPressed: onPressed,
      onDisabledPressed: onDisabledPressed,
      state: state,
      height: height,
      borderRadius: borderRadius,
      icon: icon,
      trailing: trailing,
      color: Color(0xFFF4F5F8),
      textColor: AppColors.black,
    );
  }
}

class AppDestructiveButton extends StatelessWidget {
  final String title;
  final OnPressedButton onPressed;
  final OnPressedButton? onDisabledPressed;
  final ButtonState state;
  final BorderRadius? borderRadius;
  final double height;
  final Widget? icon;
  final Widget? trailing;

  const AppDestructiveButton({
    super.key,
    required this.title,
    required this.onPressed,
    this.onDisabledPressed,
    this.state = ButtonState.enabled,
    this.height = 52,
    this.borderRadius,
    this.icon,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return AppPrimaryButton(
      title: title,
      onPressed: onPressed,
      onDisabledPressed: onDisabledPressed,
      state: state,
      height: height,
      borderRadius: borderRadius,
      icon: icon,
      trailing: trailing,
      color: AppColors.secondaryLight,
      textColor: AppColors.white,
    );
  }
}
