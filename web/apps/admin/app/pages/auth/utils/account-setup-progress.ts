import { isValidSupportedPhoneNumber } from "@piya/ui";
import type { SetupDraft } from "./account-setup-types";

type AccountSetupProgressScope = "business-setup" | "personal-info";

const hexColorPattern = /^#[0-9a-f]{6}$/i;

function getAccountSetupCompletionPercentage(
  draft: SetupDraft,
  scope: AccountSetupProgressScope,
) {
  const personalInfoFields = [
    draft.personalInfo.name.trim().length > 0,
    isValidSupportedPhoneNumber(draft.personalInfo.phoneNumber),
  ];
  const requiredFields =
    scope === "personal-info"
      ? personalInfoFields
      : [
          ...personalInfoFields,
          draft.businessProfile.name.trim().length > 0,
          draft.businessProfile.description.trim().length > 0,
          hexColorPattern.test(draft.brandDetails.primaryColor.trim()),
        ];
  const completedFields = requiredFields.filter(Boolean).length;

  return Math.round((completedFields / requiredFields.length) * 100);
}

export { getAccountSetupCompletionPercentage };
