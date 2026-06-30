// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';

class AppPrimarySearchfield extends StatefulWidget {
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
  final Color? filledColor;
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

  const AppPrimarySearchfield({
    super.key,
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
    this.filledColor,
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
      bottom: AppSpacings.elementSpacing,
      top: AppSpacings.elementSpacing,
    ),
  });

  @override
  State<AppPrimarySearchfield> createState() => _AppPrimarySearchfieldState();
}

class _AppPrimarySearchfieldState extends State<AppPrimarySearchfield> {
  late FocusNode keyboardFocusNode;

  @override
  void initState() {
    super.initState();

    keyboardFocusNode = widget.focusNode ?? FocusNode();
  }

  @override
  Widget build(BuildContext context) {
    return TextField(
      keyboardType: widget.keyboardType,
      focusNode: keyboardFocusNode,
      autofillHints: widget.autofillHints,
      controller: widget.controller,
      inputFormatters: widget.inputFormatters,
      style: widget.style ?? Theme.of(context).textTheme.bodyMedium,
      autocorrect: widget.autocorrect,
      minLines: widget.minLines,
      maxLines: widget.maxLines,
      maxLength: widget.maxLength,
      textCapitalization: widget.textCapitalization,
      obscureText: widget.obscureText,
      readOnly: widget.readOnly,
      enabled: widget.enabled,
      onTap: widget.onTap,
      enableSuggestions: widget.enableSuggestions,
      decoration: InputDecoration(
        hintText: widget.hintText,
        fillColor: widget.filledColor,
        hintStyle: Theme.of(
          context,
        ).inputDecorationTheme.hintStyle?.copyWith(fontWeight: FontWeight.w500),
        prefixIcon: widget.prefixIcon,
        suffixIcon: widget.suffixIcon,
        contentPadding: widget.contentPadding,
        enabledBorder: OutlineInputBorder(
          borderRadius: AppSpacings.defaultCircularRadius,
          borderSide: BorderSide(
            color: Theme.of(context).dividerColor,
            width: 1.5,
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: AppSpacings.defaultCircularRadius,
          borderSide: BorderSide(
            color: Theme.of(context).dividerColor,
            width: 1.5,
          ),
        ),
      ),
      onChanged: widget.onChanged,
    );
  }
}
