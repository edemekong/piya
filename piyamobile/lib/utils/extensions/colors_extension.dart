// ignore_for_file: constant_identifier_names
import 'package:flutter/material.dart';

const List<int> RANDOM_COLORS = [
  0xFFFE414D,
  0xFF5675EE,
  0xFF8B45AC,
  0xFFE67E22,
  0xFFB32429,
  0xFF94C022,
  0xFF2D9CDB,
  0xFF6C5CE7,
  0xFF00B894,
  0xFF0984E3,
  0xFF00BFFF,
  0xFF6C5CE7,
  0xFF00CEC9,
  0xFF00BFFF,
  0xFF00BFFF,
  0xFF00BFFF,
  0xFF00BFFF,
];

extension ColorBrightness on Color {
  Color darken([double amount = .1]) {
    assert(amount >= 0 && amount <= 1);

    final hsl = HSLColor.fromColor(this);
    final hslDark = hsl.withLightness((hsl.lightness - amount).clamp(0.0, 1));

    return hslDark.toColor();
  }

  Color lighten([double amount = .1]) {
    assert(amount >= 0 && amount <= 1);

    final hsl = HSLColor.fromColor(this);
    final hslLight = hsl.withLightness((hsl.lightness + amount).clamp(0.0, 1.0));

    return hslLight.toColor();
  }

  Color withAppOpacity(double opacity) {
    return withValues(alpha: opacity);
  }

  Color get hashColor {
    return Color(RANDOM_COLORS[hashCode % RANDOM_COLORS.length]);
  }
}
