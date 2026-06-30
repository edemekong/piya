import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/features/account/data/notifiers/user_notifier.dart';
import 'package:piyamobile/features/account/presentation/widgets/personal_info_tile.dart';
import 'package:piyamobile/features/account/presentation/widgets/profile_widgets.dart';
import 'package:piyamobile/shared/constants/app_assets.dart';
import 'package:piyamobile/shared/constants/app_routes.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:piyamobile/shared/widgets/paddings.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';

class PersonalInfoPage extends ConsumerWidget {
  const PersonalInfoPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(userNotifierProvider).data;

    return AppScaffold(
      body: SafeArea(
        child: CardPadding(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppSpacings.cardPadding),
              IconButton(
                padding: EdgeInsets.zero,
                alignment: Alignment.centerLeft,
                onPressed: () => context.pop(),
                icon: const Icon(Icons.arrow_back),
              ),
              const SizedBox(height: AppSpacings.cardPadding),
              AppTexts.title1(
                'Personal info',
                context,
                fontWeight: FontWeight.w700,
              ),
              const SizedBox(height: AppSpacings.cardPadding),
              Center(
                child: Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(AppSpacings.cardPadding),
                  decoration: BoxDecoration(
                    border: Border.all(color: Theme.of(context).dividerColor),
                    borderRadius: AppSpacings.defaultBorderRadius,
                  ),
                  child: Column(
                    children: [
                      ProfileAvatar(user: user, size: 58, showAdd: true),
                      const SizedBox(height: AppSpacings.elementSpacing),
                      AppTexts.body(
                        'Add a profile photo so drivers can\nrecognise you',
                        context,
                        center: true,
                        fontWeight: FontWeight.w700,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacings.cardPadding * 2),
              PersonalInfoTile(
                icon: AppAssets.user,
                value: user?.name ?? '',
                onEdit: () => context.push(AppRoutes.UPDATE_NAME.path),
              ),
              PersonalInfoTile(
                icon: AppAssets.callIncoming,
                value: user?.phoneNumber ?? '',
                onEdit: () => context.push(AppRoutes.UPDATE_PHONE.path),
              ),
              PersonalInfoTile(
                icon: AppAssets.sms,
                value: user?.email ?? '',
                onEdit: () => context.push(AppRoutes.UPDATE_EMAIL.path),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
