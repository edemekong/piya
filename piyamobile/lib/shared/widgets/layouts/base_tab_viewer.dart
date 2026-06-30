// ignore_for_file: invalid_use_of_protected_member, invalid_use_of_visible_for_testing_member

import 'package:flutter/material.dart';

mixin TabsViewer {
  late TabController tabController;
  TickerProvider? _vsync;
  int _lastTabsLength = 0;

  void initTabViewer({String? defaultTabPage, required TickerProvider vsync}) {
    _vsync = vsync;
    final int tab = defaultTabPage != null ? getTabIndex(defaultTabPage) : 0;
    _lastTabsLength = tabs.length;
    tabController = TabController(
      vsync: vsync,
      length: tabs.length,
      initialIndex: tab,
    );
  }

  void updateTabControllerIfNeeded() {
    if (_vsync == null) return;
    if (tabs.length != _lastTabsLength) {
      final int currentIndex = tabController.index.clamp(0, tabs.length - 1);
      tabController.dispose();
      _lastTabsLength = tabs.length;
      tabController = TabController(
        vsync: _vsync!,
        length: tabs.length,
        initialIndex: currentIndex,
      );
    }
  }

  List<String> get tabs => [];

  int getTabIndex(String tab) {
    final index = tabs.indexWhere((p) => p == tab);
    return index != -1 ? index : 0;
  }

  void _animateTo(int index, {bool jump = false}) async {
    if (tabController.indexIsChanging == false) {
      tabController.animateTo(
        index,
        duration: const Duration(milliseconds: 200),
        curve: Curves.linear,
      );
    }
  }

  void animateToTab(
    String newTab, {
    bool jump = false,
    Function()? onComplete,
  }) {
    final tab = getTabIndex(newTab);
    _animateTo(tab, jump: jump);

    if (onComplete != null) {
      Future.delayed(const Duration(milliseconds: 200), onComplete);
    }
  }

  void moveToPreviousPage() {
    final int tab = tabController.index.toInt();
    _animateTo(tab - 1);
  }
}
