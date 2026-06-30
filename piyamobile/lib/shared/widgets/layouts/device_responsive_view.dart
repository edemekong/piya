import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/services/ui_service.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';

class DeviceBreakpoints {
  static const double maxSupported = 1920;

  static const double mobile = 480;
  static const double tablet = 768;
  static const double computer = 940;
  static const double largeScreen = 1400;
  static const double wideScreen = 1920;
}

@immutable
class DeviceDetails {
  final BoxConstraints constraints;
  final BoxConstraints originalConstraints;
  final bool isMobile;
  final bool isTablet;
  final bool isComputer;
  final bool isLargeScreen;
  final bool isWidescreen;

  const DeviceDetails({
    required this.constraints,
    required this.originalConstraints,
    this.isMobile = false,
    this.isTablet = false,
    this.isComputer = false,
    this.isLargeScreen = false,
    this.isWidescreen = false,
  });

  factory DeviceDetails.fromConstraints(
    BoxConstraints constraints, {
    BoxConstraints? originalConstraints,
  }) {
    return DeviceDetails._calculate(
      constraints,
      originalConstraints ?? constraints,
      constraints.maxWidth,
    );
  }

  factory DeviceDetails.fromSize(Size size) {
    final constraints = BoxConstraints.tight(size);
    return DeviceDetails._calculate(constraints, constraints, size.width);
  }

  factory DeviceDetails._calculate(
    BoxConstraints constraints,
    BoxConstraints originalConstraints,
    double width,
  ) {
    if (!kIsWeb) {
      final isTabletDevice = width >= DeviceBreakpoints.tablet;
      return DeviceDetails(
        constraints: constraints,
        originalConstraints: originalConstraints,
        isTablet: isTabletDevice,
        isMobile: !isTabletDevice,
      );
    }

    return DeviceDetails(
      constraints: constraints,
      originalConstraints: originalConstraints,
      isWidescreen: width >= DeviceBreakpoints.wideScreen,
      isLargeScreen: width >= DeviceBreakpoints.largeScreen,
      isComputer: width >= DeviceBreakpoints.computer,
      isTablet:
          width > DeviceBreakpoints.mobile &&
          width < DeviceBreakpoints.computer,
      isMobile: width <= DeviceBreakpoints.mobile,
    );
  }

  DeviceDetails copyWith({
    BoxConstraints? constraints,
    BoxConstraints? originalConstraints,
    bool? isMobile,
    bool? isTablet,
    bool? isComputer,
    bool? isLargeScreen,
    bool? isWidescreen,
  }) {
    return DeviceDetails(
      constraints: constraints ?? this.constraints,
      originalConstraints: originalConstraints ?? this.originalConstraints,
      isMobile: isMobile ?? this.isMobile,
      isTablet: isTablet ?? this.isTablet,
      isComputer: isComputer ?? this.isComputer,
      isLargeScreen: isLargeScreen ?? this.isLargeScreen,
      isWidescreen: isWidescreen ?? this.isWidescreen,
    );
  }

  factory DeviceDetails.fromMediaQuery(BuildContext context) {
    final mediaQuery = MediaQuery.of(context);
    final constraints = BoxConstraints(
      maxWidth: mediaQuery.size.width,
      maxHeight: mediaQuery.size.height,
    );

    return DeviceDetails._calculate(
      constraints,
      constraints,
      mediaQuery.size.width,
    );
  }
}

class ResponsiveBuilder extends ConsumerWidget {
  final Color? backgroundColor;
  final Widget Function(
    BuildContext context,
    BoxConstraints constraints,
    DeviceDetails deviceType,
  )
  builder;
  final ScrollController? scrollController;
  final ScrollPhysics? scrollPhysics;
  final bool showAppbar;
  final bool compactView;
  final List<Widget> actions;

  const ResponsiveBuilder({
    super.key,
    required this.builder,
    this.scrollController,
    this.showAppbar = true,
    this.scrollPhysics,
    this.backgroundColor,
    this.compactView = false,
    this.actions = const [],
  });

  void parseBaseURL(BuildContext context) {
    String? previewQueryParam = Uri.base.queryParameters['preview'];
    if (previewQueryParam != null) {
      Codec<String, String> stringToBase64Url = utf8.fuse(base64Url);
      String decodedJson = stringToBase64Url.decode(previewQueryParam);
      Map<String, dynamic> jsonData = jsonDecode(decodedJson);

      debugPrint(jsonData.toString());
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final UIService uiService = ref.read(uiServiceProvider);

    return Material(
      color: Colors.transparent,
      child: LayoutBuilder(
        builder: (context, appConstraints) {
          final double maxClampedWidth = appConstraints.maxWidth.clamp(
            DeviceBreakpoints.computer,
            DeviceBreakpoints.maxSupported,
          );

          final BoxConstraints constraints = appConstraints.copyWith(
            maxWidth: maxClampedWidth * 0.8,
            minWidth: 0,
            maxHeight: appConstraints.maxHeight,
            minHeight: 0,
          );

          final DeviceDetails deviceDetails = DeviceDetails.fromConstraints(
            constraints,
            originalConstraints: appConstraints,
          );

          const String currentPath = '';

          if (currentPath == '/') {
            parseBaseURL(context);
          }

          uiService.setDeviceType(context, deviceDetails);

          final Widget builderChild = builder(
            context,
            constraints,
            deviceDetails,
          );

          return Scaffold(
            backgroundColor: backgroundColor,
            resizeToAvoidBottomInset: false,
            body: SizedBox(
              width: appConstraints.maxWidth,
              height: appConstraints.maxHeight,
              child: Center(
                child: SizedBox(
                  width: constraints.maxWidth,
                  height: constraints.maxHeight,
                  child: Builder(
                    builder: (context) {
                      if (compactView && !deviceDetails.isMobile) {
                        return Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            if (actions.isNotEmpty)
                              Padding(
                                padding: EdgeInsets.only(
                                  bottom: AppSpacings.elementSpacing,
                                  right: constraints.maxWidth * 0.15,
                                  top: AppSpacings.cardPadding,
                                ),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.end,
                                  children: actions,
                                ),
                              ),
                            Expanded(
                              child: Center(
                                child: SizedBox(
                                  width: constraints.maxWidth * 0.5,
                                  height: constraints.maxHeight * 0.9,
                                  child: builderChild,
                                ),
                              ),
                            ),
                          ],
                        );
                      }
                      return builderChild;
                    },
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
