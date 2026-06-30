import 'dart:async';
import 'dart:io';
import 'dart:ui' as ui;
import 'package:camera/camera.dart';
import 'package:either_dart/either.dart';
import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path_provider/path_provider.dart';
import 'package:piyamobile/shared/services/file_compressor_service.dart';
import 'package:piyamobile/shared/services/platform_service.dart';
import 'package:piyamobile/shared/widgets/screens/camera_capture_screen.dart';
import 'package:piyamobile/utils/helpers/logs.dart';

final imagePickerServiceProvider = Provider<ImagePickerService>((ref) {
  return ImagePickerService();
});

enum PickerStatus { initial, loading, picking, processing, error, done }

class ImagePickerService {
  Future<Either<String, XFile>> captureImage({
    required BuildContext context,
    CameraLensDirection lensDirection = CameraLensDirection.front,
    int? width,
    int? height,
  }) async {
    try {
      final capturedFile = await Navigator.of(context, rootNavigator: true)
          .push<XFile>(
            MaterialPageRoute(
              fullscreenDialog: true,
              builder: (context) =>
                  CameraCaptureScreen(lensDirection: lensDirection),
            ),
          );

      if (capturedFile == null) {
        return const Left('No image captured');
      }

      final result = await FileCompressorService.compressImage(
        capturedFile,
        width: width,
        height: height,
      );

      if (result.isRight) {
        return Right(result.right);
      }

      return const Left('Could not process image');
    } catch (e, trace) {
      logPrint(e, trace: trace);
      return const Left('An unexpected error occurred');
    }
  }

  Future<Either<String, XFile>> pickImage({int? width, int? height}) async {
    try {
      XFile? resultImageFile;

      if (AppPlatformService.isIOS) {
        final pickImage = await FilePicker.pickFiles(
          type: FileType.image,
          allowMultiple: false,
        );
        String? path = pickImage?.files.first.path;
        if (path != null) {
          final XFile file = XFile(path);
          final result = await FileCompressorService.compressImage(
            file,
            width: width,
            height: height,
          );
          if (result.isRight) {
            resultImageFile = XFile(result.right.path);
          }
        }
      } else {
        final pickImage = await FilePicker.pickFiles(
          type: FileType.custom,
          allowedExtensions: ['jpg', 'png', 'jpeg'],
        );
        String? path = pickImage?.files.first.path;

        if (path != null) {
          final result = await FileCompressorService.compressImage(
            XFile(path),
            width: width,
            height: height,
          );

          if (result.isRight) {
            resultImageFile = result.right;
          }
        }
      }

      if (resultImageFile != null) {
        return Right(resultImageFile);
      } else {
        return const Left('Could not pick image');
      }
    } catch (e, trace) {
      logPrint(e, trace: trace);
      return const Left('An unexpected error occurred');
    }
  }

  Future<File?> captureWidget(GlobalKey key) async {
    try {
      RenderRepaintBoundary repaintBoundary =
          key.currentContext!.findRenderObject() as RenderRepaintBoundary;
      ui.Image image = await repaintBoundary.toImage(pixelRatio: 2.0);
      Directory directory = await getTemporaryDirectory();
      File tempFile = File(
        '${directory.path}${DateTime.now().millisecondsSinceEpoch}.png',
      );
      ByteData? byteData = await image.toByteData(
        format: ui.ImageByteFormat.png,
      );
      if (byteData != null) {
        await tempFile.writeAsBytes(byteData.buffer.asUint8List());
        return tempFile;
      }
    } catch (e, trace) {
      logPrint(e, trace: trace);
    }
    return null;
  }

  Future<Either<String, XFile>> pickImageOrVideo({
    FileType fileType = FileType.media,
    List<String>? allowedExtensions,
  }) async {
    try {
      final pickResult = await FilePicker.pickFiles(
        type: fileType,
        allowMultiple: false,
        allowedExtensions: allowedExtensions,
      );

      if (pickResult != null && pickResult.files.isNotEmpty) {
        final path = pickResult.files.first.path;
        if (path != null) {
          return Right(XFile(path));
        }
      }

      return const Left('No file selected');
    } catch (e, trace) {
      logPrint(e, trace: trace);
      return const Left('An unexpected error occurred');
    }
  }
}
