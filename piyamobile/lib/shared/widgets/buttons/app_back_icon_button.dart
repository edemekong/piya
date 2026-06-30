import 'package:flutter/cupertino.dart';
import 'package:piyamobile/shared/animations/toggle_animation.dart';

class AppBackIconButton extends StatelessWidget {
  final Function() onTap;

  const AppBackIconButton({super.key, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return AppToggleButton(
      onTap: onTap,
      child: Icon(CupertinoIcons.arrow_left, size: 24),
    );
  }
}
