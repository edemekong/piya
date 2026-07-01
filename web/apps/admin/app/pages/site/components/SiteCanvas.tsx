import * as React from "react";
import { Home, Plus } from "lucide-react";
import { cn } from "@piya/ui";
import {
  getSiteModuleAccentClassName,
  getSiteModuleDefinition,
  getSiteModuleDisplay,
} from "../site-modules";
import type { SiteCategory, SiteFlowModule } from "../types";
import { SiteModuleCard } from "./SiteModuleCard";

const CANVAS_WIDTH = 980;
const CANVAS_HEIGHT = 1100;
const MIN_ZOOM = 0.7;
const MAX_ZOOM = 1.4;
const WHEEL_ZOOM_SENSITIVITY = 0.002;

type SiteCanvasProps = {
  category: SiteCategory;
  modules: SiteFlowModule[];
  onAddAfter: (flowId?: string) => void;
  onOpenModulePanel: () => void;
  onRemove: (flowId: string) => void;
  onSelect: (module: SiteFlowModule) => void;
  pendingAddAfterFlowId?: string;
  selectedFlowId?: string;
  siteUrl: string;
};

type SiteAddStepCardProps = {
  description: string;
  onClick?: () => void;
  title: string;
};

function SiteAddStepCard({
  description,
  onClick,
  title,
}: SiteAddStepCardProps) {
  return (
    <button
      aria-label={title}
      className={cn(
        "flex w-[23rem] items-center gap-4 rounded-xl border border-primary bg-white p-4 text-left shadow-sm ring-4 ring-primary/15 transition",
        onClick ? "hover:border-primary/80" : "cursor-default",
      )}
      data-canvas-action
      disabled={!onClick}
      onClick={onClick}
      type="button"
    >
      <span
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-md ring-1",
          getSiteModuleAccentClassName("start"),
        )}
      >
        <Home className="size-5" />
      </span>
      <span>
        <span className="block text-headline font-semibold text-[#111827]">
          {title}
        </span>
        <span className="mt-1 block text-callout font-semibold text-[#6b7280]">
          {description}
        </span>
      </span>
    </button>
  );
}

export function SiteCanvas({
  category,
  modules,
  onAddAfter,
  onOpenModulePanel,
  onRemove,
  onSelect,
  pendingAddAfterFlowId,
  selectedFlowId,
  siteUrl,
}: SiteCanvasProps) {
  const canvasRef = React.useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = React.useState(1);
  const dragState = React.useRef({
    active: false,
    left: 0,
    moved: false,
    startX: 0,
    startY: 0,
    top: 0,
  });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    window.requestAnimationFrame(() => {
      canvas.scrollLeft = Math.max(
        (canvas.scrollWidth - canvas.clientWidth) / 2,
        0,
      );
      canvas.scrollTop = 0;
    });
  }, []);

  function startPan(event: React.PointerEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    if (event.button !== 0 || target.closest("[data-canvas-action]")) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    dragState.current = {
      active: true,
      left: canvas.scrollLeft,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      top: canvas.scrollTop,
    };
    canvas.setPointerCapture(event.pointerId);
  }

  function panCanvas(event: React.PointerEvent<HTMLDivElement>) {
    const canvas = canvasRef.current;
    if (!canvas || !dragState.current.active) return;

    if (
      Math.abs(event.clientX - dragState.current.startX) > 4 ||
      Math.abs(event.clientY - dragState.current.startY) > 4
    ) {
      dragState.current.moved = true;
    }

    canvas.scrollLeft =
      dragState.current.left - (event.clientX - dragState.current.startX);
    canvas.scrollTop =
      dragState.current.top - (event.clientY - dragState.current.startY);
  }

  function stopPan(event: React.PointerEvent<HTMLDivElement>) {
    const canvas = canvasRef.current;
    dragState.current.active = false;
    canvas?.releasePointerCapture(event.pointerId);
  }

  function stopDraggedClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!dragState.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
    dragState.current.moved = false;
  }

  function zoomCanvas(event: React.WheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey && !event.metaKey) return;

    event.preventDefault();
    setZoom((current) =>
      Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, current - event.deltaY * WHEEL_ZOOM_SENSITIVITY),
      ),
    );
  }

  return (
    <>
      <div
        className="absolute inset-0 cursor-grab overflow-auto [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        onClickCapture={stopDraggedClick}
        onPointerCancel={stopPan}
        onPointerDown={startPan}
        onPointerMove={panCanvas}
        onPointerUp={stopPan}
        onWheel={zoomCanvas}
        ref={canvasRef}
      >
        <div
          className="relative"
          style={{
            minHeight: CANVAS_HEIGHT * zoom,
            minWidth: CANVAS_WIDTH * zoom,
          }}
        >
          <div
            className={cn(
              "relative flex min-h-[1100px] min-w-[980px] justify-center px-28 pb-28",
              "items-start pt-[20vh]",
            )}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            <div className="mx-auto flex w-[23rem] flex-col items-center">
              {modules.length === 0 ? (
                <SiteAddStepCard
                  description="Choose what customers see first"
                  onClick={() => {
                    onAddAfter(undefined);
                    onOpenModulePanel();
                  }}
                  title="Add first step"
                />
              ) : null}

              {modules.map((module, index) => {
                const definition = getSiteModuleDefinition(module.moduleId);
                if (!definition) return null;
                const isLast = index === modules.length - 1;
                const isAddingAfter =
                  isLast && pendingAddAfterFlowId === module.flowId;
                const display = getSiteModuleDisplay(definition, category);

                return (
                  <React.Fragment key={module.flowId}>
                    <SiteModuleCard
                      canRemove
                      definition={definition}
                      display={display}
                      module={module}
                      onRemove={onRemove}
                      onSelect={onSelect}
                      selected={selectedFlowId === module.flowId}
                      siteUrl={siteUrl}
                    />

                    {isAddingAfter ? (
                      <>
                        <div className="flex h-8 flex-col items-center">
                          <div className="h-4 w-px bg-border" />
                          <div className="h-4 w-px bg-border" />
                        </div>
                        <SiteAddStepCard
                          description="Choose what customers see next"
                          title="Add step"
                        />
                      </>
                    ) : null}

                    <div
                      className={cn(
                        "flex flex-col items-center",
                        isLast ? "mb-16 mt-[10%] h-12" : "h-8",
                      )}
                    >
                      <div
                        className={cn(
                          "w-px bg-border",
                          isLast
                            ? "relative h-2 before:absolute before:bottom-full before:h-[2.3rem] before:w-px before:bg-border"
                            : "h-4",
                        )}
                      />
                      {isLast ? (
                        <button
                          aria-label={`Add step after ${display.title}`}
                          className={cn(
                            "flex size-10 items-center justify-center rounded-full border border-border bg-white text-[#6b7280] shadow-sm transition hover:border-primary hover:text-primary",
                            "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-border disabled:hover:text-[#6b7280]",
                          )}
                          data-canvas-action
                          disabled={isAddingAfter}
                          onClick={() => {
                            onAddAfter(module.flowId);
                            onOpenModulePanel();
                          }}
                          type="button"
                        >
                          <Plus className="size-5" />
                        </button>
                      ) : (
                        <div className="h-4 w-px bg-border" />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
