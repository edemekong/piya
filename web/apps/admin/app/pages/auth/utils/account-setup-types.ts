import type {
  AccountSetupBrandDetailsInput,
  AccountSetupBusinessProfileInput,
  AccountSetupPersonalInfoInput,
} from "@piya/shared";
import type { LucideIcon } from "lucide-react";

type SetupStepId =
  | "personal-info"
  | "business-profile"
  | "brand-details"
  | "integration"
  | "team";

type SetupStep = {
  id: SetupStepId;
  title: string;
  description: string;
  icon: LucideIcon;
  optional?: boolean;
};

type SetupDraft = {
  personalInfo: AccountSetupPersonalInfoInput;
  businessProfile: AccountSetupBusinessProfileInput;
  brandDetails: AccountSetupBrandDetailsInput;
};

export type { SetupDraft, SetupStep, SetupStepId };
