import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:flutter/material.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';
import '../../../shared/theme/colors.dart';

enum ButtonState { enabled, loading, disabled, loaded }

typedef OnPressedButton = void Function();

class AppPrimaryButton extends StatefulWidget {
  final String title;
  final OnPressedButton onPressed;
  final OnPressedButton? onDisabledPressed;
  final ButtonState state;
  final BorderRadius? borderRadius;
  final double height;
  final Widget? icon;
  final Widget? trailing;
  final Color? color;
  final Color? textColor;

  final EdgeInsets? padding;

  const AppPrimaryButton({
    super.key,
    required this.onPressed,
    this.state = ButtonState.enabled,
    this.height = 50,
    required this.title,
    this.icon,
    this.color,
    this.textColor,
    this.borderRadius,
    this.onDisabledPressed,
    this.trailing,
    this.padding,
  });

  @override
  State<AppPrimaryButton> createState() => _AppPrimaryButtonState();
}

class _AppPrimaryButtonState extends State<AppPrimaryButton> {
  bool isHover = false;

  @override
  Widget build(BuildContext context) {
    final isLight = context.isLight;

    final bool disable = [
      ButtonState.disabled,
      if (isLight) ButtonState.loading,
    ].contains(widget.state);
    final bool isLoading = [ButtonState.loading].contains(widget.state);

    final Color backgroundColor = disable
        ? ((widget.color ?? Theme.of(context).primaryColor).withAppOpacity(.3))
        : (widget.color ?? Theme.of(context).primaryColor);
    final Color textColor = (disable
        ? AppColors.white.withAppOpacity(.4)
        : (widget.textColor ?? AppColors.white));

    final BorderRadius defaultBorderRadius =
        widget.borderRadius ?? AppSpacings.defaultBorderRadius;

    return AppToggleButton(
      onTap: isLoading
          ? null
          : (disable && !isLoading
                ? widget.onDisabledPressed
                : widget.onPressed),
      borderRadius: defaultBorderRadius,
      child: Container(
        height: widget.height,
        constraints: const BoxConstraints(minWidth: 80),
        decoration: BoxDecoration(
          color: backgroundColor,
          borderRadius: defaultBorderRadius,
        ),
        child: Padding(
          padding:
              widget.padding ??
              const EdgeInsets.symmetric(
                horizontal: AppSpacings.elementSpacing * 0.8,
              ),
          child: Center(
            child: isLoading
                ? Transform.scale(
                    scale: 0.8,
                    child: CircularProgressIndicator(
                      valueColor: AlwaysStoppedAnimation(textColor),
                    ),
                  )
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (widget.icon != null) ...[
                        IconTheme(
                          data: Theme.of(
                            context,
                          ).iconTheme.copyWith(color: textColor),
                          child: widget.icon!,
                        ),
                        if (widget.title.trim().isNotEmpty)
                          const SizedBox(
                            width: AppSpacings.elementSpacing * 0.8,
                          ),
                      ],
                      if (widget.title.trim().isNotEmpty)
                        AppTexts.button(
                          widget.title,
                          context,
                          color: textColor,
                          fontWeight: FontWeight.w600,
                        ),
                      if (widget.trailing != null) ...[
                        if (widget.title.trim().isNotEmpty)
                          const SizedBox(
                            width: AppSpacings.elementSpacing * 0.5,
                          ),
                        IconTheme(
                          data: Theme.of(
                            context,
                          ).iconTheme.copyWith(color: textColor),
                          child: widget.trailing!,
                        ),
                      ],
                    ],
                  ),
          ),
        ),
      ),
    );
  }
}
