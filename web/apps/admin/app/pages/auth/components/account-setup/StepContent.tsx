import type * as React from "react";
import { BrandDetailsStep } from "./BrandDetailsStep";
import { BusinessProfileStep } from "./BusinessProfileStep";
import { IntegrationStep } from "./IntegrationStep";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { TeamStep } from "./TeamStep";
import type {
  SetupDraft,
  SetupStepId,
} from "@/pages/auth/utils/account-setup-types";

type StepContentProps = {
  draft: SetupDraft;
  email: string;
  setDraft: React.Dispatch<React.SetStateAction<SetupDraft>>;
  stepId: SetupStepId;
};

function StepContent({ draft, email, setDraft, stepId }: StepContentProps) {
  switch (stepId) {
    case "personal-info":
      return (
        <PersonalInfoStep draft={draft} email={email} setDraft={setDraft} />
      );
    case "business-profile":
      return <BusinessProfileStep draft={draft} setDraft={setDraft} />;
    case "brand-details":
      return <BrandDetailsStep draft={draft} setDraft={setDraft} />;
    case "integration":
      return <IntegrationStep />;
    case "team":
      return <TeamStep />;
    default:
      return null;
  }
}

export { StepContent };
