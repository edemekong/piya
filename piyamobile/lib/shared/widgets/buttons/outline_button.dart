import 'package:flutter/material.dart';
import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/custom_paths/dotted_border_painter.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import '../../../shared/theme/colors.dart';

class AppOutlineButton extends StatefulWidget {
  final String title;
  final OnPressedButton onPressed;
  final bool dotted;
  final BorderRadius? borderRadius;
  final TextStyle? titleStyle;

  final ButtonState state;
  final double height;
  final Widget? icon;
  final Widget? trailingIcon;
  final Color? color;
  final Color? textColor;
  final double? strokeWidth;

  const AppOutlineButton({
    super.key,
    required this.title,
    required this.onPressed,
    this.dotted = false,
    this.borderRadius,
    this.titleStyle,
    this.state = ButtonState.enabled,
    this.height = 50,
    this.icon,
    this.trailingIcon,
    this.color,
    this.textColor,
    this.strokeWidth,
  });

  @override
  State<AppOutlineButton> createState() => _MySquadPrimaryButtonState();
}

class _MySquadPrimaryButtonState extends State<AppOutlineButton> {
  bool isHover = false;

  @override
  Widget build(BuildContext context) {
    final bool disable = [
      ButtonState.disabled,
      ButtonState.loading,
    ].contains(widget.state);
    final bool isLoading = [ButtonState.loading].contains(widget.state);

    Color? textColor = widget.textColor ?? AppColors.primaryColor;

    final defaultBorderRadius =
        widget.borderRadius ?? AppSpacings.defaultBorderRadius;

    return AppToggleButton(
      onTap: disable ? null : widget.onPressed,
      borderRadius: defaultBorderRadius,
      child: CustomPaint(
        painter: widget.dotted
            ? DottedBorderPainter(
                color: textColor,
                strokeWidth: widget.strokeWidth ?? 1.0,
                borderRadius: defaultBorderRadius,
              )
            : null,
        child: Container(
          height: widget.height,
          constraints: const BoxConstraints(minWidth: 80),
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacings.cardPadding * 0.65,
          ),
          decoration: widget.dotted
              ? BoxDecoration(
                  borderRadius: defaultBorderRadius,
                  color: widget.color,
                )
              : BoxDecoration(
                  color: widget.color,
                  border: Border.all(
                    color: textColor,
                    width: widget.strokeWidth ?? 0.8,
                  ),
                  borderRadius: defaultBorderRadius,
                ),
          child: Center(
            child: isLoading
                ? const CircularProgressIndicator()
                : Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (widget.icon != null) ...[
                        IconTheme(
                          data: Theme.of(
                            context,
                          ).iconTheme.copyWith(color: textColor),
                          child: widget.icon!,
                        ),
                        const SizedBox(width: AppSpacings.elementSpacing),
                      ],
                      AppTexts.button(
                        widget.title,
                        context,
                        color: disable
                            ? Theme.of(context).dividerColor
                            : textColor,
                      ),
                      if (widget.trailingIcon != null) ...[
                        const SizedBox(width: AppSpacings.elementSpacing),
                        IconTheme(
                          data: Theme.of(
                            context,
                          ).iconTheme.copyWith(color: textColor),
                          child: widget.trailingIcon!,
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
