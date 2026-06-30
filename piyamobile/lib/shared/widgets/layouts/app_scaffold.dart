import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/services/ui_service.dart';
import 'package:piyamobile/shared/widgets/layouts/device_responsive_view.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';

class AppScaffold extends ConsumerWidget {
  final Widget? floatingActionButton;
  final Widget? body;
  final bool compactView;
  final Widget bottom;
  final Color? backgroundColor;

  final bool? resizeToAvoidBottomInset;

  final PreferredSizeWidget? appBar;

  const AppScaffold({
    super.key,
    this.floatingActionButton,
    this.body,
    this.bottom = const SizedBox.shrink(),
    this.backgroundColor,
    this.resizeToAvoidBottomInset,
    this.compactView = false,
    this.appBar,
  });

  @override
  Widget build(BuildContext context, ref) {
    final uiService = ref.read(uiServiceProvider);

    return LayoutBuilder(
      builder: (context, constraint) {
        final DeviceDetails details =
            uiService.deviceTypeNotifier.value ??
            DeviceDetails.fromConstraints(
              constraint,
              originalConstraints: constraint,
            );

        return Scaffold(
          appBar: appBar,
          resizeToAvoidBottomInset: resizeToAvoidBottomInset,
          backgroundColor:
              backgroundColor ?? context.appTheme.scaffoldBackgroundColor,
          floatingActionButton: floatingActionButton,
          body: Builder(
            builder: (context) {
              if (compactView && !details.isMobile) {
                return GestureDetector(
                  onTap: () => FocusScope.of(context).unfocus(),
                  child: Container(
                    color: Colors.transparent,
                    child: Center(
                      child: SizedBox(
                        width: constraint.maxWidth * 0.60,
                        height: constraint.maxHeight * 0.85,
                        child: body,
                      ),
                    ),
                  ),
                );
              }
              return GestureDetector(
                onTap: () => FocusScope.of(context).unfocus(),
                child: Container(color: Colors.transparent, child: body),
              );
            },
          ),
          bottomNavigationBar: bottom,
        );
      },
    );
  }
}
