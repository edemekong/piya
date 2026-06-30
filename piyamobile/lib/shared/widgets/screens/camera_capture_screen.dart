import 'package:camera/camera.dart';
import 'package:flutter/material.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';

class CameraCaptureScreen extends StatefulWidget {
  final CameraLensDirection lensDirection;

  const CameraCaptureScreen({
    super.key,
    this.lensDirection = CameraLensDirection.front,
  });

  @override
  State<CameraCaptureScreen> createState() => _CameraCaptureScreenState();
}

class _CameraCaptureScreenState extends State<CameraCaptureScreen> {
  CameraController? _controller;
  Future<void>? _initializeCameraFuture;
  bool _isCapturing = false;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _initializeCameraFuture = _initializeCamera();
  }

  @override
  void dispose() {
    _controller?.dispose();
    super.dispose();
  }

  Future<void> _initializeCamera() async {
    try {
      final cameras = await availableCameras();
      if (cameras.isEmpty) {
        _errorMessage = 'No camera available';
        return;
      }

      final camera = cameras.firstWhere(
        (camera) => camera.lensDirection == widget.lensDirection,
        orElse: () => cameras.first,
      );

      final controller = CameraController(
        camera,
        ResolutionPreset.high,
        enableAudio: false,
        imageFormatGroup: ImageFormatGroup.jpeg,
      );

      _controller = controller;
      await controller.initialize();
    } catch (_) {
      _errorMessage = 'Unable to open camera';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.black,
      body: SafeArea(
        child: FutureBuilder<void>(
          future: _initializeCameraFuture,
          builder: (context, snapshot) {
            final controller = _controller;

            if (_errorMessage != null) {
              return _CameraMessage(
                message: _errorMessage!,
                onClose: () => Navigator.pop(context),
              );
            }

            if (snapshot.connectionState != ConnectionState.done ||
                controller == null ||
                !controller.value.isInitialized) {
              return const Center(child: CircularProgressIndicator());
            }

            return Stack(
              children: [
                Positioned.fill(
                  child: Center(
                    child: AspectRatio(
                      aspectRatio: controller.value.aspectRatio,
                      child: CameraPreview(controller),
                    ),
                  ),
                ),
                Positioned(
                  top: AppSpacings.elementSpacing,
                  left: AppSpacings.elementSpacing,
                  child: IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.arrow_back),
                    color: AppColors.white,
                  ),
                ),
                Positioned(
                  left: 0,
                  right: 0,
                  bottom: AppSpacings.cardPadding,
                  child: Center(
                    child: GestureDetector(
                      onTap: _captureImage,
                      child: Container(
                        width: 78,
                        height: 78,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.white, width: 4),
                        ),
                        child: Center(
                          child: Container(
                            width: 58,
                            height: 58,
                            decoration: const BoxDecoration(
                              color: AppColors.white,
                              shape: BoxShape.circle,
                            ),
                            child: _isCapturing
                                ? const Padding(
                                    padding: EdgeInsets.all(14),
                                    child: CircularProgressIndicator(
                                      strokeWidth: 3,
                                    ),
                                  )
                                : null,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  Future<void> _captureImage() async {
    final controller = _controller;
    if (_isCapturing || controller == null || !controller.value.isInitialized) {
      return;
    }

    setState(() => _isCapturing = true);

    try {
      final file = await controller.takePicture();
      if (!mounted) return;
      Navigator.pop(context, file);
    } catch (_) {
      if (!mounted) return;
      setState(() => _isCapturing = false);
    }
  }
}

class _CameraMessage extends StatelessWidget {
  final String message;
  final VoidCallback onClose;

  const _CameraMessage({required this.message, required this.onClose});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacings.cardPadding),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message, style: const TextStyle(color: AppColors.white)),
            const SizedBox(height: AppSpacings.elementSpacing),
            TextButton(onPressed: onClose, child: const Text('Close')),
          ],
        ),
      ),
    );
  }
}
