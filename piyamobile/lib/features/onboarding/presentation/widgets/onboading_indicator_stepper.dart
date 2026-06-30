import 'package:flutter/material.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';

class OnboadingIndicatorStepper extends StatefulWidget {
  final List<String> pages;
  final String initialPage;
  final int currentPageIndex;
  final Duration duration;
  final ValueChanged<int> onStepperChanged;

  const OnboadingIndicatorStepper({
    super.key,
    required this.pages,
    required this.initialPage,
    required this.onStepperChanged,
    this.currentPageIndex = 0,
    this.duration = const Duration(seconds: 6),
  });

  @override
  State<OnboadingIndicatorStepper> createState() =>
      _OnboadingIndicatorStepperState();
}

class _OnboadingIndicatorStepperState extends State<OnboadingIndicatorStepper>
    with SingleTickerProviderStateMixin {
  late final AnimationController _progressController;

  @override
  void initState() {
    super.initState();
    _progressController =
        AnimationController(vsync: this, duration: widget.duration)
          ..addListener(() => setState(() {}))
          ..addStatusListener(_handleProgressStatus);
    _startCurrentStep();
  }

  @override
  void didUpdateWidget(covariant OnboadingIndicatorStepper oldWidget) {
    super.didUpdateWidget(oldWidget);

    if (oldWidget.duration != widget.duration) {
      _progressController.duration = widget.duration;
    }

    if (oldWidget.initialPage != widget.initialPage ||
        oldWidget.currentPageIndex != widget.currentPageIndex ||
        oldWidget.pages.length != widget.pages.length) {
      _startCurrentStep();
    }
  }

  @override
  void dispose() {
    _progressController
      ..removeStatusListener(_handleProgressStatus)
      ..dispose();
    super.dispose();
  }

  void _startCurrentStep() {
    if (widget.pages.isEmpty) return;

    _progressController
      ..stop()
      ..reset();

    _progressController.forward();
  }

  void _handleProgressStatus(AnimationStatus status) {
    if (status != AnimationStatus.completed) return;

    final nextIndex = _safeCurrentPageIndex + 1;
    if (nextIndex < widget.pages.length) {
      widget.onStepperChanged(nextIndex);
    }
  }

  int get _safeCurrentPageIndex {
    if (widget.pages.isEmpty) return 0;

    final initialPageIndex = widget.pages.indexOf(widget.initialPage);
    return (initialPageIndex == -1 ? widget.currentPageIndex : initialPageIndex)
        .clamp(0, widget.pages.length - 1);
  }

  @override
  Widget build(BuildContext context) {
    if (widget.pages.isEmpty) return const SizedBox.shrink();

    final safeCurrentPageIndex = _safeCurrentPageIndex;

    return Row(
      children: List.generate(widget.pages.length, (index) {
        final progress = switch (index.compareTo(safeCurrentPageIndex)) {
          -1 => 1.0,
          0 => _progressController.value,
          _ => 0.0,
        };

        return Expanded(
          child: Padding(
            padding: EdgeInsets.only(
              left: index == 0 ? 0 : AppSpacings.elementSpacingSmall,
            ),
            child: GestureDetector(
              behavior: HitTestBehavior.opaque,
              onTap: () => widget.onStepperChanged(index),
              child: _StatusStepSegment(progress: progress),
            ),
          ),
        );
      }),
    );
  }
}

class _StatusStepSegment extends StatelessWidget {
  final double progress;

  const _StatusStepSegment({required this.progress});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 24,
      child: Align(
        alignment: Alignment.center,
        child: ClipRRect(
          borderRadius: AppSpacings.defaultCircularRadius,
          child: LinearProgressIndicator(
            minHeight: 6,
            value: progress,
            backgroundColor: AppColors.white.withAppOpacity(.35),
            valueColor: const AlwaysStoppedAnimation<Color>(AppColors.white),
          ),
        ),
      ),
    );
  }
}
