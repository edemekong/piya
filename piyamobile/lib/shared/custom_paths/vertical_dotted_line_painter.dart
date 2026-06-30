import 'package:flutter/material.dart';

class VerticalDottedLinePainter extends CustomPainter {
  final Color color;

  VerticalDottedLinePainter({required this.color});

  static const double _dashHeight = 4;
  static const double _dashGap = 8;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = size.width
      ..strokeCap = StrokeCap.round;

    double startY = 0;
    while (startY < size.height) {
      canvas.drawLine(
        Offset(size.width / 2, startY),
        Offset(size.width / 2, startY + _dashHeight),
        paint,
      );
      startY += _dashHeight + _dashGap;
    }
  }

  @override
  bool shouldRepaint(covariant VerticalDottedLinePainter oldDelegate) {
    return color != oldDelegate.color;
  }
}
