import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';

class AppPrimaryTextfield extends StatefulWidget {
  final String? labelText;
  final String? hintText;
  final TextInputType? keyboardType;
  final FocusNode? focusNode;
  final List<String> autofillHints;
  final TextEditingController? controller;
  final List<TextInputFormatter>? inputFormatters;
  final String? Function(String?)? validator;
  final Function(String)? onFieldSubmitted;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final String? initialValue;
  final TextCapitalization textCapitalization;
  final TextInputAction? textInputAction;
  final TextStyle? style;
  final bool readOnly;
  final bool obscureText;
  final bool enableSuggestions;
  final int maxLines;
  final int? minLines;
  final int? maxLength;
  final ValueChanged<String>? onChanged;
  final GestureTapCallback? onTap;
  final VoidCallback? onEditingComplete;
  final bool? enabled;
  final bool autocorrect;
  final EdgeInsets? contentPadding;

  const AppPrimaryTextfield({
    super.key,
    this.labelText,
    this.hintText,
    this.keyboardType,
    this.focusNode,
    this.autofillHints = const [],
    this.controller,
    this.inputFormatters,
    this.validator,
    this.onFieldSubmitted,
    this.prefixIcon,
    this.suffixIcon,
    this.initialValue,
    this.textInputAction,
    this.style,
    this.readOnly = false,
    this.obscureText = false,
    this.enableSuggestions = true,
    this.maxLines = 1,
    this.minLines,
    this.maxLength,
    this.onChanged,
    this.onTap,
    this.onEditingComplete,
    this.enabled,
    this.textCapitalization = TextCapitalization.none,
    this.autocorrect = true,
    this.contentPadding = const EdgeInsets.only(
      left: AppSpacings.elementSpacing,
      right: AppSpacings.elementSpacing,
      bottom: AppSpacings.elementSpacing * 1.4,
      top: AppSpacings.elementSpacing * 1.4,
    ),
  });

  @override
  State<AppPrimaryTextfield> createState() => _AppPrimaryTextfieldState();
}

class _AppPrimaryTextfieldState extends State<AppPrimaryTextfield> {
  late FocusNode keyboardFocusNode;
  bool showClearButton = false;

  @override
  void initState() {
    super.initState();

    keyboardFocusNode = FocusNode();
    widget.controller?.addListener(_handleControllerChanged);
    _handleControllerChanged();
  }

  @override
  void didUpdateWidget(covariant AppPrimaryTextfield oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.controller == widget.controller) return;

    oldWidget.controller?.removeListener(_handleControllerChanged);
    widget.controller?.addListener(_handleControllerChanged);
    _handleControllerChanged();
  }

  @override
  void dispose() {
    widget.controller?.removeListener(_handleControllerChanged);
    keyboardFocusNode.dispose();
    super.dispose();
  }

  void _handleControllerChanged() {
    if (!mounted) return;

    final nextShowClearButton = widget.controller?.text.isNotEmpty == true;
    if (showClearButton == nextShowClearButton) return;

    setState(() => showClearButton = nextShowClearButton);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.labelText != null) ...[
          AppTexts.body(
            widget.labelText!,
            context,
            color: Theme.of(context).textTheme.titleLarge!.color,
          ),
          const SizedBox(height: AppSpacings.elementSpacing * 0.5),
        ],
        KeyboardListener(
          focusNode: keyboardFocusNode,
          onKeyEvent: (key) {
            if (key.logicalKey.keyLabel == 'Tab') {
              FocusScope.of(context).nextFocus();
            } else if (key.logicalKey.keyLabel == 'Escape') {
              FocusScope.of(context).unfocus();
            }
          },
          child: TextFormField(
            keyboardType: widget.keyboardType,
            initialValue: widget.initialValue,
            focusNode: widget.focusNode,
            autofillHints: widget.autofillHints,
            controller: widget.controller,
            inputFormatters: widget.inputFormatters,
            style:
                widget.style ??
                Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.w400,
                ),
            autocorrect: widget.autocorrect,
            minLines: widget.minLines,
            maxLines: widget.maxLines,
            maxLength: widget.maxLength,
            textCapitalization: widget.textCapitalization,
            obscureText: widget.obscureText,
            readOnly: widget.readOnly,
            enabled: widget.enabled,
            onTap: widget.onTap,
            validator: widget.validator,
            enableSuggestions: widget.enableSuggestions,
            decoration: InputDecoration(
              hintText: widget.hintText,
              hintStyle: Theme.of(context).textTheme.headlineSmall?.copyWith(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Theme.of(context).inputDecorationTheme.hintStyle?.color,
              ),
              prefixIcon: widget.prefixIcon,
              suffixIcon:
                  widget.suffixIcon ??
                  Builder(
                    builder: (context) {
                      if (showClearButton) {
                        return AppToggleButton(
                          onTap: () => widget.controller?.clear(),
                          child: Icon(Icons.cancel),
                        );
                      }
                      return SizedBox.shrink();
                    },
                  ),
              contentPadding: widget.contentPadding,
            ),
            onChanged: widget.onChanged,
            onFieldSubmitted: widget.onFieldSubmitted,
          ),
        ),
      ],
    );
  }
}
