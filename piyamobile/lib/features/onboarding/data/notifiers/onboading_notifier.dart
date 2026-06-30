import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/constants/onboading_data.dart';
import 'package:piyamobile/shared/widgets/layouts/base_page_viewer.dart';

final onboardingNotifierProvider = NotifierProvider(() => OnboadingNotifier());

class OnboadingNotifier extends Notifier<String> with PageViewer {
  String initialPage = OnboadingData.page_1.id;

  @override
  List<String> get pages => [...OnboadingData.values.map((e) => e.id)];

  @override
  String build() {
    initPageViewer();
    return initialPage;
  }

  @override
  void onPageChanged(int index) {
    super.onPageChanged(index);
    state = OnboadingData.values[index].id;
    initialPage = state;
  }
}
