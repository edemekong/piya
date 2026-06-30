import 'package:flutter/cupertino.dart';
import 'package:piyamobile/shared/services/platform_service.dart';
import 'dart:math' as math;

import 'package:piyamobile/shared/theme/app_spacing.dart';

class AppBottomPadding extends StatelessWidget {
  const AppBottomPadding({super.key});

  static const double _minBottomPadding = AppSpacings.elementSpacing;

  @override
  Widget build(BuildContext context) {
    final platform = AppPlatformService.getPlatform;
    final safeAreaBottom = MediaQuery.viewPaddingOf(context).bottom;

    final additionalPadding = switch (platform) {
      AppPlatform.ios => AppSpacings.cardPadding,
      _ => AppSpacings.cardPadding,
    };

    final height =
        math.max(safeAreaBottom, _minBottomPadding) + additionalPadding;

    return SizedBox(height: height);
  }
}
