import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/router/router.dart';
import 'package:piyamobile/shared/widgets/layouts/device_responsive_view.dart';

final uiServiceProvider = Provider<UIService>((ref) {
  return UIService(ref);
});

class UIService {
  final Ref ref;

  BuildContext? _mainContext;

  final ValueNotifier<bool> _isLoading = ValueNotifier<bool>(false);
  final ValueNotifier<bool> customDrawerNotifier = ValueNotifier<bool>(false);
  final ValueNotifier<OverlayEntry?> _currentOverlay =
      ValueNotifier<OverlayEntry?>(null);
  final ValueNotifier<DeviceDetails?> _deviceDetails =
      ValueNotifier<DeviceDetails?>(null);
  bool get hasOverlay => _currentOverlay.value != null;
  ValueNotifier<OverlayEntry?> get currentOverlay => _currentOverlay;

  DeviceDetails? get deviceType => _deviceDetails.value;

  ValueNotifier<DeviceDetails?> get deviceTypeNotifier => _deviceDetails;

  bool get isMobileDevice => _deviceDetails.value?.isMobile ?? true;

  bool get isTabletDevice => _deviceDetails.value?.isTablet ?? false;

  bool get isComputerDevice => _deviceDetails.value?.isComputer ?? false;

  BuildContext? get mainContext {
    final mobileContext = ref.read(appRouterServiceProvider).appBuildContext;

    return _mainContext ?? mobileContext;
  }

  void setDeviceType(BuildContext context, DeviceDetails details) {
    _mainContext = context;
    _deviceDetails.value = details;
    unsetOverlay();
  }

  void openDrawer({bool value = true, Function()? onDone}) {
    customDrawerNotifier.value = value;
    if (onDone != null) {
      Future.delayed(const Duration(milliseconds: 400), onDone);
    }
  }

  UIService(this.ref);

  bool get isLoading => _isLoading.value;
  ValueNotifier<bool> get uiLoading => _isLoading;

  void _startLoading([bool value = true]) => _isLoading.value = value;

  void _stopLoading() => _isLoading.value = false;

  Future<T?> runFuture<T>(
    Future Function() future, {
    Function(dynamic)? onError,
  }) async {
    if (isLoading == false) {
      try {
        _startLoading();

        T response = await future();
        _stopLoading();
        return response;
      } catch (error) {
        _stopLoading();

        if (onError != null) {
          onError(error);
        }
      }
    }
    return null;
  }

  OverlayEntry createOverlay(OverlayEntry entry) {
    _currentOverlay.value = entry;
    return entry;
  }

  void unsetOverlay() {
    _currentOverlay.value?.remove();
    _currentOverlay.value = null;
  }
}
