import type {
  AccountSetupBrandDetailsInput,
  AccountSetupBusinessProfileInput,
  AccountSetupEmailIntegrationInput,
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
  integration: {
    domainConnected: boolean;
    email: AccountSetupEmailIntegrationInput;
    emailConnected: boolean;
    slug: string;
  };
};

export type { SetupDraft, SetupStep, SetupStepId };
