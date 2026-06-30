// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'package:extended_image/extended_image.dart';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_image_compress/flutter_image_compress.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:piyamobile/shared/animations/toggle_animation.dart';
import 'package:piyamobile/shared/theme/app_spacing.dart';
import 'package:piyamobile/shared/theme/colors.dart';
import 'package:piyamobile/shared/widgets/texts/app_texts.dart';
import 'package:piyamobile/utils/extensions/colors_extension.dart';

class DisplayImage extends StatefulWidget {
  final String url;
  final double aspectRatio;
  final double? width;
  final double? height;
  final Widget? icon;
  final BoxFit? fit;
  final Color? backgroundColor;
  final Function()? onDone;
  final XFile? file;
  final Uint8List? uint8list;
  final bool isCircle;

  final BorderRadius? borderRadius;

  const DisplayImage({
    super.key,
    required this.url,
    this.aspectRatio = 1,
    this.width,
    this.height,
    this.icon,
    this.fit,
    this.backgroundColor,
    this.onDone,
    this.file,
    this.uint8list,
    this.isCircle = false,
    this.borderRadius,
  });

  @override
  State<DisplayImage> createState() => _DisplayImageState();
}

class _DisplayImageState extends State<DisplayImage> {
  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(widget.isCircle ? 999 : 0),

      child: DecoratedBox(
        decoration: BoxDecoration(
          color:
              widget.backgroundColor ??
              Theme.of(context).unselectedWidgetColor.withAppOpacity(.15),
        ),
        child: Builder(
          builder: (context) {
            final image = Builder(
              builder: (context) {
                if (widget.uint8list != null) {
                  return ExtendedImage.memory(
                    widget.uint8list!,
                    height: widget.height,
                    width: widget.width,
                    fit: widget.fit ?? BoxFit.cover,
                    borderRadius: widget.borderRadius,
                    enableLoadState: true,
                    loadStateChanged: _imageState,
                    shape: widget.isCircle == true
                        ? BoxShape.circle
                        : BoxShape.rectangle,
                  );
                }

                if (widget.file != null) {
                  return FutureBuilder(
                    future: widget.file!.readAsBytes(),
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        return ExtendedImage.memory(
                          snapshot.data!,
                          height: widget.height,
                          borderRadius: widget.borderRadius,
                          width: widget.width,
                          fit: widget.fit ?? BoxFit.cover,
                          enableLoadState: true,
                          loadStateChanged: _imageState,
                          shape: widget.isCircle == true
                              ? BoxShape.circle
                              : BoxShape.rectangle,
                        );
                      }

                      return const SizedBox();
                    },
                  );
                }
                if (widget.url != '') {
                  if (!widget.url.startsWith("https://")) {
                    return ExtendedImage.asset(
                      widget.url,
                      height: widget.height,
                      width: widget.width,
                      borderRadius: widget.borderRadius,
                      fit: widget.fit ?? BoxFit.cover,
                      enableLoadState: true,
                      loadStateChanged: _imageState,
                      shape: widget.isCircle == true
                          ? BoxShape.circle
                          : BoxShape.rectangle,
                    );
                  }

                  final url = widget.url;

                  return ExtendedImage.network(
                    url,
                    cache: true,
                    height: widget.height,
                    width: widget.width,
                    fit: widget.fit ?? BoxFit.cover,
                    enableLoadState: true,
                    borderRadius: widget.borderRadius,
                    printError: false,
                    loadStateChanged: _imageState,
                    shape: widget.isCircle == true
                        ? BoxShape.circle
                        : BoxShape.rectangle,
                  );
                }
                return _buildError();
              },
            );

            if (widget.width != null) return image;
            return AspectRatio(aspectRatio: widget.aspectRatio, child: image);
          },
        ),
      ),
    );
  }

  Widget? _imageState(ExtendedImageState state) {
    switch (state.extendedImageLoadState) {
      case LoadState.loading:
        return _buildError();
      case LoadState.completed:
        if (widget.onDone != null) {
          widget.onDone!();
        }
        return state.completedWidget;
      case LoadState.failed:
        return _buildError();
    }
  }

  Widget _buildError() {
    return SizedBox(
      width: widget.width,
      height: widget.height,
      child: widget.icon,
    );
  }
}

enum FullScreenImageType { circular, rectangle }

class FullScreenImageDisplay extends ConsumerWidget {
  final String? url;
  final XFile? fila;
  final FullScreenImageType type;
  final Function()? onClose;
  final Function()? onDone;

  const FullScreenImageDisplay({
    super.key,
    this.fila,
    this.url,
    this.type = FullScreenImageType.rectangle,
    this.onClose,
    this.onDone,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final circular = FullScreenImageType.circular == type;
    final size = MediaQuery.sizeOf(context);
    return Scaffold(
      backgroundColor: Colors.transparent,
      body: SafeArea(
        child: Stack(
          children: [
            GestureDetector(
              onTap: onClose,
              child: Container(
                height: size.height,
                width: size.width,
                color: Colors.transparent,
              ),
            ),
            Padding(
              padding: EdgeInsets.all(
                circular ? AppSpacings.cardPadding : AppSpacings.elementSpacing,
              ),
              child: Center(
                child: Hero(
                  tag: ValueKey(url),
                  child: ClipRRect(
                    borderRadius: circular
                        ? AppSpacings.defaultCircularRadius
                        : AppSpacings.defaultBorderRadius,
                    child: DisplayImage(url: url ?? '', file: fila),
                  ),
                ),
              ),
            ),
            const SizedBox(height: AppSpacings.cardPadding),
            Positioned(
              top: AppSpacings.cardPadding,
              left: AppSpacings.cardPadding,
              right: AppSpacings.cardPadding,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  IconButton(
                    padding: EdgeInsets.zero,
                    onPressed: onClose,
                    icon: const Icon(Icons.clear),
                    color: AppColors.white,
                    iconSize: 40,
                  ),
                  if (onDone != null)
                    AppToggleButton(
                      onTap: onDone,
                      child: Container(
                        constraints: const BoxConstraints(minWidth: 80),
                        padding: const EdgeInsets.all(
                          AppSpacings.elementSpacing,
                        ),
                        decoration: BoxDecoration(
                          borderRadius: AppSpacings.defaultBorderRadius,
                          color: Theme.of(context).colorScheme.secondary,
                        ),
                        child: Center(
                          child: AppTexts.subheadline(
                            'Done',
                            context,
                            color: AppColors.white,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
