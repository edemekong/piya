import 'package:flutter/material.dart';

class OverlayPainter extends CustomPainter {
  final double overlayWidth;
  final double overlayHeight;
  final Color overlayColor;

  OverlayPainter({
    required this.overlayWidth,
    required this.overlayHeight,
    required this.overlayColor,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = overlayColor;

    final centerX = size.width / 2;
    final centerY = size.height / 2;
    final left = centerX - (overlayWidth / 2);
    final top = centerY - (overlayHeight / 2);

    final path = Path()
      ..addRect(Rect.fromLTWH(0, 0, size.width, size.height))
      ..addRRect(
        RRect.fromRectAndRadius(
          Rect.fromLTWH(left, top, overlayWidth, overlayHeight),
          const Radius.circular(12),
        ),
      )
      ..fillType = PathFillType.evenOdd;

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(OverlayPainter oldDelegate) {
    return oldDelegate.overlayWidth != overlayWidth ||
        oldDelegate.overlayHeight != overlayHeight ||
        oldDelegate.overlayColor != overlayColor;
  }
}
