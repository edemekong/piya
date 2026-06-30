import 'package:auto_size_text/auto_size_text.dart';
import 'package:flutter/material.dart';
import 'package:piyamobile/shared/theme/text_theme.dart';

@immutable
class AppTexts {
  const AppTexts._();

  static Widget largeTitle(
    String text,
    BuildContext context, {
    Color? color,
    FontWeight? fontWeight,
    bool center = false,
    double? fontSize,
    FontStyle? fontStyle,
    TextOverflow? overflow,
    int? maxLines,
    double? height,
    List<InlineSpan> Function(TextStyle style)? texts,
    TextDecoration? decoration,
  }) {
    final style = _textTheme(context).displayLarge?.copyWith(
      color: color,
      fontSize: fontSize,
      fontWeight: fontWeight,
      height: height ?? 1.21,
      fontStyle: fontStyle,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        textAlign: alignment,
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      textAlign: alignment,
      overflow: overflow,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget title1(
    String text,
    BuildContext context, {
    Color? color,
    bool center = false,
    FontWeight? fontWeight = FontWeight.w600,
    double? fontSize,
    FontStyle? fontStyle,
    TextOverflow? overflow,
    int? maxLines,
    double? height,
    List<InlineSpan> Function(TextStyle style)? texts,
    TextDecoration? decoration,
    String? fontFamily,
  }) {
    final style = _textTheme(context).displayMedium?.copyWith(
      color: color,
      fontSize: fontSize,
      fontWeight: fontWeight,
      height: height ?? 1.21,
      fontStyle: fontStyle,
      decoration: decoration,
      fontFamily: fontFamily,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        textAlign: alignment,
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      textAlign: alignment,
      overflow: overflow,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget title2(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    List<InlineSpan> Function(TextStyle style)? texts,
    TextDecoration? decoration,
    Color? decorationColor,
    double? decorationThickness,
    double? height,
    double? fontSize,
    FontStyle? fontStyle,
  }) {
    final style = _textTheme(context).displaySmall?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.27,
      decoration: decoration,
      decorationColor: decorationColor,
      fontSize: fontSize,
      decorationThickness: decorationThickness,
      fontStyle: fontStyle,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget title3(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    List<InlineSpan> Function(TextStyle style)? texts,
    TextDecoration? decoration,
    double? height,
    double? fontSize,
  }) {
    final style = _textTheme(context).headlineMedium?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.25,
      decoration: decoration,
      fontSize: fontSize,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget headline(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    double? height,
    double? fontSize,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
  }) {
    final style = _textTheme(context).headlineSmall?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.29,
      fontSize: fontSize,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget body(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    double? height,
    double? fontSize,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
    FontStyle? fontStyle,
  }) {
    final style = _textTheme(context).bodyMedium?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.29,
      fontSize: fontSize,
      decoration: decoration,
      fontStyle: fontStyle,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget bodySecondary(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    double? height,
    double? fontSize,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
  }) {
    final style = _textTheme(context).bodyLarge?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.29,
      fontSize: fontSize,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget callout(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    double? height,
    double? fontSize,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
  }) {
    final style = _textTheme(context).titleLarge?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.31,
      fontSize: fontSize,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget subheadline(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    double? height,
    double? fontSize,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
  }) {
    final style = _textTheme(context).titleMedium?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.33,
      fontSize: fontSize,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget footnote(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    double? height,
    double? fontSize,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
  }) {
    final style = _textTheme(context).titleSmall?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.38,
      fontSize: fontSize,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget caption1(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    double? height,
    double? fontSize,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
    FontStyle? fontStyle,
  }) {
    final style = _textTheme(context).bodySmall?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.33,
      fontSize: fontSize,
      fontStyle: fontStyle,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget caption2(
    String text,
    BuildContext context, {
    Color? color,
    TextOverflow? overflow,
    int? maxLines,
    FontWeight? fontWeight,
    bool center = false,
    double? height,
    double? fontSize,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
  }) {
    final style = _textTheme(context).labelSmall?.copyWith(
      color: color,
      fontWeight: fontWeight,
      height: height ?? 1.18,
      fontSize: fontSize,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(style!).isNotEmpty) {
      return RichText(
        maxLines: maxLines,
        overflow: overflow ?? TextOverflow.clip,
        textAlign: alignment,
        text: TextSpan(text: text, style: style, children: texts(style)),
      );
    }

    return Text(
      text,
      overflow: overflow,
      textAlign: alignment,
      maxLines: maxLines,
      style: style,
    );
  }

  static Widget button(
    String text,
    BuildContext context, {
    Color? color,
    FontWeight? fontWeight,
    double? fontSize,
    bool center = false,
    TextDecoration? decoration,
    List<InlineSpan> Function(TextStyle style)? texts,
  }) {
    final defaultStyle = _textTheme(context).labelLarge?.copyWith(
      color: color,
      fontWeight: fontWeight ?? FontWeight.w600,
      fontSize: fontSize ?? AppTextThemes.subheadline,
      decoration: decoration,
    );

    final alignment = center ? TextAlign.center : TextAlign.start;

    if (texts != null && texts(defaultStyle!).isNotEmpty) {
      return RichText(
        textAlign: alignment,
        text: TextSpan(
          text: text,
          style: defaultStyle,
          children: texts(defaultStyle),
        ),
      );
    }

    return Text(text, style: defaultStyle);
  }

  static Widget autoSizeText(
    String text,
    BuildContext context, {
    TextStyle? style,
    double? minFontSize,
    double? maxFontSize,
    int? maxLines,
    TextOverflow? overflow,
    bool center = false,
  }) {
    return AutoSizeText(
      text,
      style: style ?? _textTheme(context).bodyMedium,
      minFontSize: minFontSize ?? AppTextThemes.caption2,
      maxFontSize: maxFontSize ?? AppTextThemes.callout,
      maxLines: maxLines,
      overflow: overflow ?? TextOverflow.ellipsis,
      textAlign: center ? TextAlign.center : TextAlign.start,
    );
  }

  static TextTheme _textTheme(BuildContext context) =>
      Theme.of(context).textTheme;
}
