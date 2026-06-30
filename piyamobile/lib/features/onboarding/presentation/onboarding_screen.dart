import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:piyamobile/features/onboarding/data/notifiers/onboading_notifier.dart';
import 'package:piyamobile/features/onboarding/presentation/widgets/onboading_indicator_stepper.dart';
import 'package:piyamobile/shared/constants/app_routes.dart';
import 'package:piyamobile/shared/constants/onboading_data.dart';
import 'package:piyamobile/shared/constants/storage_keys.dart';
import 'package:piyamobile/shared/services/shared_preference_service.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/buttons/primary_button.dart';
import 'package:piyamobile/shared/widgets/display/display_image.dart';
import 'package:piyamobile/shared/widgets/layouts/app_scaffold.dart';
import 'package:piyamobile/shared/widgets/layouts/bottom_padding.dart';
import 'package:piyamobile/shared/widgets/paddings.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<ConsumerStatefulWidget> createState() =>
      _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  void _moveToPreviousPage(OnboadingNotifier notifier) {
    final previousPageIndex = notifier.currentPageIndexNotifier.value - 1;
    if (previousPageIndex < 0) return;

    notifier.animateToPage(notifier.pages[previousPageIndex], jump: true);
  }

  void _moveToNextPage(OnboadingNotifier notifier) {
    final nextPageIndex = notifier.currentPageIndexNotifier.value + 1;
    if (nextPageIndex >= notifier.pages.length) return;

    notifier.animateToPage(notifier.pages[nextPageIndex], jump: true);
  }

  Future<void> _completeOnboarding() async {
    await SharedPreferenceService.setBool(
      key: LocalStorageKeys.onboardingCompletedKey,
      value: true,
    );

    if (!mounted) return;
    context.goNamed(AppRoutes.AUTH.name);
  }

  @override
  Widget build(BuildContext context) {
    final notifier = ref.read(onboardingNotifierProvider.notifier);

    return AppScaffold(
      backgroundColor: AppColors.primaryColor,
      body: ValueListenableBuilder(
        valueListenable: notifier.currentPageIndexNotifier,
        builder: (context, currentPageIndex, child) {
          final currentPageData = OnboadingData.values[currentPageIndex].data;
          return Stack(
            children: [
              Positioned.fill(
                child: PageView.builder(
                  itemCount: notifier.pages.length,
                  controller: notifier.pageViewerController,
                  onPageChanged: notifier.onPageChanged,
                  itemBuilder: (context, index) {
                    final data = OnboadingData.values[index].data;
                    return DisplayImage(url: data.imagePath, fit: BoxFit.cover);
                  },
                ),
              ),
              Positioned.fill(
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: AlignmentGeometry.topCenter,
                      end: AlignmentGeometry.bottomCenter,
                      colors: [
                        AppColors.primaryColor.withAppOpacity(.35),
                        AppColors.darkBackground.withAppOpacity(.6),
                        AppColors.darkBackground.withAppOpacity(.8),
                      ],
                    ),
                  ),
                ),
              ),
              Positioned.fill(
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        behavior: HitTestBehavior.translucent,
                        onTap: () => _moveToPreviousPage(notifier),
                      ),
                    ),
                    Expanded(
                      child: GestureDetector(
                        behavior: HitTestBehavior.translucent,
                        onTap: () => _moveToNextPage(notifier),
                      ),
                    ),
                  ],
                ),
              ),
              CardPadding(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    SizedBox(
                      height:
                          MediaQuery.of(context).viewPadding.top +
                          AppSpacings.elementSpacing,
                    ),
                    OnboadingIndicatorStepper(
                      pages: notifier.pages,
                      initialPage: notifier.initialPage,
                      currentPageIndex: currentPageIndex,
                      onStepperChanged: (int index) => notifier.animateToPage(
                        notifier.pages[index],
                        jump: true,
                      ),
                    ),
                    const Spacer(),
                    AppTexts.largeTitle(
                      currentPageData.title,
                      context,
                      color: AppColors.white,
                      fontWeight: FontWeight.w600,
                    ),
                    const SizedBox(height: AppSpacings.elementSpacing),
                    AppTexts.body(
                      currentPageData.description,
                      context,
                      color: AppColors.white.withAppOpacity(.8),
                    ),
                    const SizedBox(height: AppSpacings.cardPadding * 2),
                    AppPrimaryButton(
                      onPressed: _completeOnboarding,
                      title: "Get Started",
                    ),
                    const AppBottomPadding(),
                    const SizedBox(height: AppSpacings.elementSpacing),
                  ],
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}
