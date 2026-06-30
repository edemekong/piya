// ignore_for_file: invalid_use_of_protected_member, invalid_use_of_visible_for_testing_member

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';

mixin PageViewer {
  ValueNotifier<int>? _currentPageIndexNotifier;
  ValueNotifier<int> get currentPageIndexNotifier {
    _currentPageIndexNotifier ??= ValueNotifier<int>(0);
    return _currentPageIndexNotifier!;
  }

  PageController? _pageViewerController;
  PageController? get pageViewerController => _pageViewerController;
  bool isAnimating = false;

  void initPageViewer({String? initialPage}) {
    final int page = initialPage != null ? getPageIndex(initialPage) : 0;
    _currentPageIndexNotifier ??= ValueNotifier<int>(page);
    _pageViewerController ??= PageController(initialPage: page, keepPage: true);
  }

  List<String> get pages => [];

  int getPageIndex(String page) {
    final index = pages.indexWhere((p) => p == page);
    return index != -1 ? index : 0;
  }

  void onPageChanged(int index) {
    currentPageIndexNotifier.value = index;
    currentPageIndexNotifier.notifyListeners();
  }

  void _animateTo(int index, {bool jump = false}) async {
    if (isAnimating == false) {
      isAnimating = true;

      if (!(pageViewerController?.hasClients ?? false)) {
        isAnimating = false;
        return;
      }

      if (jump) {
        pageViewerController?.jumpToPage(index);
      } else {
        await pageViewerController?.animateToPage(
          index,
          duration: const Duration(milliseconds: 200),
          curve: Curves.linear,
        );
      }

      isAnimating = false;
    }
  }

  void animateToPage(String newPage, {bool jump = false}) {
    final page = getPageIndex(newPage);
    _animateTo(page, jump: jump);
  }

  void moveToPreviousPage() {
    final int? page = pageViewerController?.page?.toInt();
    if (page != null && page > 0) {
      _animateTo(page - 1);
    }
  }

  void moveToNextPage({Function()? onCompleted, bool jump = false}) {
    if (!(pageViewerController?.hasClients ?? false)) return;

    if (currentPageIndexNotifier.value < (pages.length - 1)) {
      pageViewerController?.nextPage(
        duration: Duration(milliseconds: jump ? 1 : 200),
        curve: Curves.linear,
      );
    } else {
      if (onCompleted != null) onCompleted();
    }
  }

  void dispose() {
    _pageViewerController?.dispose();
    _pageViewerController = null;
    _currentPageIndexNotifier?.dispose();
    _currentPageIndexNotifier = null;
  }
}
