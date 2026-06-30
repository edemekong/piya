import 'dart:ui';
import 'package:flutter/material.dart';

class DottedBorderPainter extends CustomPainter {
  final Color color;
  final double strokeWidth;
  final BorderRadius borderRadius;
  final double dashWidth;
  final double dashSpace;

  DottedBorderPainter({
    required this.color,
    this.strokeWidth = 1.0,
    this.borderRadius = BorderRadius.zero,
    this.dashWidth = 4.0,
    this.dashSpace = 4.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    final RRect rrect = borderRadius.toRRect(
      Rect.fromLTWH(0, 0, size.width, size.height),
    );

    final Path path = Path()..addRRect(rrect);
    final Path dashedPath = _createDashedPath(path);

    canvas.drawPath(dashedPath, paint);
  }

  Path _createDashedPath(Path source) {
    final Path dashedPath = Path();
    final PathMetrics pathMetrics = source.computeMetrics();

    for (final PathMetric pathMetric in pathMetrics) {
      double distance = 0.0;
      bool draw = true;

      while (distance < pathMetric.length) {
        final double length = draw ? dashWidth : dashSpace;
        if (draw) {
          final Path extractPath = pathMetric.extractPath(
            distance,
            distance + length,
          );
          dashedPath.addPath(extractPath, Offset.zero);
        }
        distance += length;
        draw = !draw;
      }
    }

    return dashedPath;
  }

  @override
  bool shouldRepaint(DottedBorderPainter oldDelegate) {
    return oldDelegate.color != color ||
        oldDelegate.strokeWidth != strokeWidth ||
        oldDelegate.borderRadius != borderRadius ||
        oldDelegate.dashWidth != dashWidth ||
        oldDelegate.dashSpace != dashSpace;
  }
}
