import * as React from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import { AppSheet, Button, SegmentedTabs } from "@piya/ui";
import type { OfferingDisplayConfig } from "@/utils/offering-display";
import type { OfferingData } from "@piya/shared/models";
import type {
  BusinessCategoryTypes,
  OfferingFormDraft,
  OfferingType,
} from "@piya/shared/types";
import {
  createEmptyOfferingDraft,
  createOfferingDraft,
  draftToOffering,
} from "@piya/shared/utils";
import { AiOfferingPanel } from "./AiOfferingPanel";
import { OfferingEditorForm } from "./OfferingEditorForm";
import {
  getOfferingEditorSteps,
  getOfferingTypeDraftUpdates,
  getOfferingTypeOptions,
  type OfferingEditorStep,
} from "./offering-editor-options";

type EditorMode = "create" | "edit";
type EditorTab = "manual" | "ai";

type OfferingEditorSheetProps = {
  businessCategory?: BusinessCategoryTypes | null;
  display: OfferingDisplayConfig;
  mode: EditorMode;
  offering: OfferingData | null;
  onClose: () => void;
  onSave: (offering: OfferingData) => Promise<void> | void;
  open: boolean;
  saving?: boolean;
};

const editorTabs = [
  {
    icon: <ClipboardList className="size-4" />,
    label: "Manual",
    value: "manual",
  },
  {
    icon: <Sparkles className="size-4" />,
    label: "AI",
    value: "ai",
  },
] satisfies { icon: React.ReactNode; label: string; value: EditorTab }[];

export function OfferingEditorSheet({
  businessCategory = null,
  display,
  mode,
  offering,
  onClose,
  onSave,
  open,
  saving = false,
}: OfferingEditorSheetProps) {
  const [activeTab, setActiveTab] = React.useState<EditorTab>("manual");
  const [activeStep, setActiveStep] =
    React.useState<OfferingEditorStep>("basics");
  const [draft, setDraft] = React.useState<OfferingFormDraft>(
    createEmptyOfferingDraft,
  );
  const typeOptions = React.useMemo(
    () => getOfferingTypeOptions(businessCategory),
    [businessCategory],
  );

  React.useEffect(() => {
    if (open) {
      setActiveTab("manual");
      setActiveStep("basics");
      const nextDraft = offering
        ? createOfferingDraft(offering)
        : createEmptyOfferingDraft();
      const defaultType =
        !offering && typeOptions.length === 1 ? typeOptions[0].value : "";

      setDraft(
        defaultType
          ? { ...nextDraft, ...getOfferingTypeDraftUpdates(defaultType) }
          : nextDraft,
      );
    }
  }, [offering, open, typeOptions]);

  const isEditing = mode === "edit";
  const manualSteps = React.useMemo(
    () => getOfferingEditorSteps(draft.type),
    [draft.type],
  );
  const activeStepIndex = manualSteps.findIndex(
    (step) => step.key === activeStep,
  );
  const isFinalManualStep =
    activeTab === "manual" &&
    activeStepIndex === manualSteps.length - 1;
  const canSave = Boolean(draft.name.trim() && draft.type);
  const canContinue = canSave;

  function updateDraft(updates: Partial<OfferingFormDraft>) {
    setDraft((current) => ({ ...current, ...updates }));
  }

  function goToPreviousStep() {
    if (activeTab !== "manual" || activeStepIndex === 0) {
      onClose();
      return;
    }

    setActiveStep(manualSteps[activeStepIndex - 1].key);
  }

  function goToNextStep() {
    if (activeStepIndex >= manualSteps.length - 1) return;

    setActiveStep(manualSteps[activeStepIndex + 1].key);
  }

  function handleTypeChange(type: OfferingType | "") {
    setDraft((current) => ({
      ...current,
      ...getOfferingTypeDraftUpdates(type),
    }));

    if (activeStep === "configuration" && type !== "product") {
      setActiveStep("checkout");
    }
  }

  async function handleSave() {
    try {
      await onSave(draftToOffering({ ...draft, status: "active" }, offering));
      onClose();
    } catch {
      // Toast feedback is handled by the parent mutation handler.
    }
  }

  return (
    <AppSheet
      ariaLabel={
        isEditing
          ? `edit ${display.singular.toLowerCase()} sheet`
          : `create ${display.singular.toLowerCase()} sheet`
      }
      footer={
        activeTab === "manual" ? (
          <>
            <Button
              className="bg-fill text-[#2F4B4F] hover:bg-fill-secondary"
              icon={activeStepIndex === 0 ? undefined : <ChevronLeft />}
              onClick={goToPreviousStep}
              type="button"
              variant="secondary"
            >
              {activeStepIndex === 0 ? "Cancel" : "Back"}
            </Button>

            {!isFinalManualStep ? (
              <Button
                disabled={!canContinue}
                icon={<ChevronRight />}
                onClick={goToNextStep}
                type="button"
              >
                Continue
              </Button>
            ) : (
              <Button
                disabled={!canSave || saving}
                icon={<CheckCircle2 />}
                onClick={handleSave}
                type="button"
              >
                {saving ? "Publishing..." : "Publish"}
              </Button>
            )}
          </>
        ) : (
          <Button
            disabled={!canSave || saving}
            icon={<CheckCircle2 />}
            onClick={handleSave}
            type="button"
          >
            {saving ? "Publishing..." : "Publish"}
          </Button>
        )
      }
      maxWidthClassName={isEditing ? "max-w-4xl" : "max-w-[47.6rem]"}
      onClose={onClose}
      open={open}
      title={isEditing ? display.editTitle : display.createTitle}
    >
      <div className="grid gap-5">
        <SegmentedTabs
          items={editorTabs}
          onValueChange={setActiveTab}
          value={activeTab}
        />

        {activeTab === "manual" ? (
          <OfferingEditorForm
            activeStep={activeStep}
            businessCategory={businessCategory}
            draft={draft}
            onChange={updateDraft}
            namePlaceholder={display.namePlaceholder}
            steps={manualSteps}
            onTypeChange={handleTypeChange}
            typeOptions={typeOptions}
          />
        ) : (
          <AiOfferingPanel label={display.singular.toLowerCase()} />
        )}
      </div>
    </AppSheet>
  );
}
