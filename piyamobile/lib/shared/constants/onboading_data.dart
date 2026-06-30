import 'package:piyamobile/shared/constants/app_assets.dart';

enum OnboadingData {
  page_1('page_1'),
  page_2('page_2'),
  page_3('page_3');

  const OnboadingData(this.id);
  final String id;

  ({String title, String description, String imagePath}) get data {
    return switch (this) {
      OnboadingData.page_1 => (
        title: "Fast & Reliable Dispatch Delivery",
        description:
            "Order riders anytime and track your deliveries live from pickup to drop-off ",
        imagePath: AppAssets.onboardingImage1,
      ),
      OnboadingData.page_2 => (
        title: "Be Your Own Boss",
        description:
            "Join as a dispatch rider, accept deliveries, earn money on your schedule, and work independently.",
        imagePath: AppAssets.onboardingImage2,
      ),
      OnboadingData.page_3 => (
        title: "Manage Multiple Products Easily",
        description:
            "Vendors can manage multiple items in one place for faster deliveries.",
        imagePath: AppAssets.onboardingImage3,
      ),
    };
  }
}
