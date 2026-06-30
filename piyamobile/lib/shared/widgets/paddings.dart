import 'package:flutter/cupertino.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';

class CardPadding extends StatelessWidget {
  final Widget child;
  const CardPadding({super.key, required this.child, this.vertical});
  final double? vertical;
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(
        horizontal: AppSpacings.cardPadding,
        vertical: vertical ?? 0,
      ),
      child: child,
    );
  }
}

class ElementPadding extends StatelessWidget {
  final Widget child;
  const ElementPadding({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacings.elementSpacing,
      ),
      child: child,
    );
  }
}
