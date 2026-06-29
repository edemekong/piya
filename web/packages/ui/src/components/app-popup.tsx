import * as React from "react";
import { cn } from "../lib/cn";

export type AppPopupPlacement = "bottom-end" | "bottom-start" | "top-end" | "top-start";

export type AppPopupProps = {
  anchorElement: HTMLElement | null;
  children: React.ReactNode;
  className?: string;
  offset?: number;
  onClose: () => void;
  open: boolean;
  placement?: AppPopupPlacement;
};

type PopupPosition = {
  left: number;
  top: number;
};

const viewportMargin = 8;

export function AppPopup({
  anchorElement,
  children,
  className,
  offset = 8,
  onClose,
  open,
  placement = "bottom-end",
}: AppPopupProps) {
  const popupRef = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState<PopupPosition | null>(null);

  React.useLayoutEffect(() => {
    if (!open || !anchorElement) {
      setPosition(null);
      return;
    }

    function updatePosition() {
      if (!anchorElement || !popupRef.current) return;

      const anchorRect = anchorElement.getBoundingClientRect();
      const popupRect = popupRef.current.getBoundingClientRect();
      const alignedEnd = placement.endsWith("end");
      const preferredTop = placement.startsWith("top")
        ? anchorRect.top - popupRect.height - offset
        : anchorRect.bottom + offset;
      const flippedTop =
        preferredTop + popupRect.height > window.innerHeight - viewportMargin
          ? anchorRect.top - popupRect.height - offset
          : preferredTop;
      const rawLeft = alignedEnd
        ? anchorRect.right - popupRect.width
        : anchorRect.left;
      const left = Math.min(
        Math.max(rawLeft, viewportMargin),
        window.innerWidth - popupRect.width - viewportMargin,
      );
      const top = Math.max(viewportMargin, flippedTop);

      setPosition({ left, top });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [anchorElement, offset, open, placement]);

  React.useEffect(() => {
    if (!open) return;

    function closeOnOutsidePress(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (popupRef.current?.contains(target)) return;
      if (anchorElement?.contains(target)) return;

      onClose();
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [anchorElement, onClose, open]);

  if (!open || !anchorElement) return null;

  return (
    <div
      className={cn(
        "fixed z-[70]",
        !position && "pointer-events-none opacity-0",
        className,
      )}
      ref={popupRef}
      style={{
        left: position?.left ?? 0,
        top: position?.top ?? 0,
      }}
    >
      {children}
    </div>
  );
}
