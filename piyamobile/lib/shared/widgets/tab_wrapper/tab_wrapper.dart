import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/shared/router/router.dart';
import 'package:piyamobile/shared/services/ui_service.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:piyamobile/shared/widgets/layouts/device_responsive_view.dart';
import 'package:piyamobile/shared/widgets/tab_wrapper/components/app_bottom_navigation_bar.dart';

class TabWrapper extends ConsumerStatefulWidget {
  final StatefulNavigationShell navigationShell;
  const TabWrapper({required this.navigationShell, super.key});

  @override
  ConsumerState<TabWrapper> createState() => _TabWrapperState();
}

class _TabWrapperState extends ConsumerState<TabWrapper> {
  AppRouter get appRouter => ref.read(appRouterServiceProvider);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _handleDeeplinks();
  }

  void _handleDeeplinks() {
    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final uri = GoRouterState.of(context).uri;
      debugPrint(uri.toString());
    });
  }

  @override
  Widget build(BuildContext context) {
    final uiService = ref.read(uiServiceProvider);

    return Material(
      child: LayoutBuilder(
        builder: (context, constraint) {
          final DeviceDetails details =
              uiService.deviceTypeNotifier.value ??
              DeviceDetails.fromConstraints(
                constraint,
                originalConstraints: constraint,
              );

          uiService.setDeviceType(context, details);

          return ResponsiveBuilder(
            builder: (context, constraints, deviceType) {
              return AppScaffold(
                resizeToAvoidBottomInset: false,
                bottom: AppBottomNavigationBar(
                  shell: widget.navigationShell,
                  hasKeyboard: false,
                ),
                body: widget.navigationShell,
              );
            },
          );
        },
      ),
    );
  }
}
