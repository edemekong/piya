import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:piyamobile/features/account/data/models/user.dart';
import 'package:piyamobile/shared/theme/colors.dart';

class ProfileAvatar extends StatelessWidget {
  final UserData? user;
  final double size;
  final bool showAdd;

  const ProfileAvatar({
    super.key,
    required this.user,
    this.size = 58,
    this.showAdd = false,
  });

  @override
  Widget build(BuildContext context) {
    final imageUrl = user?.profileImageUrl ?? '';

    return Stack(
      clipBehavior: Clip.none,
      children: [
        ClipOval(
          child: Container(
            width: size,
            height: size,
            color: Theme.of(context).inputDecorationTheme.fillColor,
            child: imageUrl.startsWith('http')
                ? Image.network(imageUrl, fit: BoxFit.cover)
                : Icon(
                    CupertinoIcons.person_fill,
                    color: Theme.of(context).hintColor,
                  ),
          ),
        ),
        if (showAdd)
          Positioned(
            right: -2,
            top: -2,
            child: Container(
              width: 22,
              height: 22,
              decoration: const BoxDecoration(
                color: AppColors.secondaryLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.add, color: AppColors.white, size: 16),
            ),
          ),
      ],
    );
  }
}
