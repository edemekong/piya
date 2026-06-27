import type * as React from "react";
import type {
  AccountSetupBusinessProfileInput,
  BusinessCategoryTypes,
} from "@piya/shared";
import { PhoneNumberField, SettingsCard } from "@piya/ui";
import {
  FieldGrid,
  ProfileField,
  ProfileSelect,
  ProfileTextarea,
} from "@/pages/profile/components/ProfileFields";
import { businessCategories } from "@/pages/auth/utils/account-setup-options";
import type { SetupDraft } from "@/pages/auth/utils/account-setup-types";

type BusinessProfileStepProps = {
  draft: SetupDraft;
  setDraft: React.Dispatch<React.SetStateAction<SetupDraft>>;
};

function BusinessProfileStep({ draft, setDraft }: BusinessProfileStepProps) {
  const businessProfile = draft.businessProfile;

  function updateBusinessProfile(
    field: keyof AccountSetupBusinessProfileInput,
    value: string,
  ) {
    setDraft((current) => ({
      ...current,
      businessProfile: {
        ...current.businessProfile,
        [field]: value,
      },
    }));
  }

  return (
    <div className="max-w-[820px] space-y-4">
      <SettingsCard title="Business identity">
        <FieldGrid>
          <ProfileField
            label="Business name"
            onChange={(event) =>
              updateBusinessProfile("name", event.target.value)
            }
            placeholder="Enter business name"
            required
            value={businessProfile.name}
          />
          <ProfileSelect
            label="Business category"
            onChange={(event) =>
              updateBusinessProfile(
                "category",
                event.target.value as BusinessCategoryTypes,
              )
            }
            options={businessCategories}
            value={businessProfile.category}
          />
        </FieldGrid>
        <ProfileTextarea
          label="Business description"
          onChange={(event) =>
            updateBusinessProfile("description", event.target.value)
          }
          placeholder="Enter business description"
          required
          value={businessProfile.description}
        />
      </SettingsCard>

      <SettingsCard title="Business contact">
        <FieldGrid>
          <ProfileField
            label="Business email"
            onChange={(event) =>
              updateBusinessProfile("email", event.target.value)
            }
            placeholder="Enter business email"
            type="email"
            value={businessProfile.email ?? ""}
          />
          <PhoneNumberField
            label="Business phone"
            onChange={(phoneNumber) =>
              updateBusinessProfile("phoneNumber", phoneNumber)
            }
            placeholder="Enter business phone"
            value={businessProfile.phoneNumber ?? ""}
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Service locations">
        <button
          className="flex h-12 w-full items-center justify-center rounded-sm border border-dashed border-[#2F4B4F]/25 bg-fill text-callout font-semibold text-[#2F4B4F]/65 transition hover:border-primary hover:bg-white hover:text-primary"
          type="button"
        >
          Add locations you operate
        </button>
      </SettingsCard>
    </div>
  );
}

export { BusinessProfileStep };
