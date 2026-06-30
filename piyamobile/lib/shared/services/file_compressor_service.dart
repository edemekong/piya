import 'dart:async';
import 'package:either_dart/either.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:path_provider/path_provider.dart';
import 'package:random_string/random_string.dart';
import 'package:piyamobile/utils/helpers/logs.dart';

const int _requestedQuality = 200;

class FileCompressorService {
  static Future<Either<String, XFile>> compressImage(
    XFile file, {
    int? width,
    int? height,
  }) async {
    final uuid = randomAlphaNumeric(16);
    try {
      final tempDir = await getTemporaryDirectory();
      final path = tempDir.path;
      double quality = 95;
      final byte = await file.readAsBytes().then(
        (value) => value.lengthInBytes,
      );
      final kb = byte / 1024;

      if (kb > _requestedQuality) {
        quality = (_requestedQuality / kb) * 100;
      }

      logPrint('Original image size: $kb KB');

      final result = await FlutterImageCompress.compressAndGetFile(
        file.path,
        '$path/img_$uuid.jpg',
        quality: quality.clamp(25.0, 80).toInt(),
        minHeight: height ?? 1024,
        minWidth: width ?? 1024,
        keepExif: false,
      );

      if (result != null) {
        final compressedByte = await result.readAsBytes().then(
          (value) => value.lengthInBytes,
        );
        logPrint('Compressed image size: ${compressedByte / 1024} KB');
        return Right(result);
      }
    } catch (e, trace) {
      logPrint(e, trace: trace);
    }

    return const Left('An error occurred while compressing the image');
  }
}
