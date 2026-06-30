import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@piya/ui";
import {
  offeringEditorSteps,
  type OfferingEditorStep,
} from "./offering-editor-options";

function OfferingEditorStepper({
  activeStep,
  steps = offeringEditorSteps,
}: {
  activeStep: OfferingEditorStep;
  steps?: typeof offeringEditorSteps;
}) {
  const activeIndex = steps.findIndex(
    (step) => step.key === activeStep,
  );

  return (
    <div className="flex w-full items-center gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;

        return (
          <React.Fragment key={step.key}>
            <div className="flex shrink-0 items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-footnote font-semibold",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : isComplete
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-white text-[#2F4B4F]/55",
                )}
              >
                {isComplete ? <CheckCircle2 className="size-4" /> : index + 1}
              </span>
              <span
                className={cn(
                  "whitespace-nowrap text-callout font-semibold",
                  isActive || isComplete ? "text-primary" : "text-[#2F4B4F]/55",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span
                className={cn(
                  "h-px min-w-8 flex-1",
                  isComplete ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export { OfferingEditorStepper };
