import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';
import 'package:piyamobile/utils/extensions/widget_extension.dart';

class ScrollableSheet extends StatefulWidget {
  final DraggableScrollableController? draggableScrollableController;

  final Widget Function(
    BuildContext context,
    ScrollController scrollController,
    DraggableScrollableController draggableScrollableController,
  )
  builder;
  const ScrollableSheet({
    super.key,
    required this.builder,
    this.draggableScrollableController,
  });

  @override
  State<ScrollableSheet> createState() => _RolesSheetState();

  static Future<T> open<T>(
    WidgetRef ref, {
    required Widget Function(
      BuildContext context,
      ScrollController scrollController,
      DraggableScrollableController draggableScrollableController,
    )
    builder,
  }) async {
    return await showModalBottomSheet(
      context: ref.context,
      shape: RoundedRectangleBorder(
        borderRadius: AppSpacings.defaultBorderRadius.copyWith(
          bottomLeft: Radius.zero,
          bottomRight: Radius.zero,
        ),
      ),
      useRootNavigator: true,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      isDismissible: true,
      enableDrag: true,
      builder: (context) => ScrollableSheet(builder: builder),
    );
  }
}

class _RolesSheetState extends State<ScrollableSheet> {
  late DraggableScrollableController draggableScrollableController;

  @override
  void initState() {
    super.initState();
    draggableScrollableController =
        widget.draggableScrollableController ?? DraggableScrollableController();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        GestureDetector(
          onTap: () => Navigator.pop(context),
          child: Container(
            height: MediaQuery.sizeOf(context).height,
            width: MediaQuery.sizeOf(context).width,
            color: Colors.transparent,
          ),
        ),
        DraggableScrollableSheet(
          controller: draggableScrollableController,
          maxChildSize: .95,
          initialChildSize: .7,
          minChildSize: .3,
          builder: (BuildContext context, ScrollController scrollController) {
            return ClipRRect(
              borderRadius: AppSpacings.defaultBorderRadius.copyWith(
                bottomLeft: Radius.zero,
                bottomRight: Radius.zero,
              ),
              child: Scaffold(
                backgroundColor: context.appTheme.cardColor,
                resizeToAvoidBottomInset: false,
                body: Column(
                  children: [
                    const SizedBox(height: AppSpacings.cardPadding),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          height: 4,
                          width: MediaQuery.of(context).size.width * 0.15,
                          decoration: BoxDecoration(
                            borderRadius: AppSpacings.defaultBorderRadius,
                            color: Theme.of(
                              context,
                            ).unselectedWidgetColor.withAppOpacity(.2),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacings.elementSpacing),
                    Expanded(
                      child: widget.builder(
                        context,
                        scrollController,
                        draggableScrollableController,
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
