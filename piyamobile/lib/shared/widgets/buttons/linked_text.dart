import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/services/ui_service.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'primary_button.dart';

class LinkedText extends ConsumerWidget {
  final String? text;
  final String link;
  final TextStyle? style;

  final OnPressedButton? onLinkTap;
  final Color? textColor;
  final bool disable;

  final bool center;
  final bool underline;

  final Widget? icon;

  const LinkedText({
    super.key,
    this.text,
    required this.link,
    this.onLinkTap,
    this.style,
    this.textColor,
    this.disable = false,
    this.center = false,
    this.underline = false,
    this.icon,
  });
  @override
  Widget build(BuildContext context, ref) {
    final uiService = ref.read(uiServiceProvider);
    final color = disable
        ? Theme.of(context).unselectedWidgetColor
        : (textColor ?? AppColors.primaryColor);

    final newStyle =
        (style ??
        Theme.of(context).textTheme.bodyLarge?.copyWith(
          height: 1.5,
          fontSize: 13.5,
          decoration: underline
              ? TextDecoration.underline
              : TextDecoration.none,
          decorationColor: color,
          decorationThickness: 1,
        ));

    return RichText(
      textAlign: center ? TextAlign.center : TextAlign.start,
      text: TextSpan(
        text: '',
        style: newStyle,
        children: [
          if (icon != null)
            WidgetSpan(
              alignment: PlaceholderAlignment.middle,
              child: InkWell(
                onTap: () => _onLinkTap(uiService),
                child: Padding(
                  padding: const EdgeInsets.only(
                    right: AppSpacings.elementSpacing * 0.5,
                  ),
                  child: IconTheme(
                    data: Theme.of(context).iconTheme.copyWith(color: color),
                    child: icon!,
                  ),
                ),
              ),
            ),
          if (text != null) TextSpan(text: text != null ? '${text!} ' : null),
          WidgetSpan(
            child: AppToggleButton(
              onTap: onLinkTap != null ? () => _onLinkTap(uiService) : null,
              child: AppTexts.button(
                link,
                context,
                color: color,
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _onLinkTap(UIService uiService) {
    if (disable && onLinkTap == null) return;

    uiService.unsetOverlay();
    onLinkTap!();
  }
}
