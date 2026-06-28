import * as React from "react";
import {
  showToast,
  type AccountSetupBusinessProfileInput,
  type AccountSetupPayload,
  type AppDispatch,
  type BusinessCategoryTypes,
  useUpdateAccountSetupMutation,
} from "@piya/shared";
import {
  Button,
  PhoneNumberField,
  SettingsCard,
  SettingsSection as ProfileSectionShell,
  isValidSupportedPhoneNumber,
} from "@piya/ui";
import { useDispatch } from "react-redux";
import { businessCategories } from "@/pages/auth/utils/account-setup-options";
import { profileMenuItems } from "../profileSections";
import {
  FieldGrid,
  ProfileField,
  ProfileSelect,
  ProfileTextarea,
} from "../components/ProfileFields";
import { getProfileErrorMessage } from "../profileErrorMessage";

const section = profileMenuItems.find((item) => item.value === "business")!;

type BusinessProfilePageProps = {
  accountSetup: AccountSetupPayload;
};

export function BusinessProfilePage({
  accountSetup,
}: BusinessProfilePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const business = accountSetup.business;
  const [businessProfile, setBusinessProfile] =
    React.useState<AccountSetupBusinessProfileInput>(() => ({
      name: business?.name ?? "",
      category: business?.category ?? "fashion_store",
      description: business?.description ?? "",
      email: business?.email ?? "",
      phoneNumber: business?.phoneNumber ?? "",
      logo: business?.logo ?? "",
    }));
  const [updateAccountSetup, updateState] = useUpdateAccountSetupMutation();

  function updateBusinessProfile<
    TField extends keyof AccountSetupBusinessProfileInput,
  >(field: TField, value: AccountSetupBusinessProfileInput[TField]) {
    setBusinessProfile((current) => ({ ...current, [field]: value }));
  }

  async function saveBusinessProfile() {
    if (!businessProfile.name.trim()) {
      showToast(dispatch, {
        message: "Enter a business name.",
        variant: "error",
      });
      return;
    }

    if (!businessProfile.description.trim()) {
      showToast(dispatch, {
        message: "Enter a business description.",
        variant: "error",
      });
      return;
    }

    if (
      businessProfile.phoneNumber &&
      !isValidSupportedPhoneNumber(businessProfile.phoneNumber)
    ) {
      showToast(dispatch, {
        message: "Enter a valid business phone number.",
        variant: "error",
      });
      return;
    }

    try {
      const result = await updateAccountSetup({
        step: "business-profile",
        input: {
          ...businessProfile,
          name: businessProfile.name.trim(),
          description: businessProfile.description.trim(),
          email: businessProfile.email || undefined,
          phoneNumber: businessProfile.phoneNumber || undefined,
        },
      }).unwrap();
      const savedBusiness = result.business;

      if (savedBusiness) {
        setBusinessProfile((current) => ({
          ...current,
          name: savedBusiness.name,
          category: savedBusiness.category,
          description: savedBusiness.description,
          email: savedBusiness.email ?? "",
          phoneNumber: savedBusiness.phoneNumber ?? "",
          logo: savedBusiness.logo ?? "",
        }));
      }

      showToast(dispatch, {
        message: "Business details saved.",
        variant: "success",
      });
    } catch (error) {
      showToast(dispatch, {
        message: getProfileErrorMessage(
          error,
          "Unable to save your business details.",
        ),
        variant: "error",
      });
    }
  }

  return (
    <ProfileSectionShell
      actions={
        <Button
          buttonState={updateState.isLoading ? "loading" : "enabled"}
          loadingLabel="Saving business details"
          onClick={() => void saveBusinessProfile()}
          size="sm"
        >
          Save changes
        </Button>
      }
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Business identity">
        <FieldGrid>
          <ProfileField
            label="Business name"
            onChange={(event) =>
              updateBusinessProfile("name", event.target.value)
            }
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
    </ProfileSectionShell>
  );
}
