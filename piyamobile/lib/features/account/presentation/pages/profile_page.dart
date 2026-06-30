import 'package:flutter/cupertino.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_svg/svg.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/features/account/data/notifiers/user_notifier.dart';
import 'package:piyamobile/features/account/presentation/widgets/profile_menu_tile.dart';
import 'package:piyamobile/features/account/presentation/widgets/profile_pill_button.dart';
import 'package:piyamobile/features/account/presentation/widgets/profile_widgets.dart';
import 'package:piyamobile/shared/constants/app_assets.dart';
import 'package:piyamobile/shared/constants/app_routes.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:piyamobile/shared/widgets/paddings.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userNotifierProvider).data;
    final userNotifier = ref.read(userNotifierProvider.notifier);

    return AppScaffold(
      body: SafeArea(
        child: CardPadding(
          child: Column(
            children: [
              const SizedBox(height: AppSpacings.cardPadding),
              ProfileAvatar(user: user),
              const SizedBox(height: AppSpacings.elementSpacing),
              AppTexts.title3(
                user?.name ?? 'ZOLT User',
                context,
                center: true,
                fontWeight: FontWeight.w700,
              ),
              const SizedBox(height: AppSpacings.elementSpacingSmall),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  SvgPicture.asset(AppAssets.starSolid, fit: BoxFit.scaleDown),
                  const SizedBox(width: AppSpacings.elementSpacingSmall),
                  AppTexts.body('4.75 Rating', context),
                ],
              ),
              const SizedBox(height: AppSpacings.cardPadding * 2),
              ProfileMenuTile(
                icon: AppAssets.userSquare,
                title: 'Personal information',
                onTap: () => context.push(AppRoutes.PERSONAL_INFO.path),
              ),
              ProfileMenuTile(
                icon: AppAssets.callIncoming,
                title: 'Trusted Contact',
                onTap: () {},
              ),
              ProfileMenuTile(
                icon: AppAssets.house2,
                title: 'Add home address',
                onTap: () {},
              ),
              ProfileMenuTile(
                icon: AppAssets.login,
                title: 'Logout',
                onTap: () {
                  userNotifier.logoutCurrentUser(
                    () => context.go(AppRoutes.AUTH.path),
                  );
                },
              ),
              const SizedBox(height: AppSpacings.cardPadding),
              ProfilePillButton(
                icon: AppAssets.trash,
                title: 'Delete Account',
                onTap: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }
}
