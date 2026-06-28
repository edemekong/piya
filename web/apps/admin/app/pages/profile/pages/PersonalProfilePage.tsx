import * as React from "react";
import {
  showToast,
  type AccountSetupPayload,
  type AccountSetupPersonalInfoInput,
  type AppDispatch,
  useUpdateAccountSetupMutation,
} from "@piya/shared";
import {
  Button,
  PhoneNumberField,
  SettingsCard,
  SettingsSection as ProfileSectionShell,
  isValidSupportedPhoneNumber,
} from "@piya/ui";
import { Upload, UserRound } from "lucide-react";
import { useDispatch } from "react-redux";
import { profileMenuItems } from "../profileSections";
import { FieldGrid, ProfileField } from "../components/ProfileFields";
import { getProfileErrorMessage } from "../profileErrorMessage";

const section = profileMenuItems.find((item) => item.value === "personal")!;

type PersonalProfilePageProps = {
  accountSetup: AccountSetupPayload;
};

export function PersonalProfilePage({
  accountSetup,
}: PersonalProfilePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const profileImageInputRef = React.useRef<HTMLInputElement>(null);
  const [profileImageError, setProfileImageError] = React.useState("");
  const [personalInfo, setPersonalInfo] =
    React.useState<AccountSetupPersonalInfoInput>(() => ({
      name: accountSetup.user.name,
      phoneNumber: accountSetup.user.phoneNumber ?? "",
      profileImageUrl: accountSetup.user.profileImageUrl ?? "",
      dob: accountSetup.user.dob ?? null,
      gender: accountSetup.user.gender ?? null,
    }));
  const [updateAccountSetup, updateState] = useUpdateAccountSetupMutation();
  const profileImagePreview =
    personalInfo.profileImage || personalInfo.profileImageUrl;

  function updatePersonalInfo<
    TField extends keyof AccountSetupPersonalInfoInput,
  >(field: TField, value: AccountSetupPersonalInfoInput[TField]) {
    setPersonalInfo((current) => ({ ...current, [field]: value }));
  }

  function selectProfileImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setProfileImageError("Upload a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setProfileImageError("Profile image must not exceed 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setProfileImageError("Unable to read image. Please try another file.");
        return;
      }

      setProfileImageError("");
      updatePersonalInfo("profileImage", reader.result);
    };
    reader.onerror = () => {
      setProfileImageError("Unable to read image. Please try another file.");
    };
    reader.readAsDataURL(file);
  }

  async function savePersonalInfo() {
    if (!personalInfo.name.trim()) {
      showToast(dispatch, {
        message: "Enter your full name.",
        variant: "error",
      });
      return;
    }

    if (!isValidSupportedPhoneNumber(personalInfo.phoneNumber)) {
      showToast(dispatch, {
        message: "Enter a valid phone number.",
        variant: "error",
      });
      return;
    }

    try {
      const profileImageUrl = personalInfo.profileImageUrl?.trim();
      const result = await updateAccountSetup({
        step: "personal-info",
        input: {
          name: personalInfo.name.trim(),
          phoneNumber: personalInfo.phoneNumber,
          dob: personalInfo.dob,
          gender: personalInfo.gender,
          ...(personalInfo.profileImage
            ? { profileImage: personalInfo.profileImage }
            : {}),
          ...(profileImageUrl ? { profileImageUrl } : {}),
        },
      }).unwrap();

      setPersonalInfo((current) => ({
        ...current,
        name: result.user.name,
        phoneNumber: result.user.phoneNumber ?? "",
        profileImage: undefined,
        profileImageUrl: result.user.profileImageUrl ?? "",
      }));
      showToast(dispatch, {
        message: "Personal profile saved.",
        variant: "success",
      });
    } catch (error) {
      showToast(dispatch, {
        message: getProfileErrorMessage(
          error,
          "Unable to save your personal profile.",
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
          loadingLabel="Saving personal profile"
          onClick={() => void savePersonalInfo()}
          size="sm"
        >
          Save changes
        </Button>
      }
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Profile image">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex size-20 shrink-0 overflow-hidden rounded-full bg-secondary text-primary">
            {profileImagePreview ? (
              <img
                alt=""
                className="size-full object-cover"
                src={profileImagePreview}
              />
            ) : (
              <span className="flex size-full items-center justify-center">
                <UserRound className="size-9" />
              </span>
            )}
          </span>
          <div className="min-w-0 space-y-2">
            <Button
              icon={<Upload />}
              onClick={() => profileImageInputRef.current?.click()}
              size="sm"
              type="button"
              variant="secondary"
            >
              Upload image
            </Button>
            <input
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={selectProfileImage}
              ref={profileImageInputRef}
              type="file"
            />
            <p className="text-callout text-[#2F4B4F]/65">
              JPG, PNG, or WebP. Recommended size 400x400.
            </p>
            {profileImageError ? (
              <p className="text-footnote text-error">{profileImageError}</p>
            ) : null}
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Personal information">
        <FieldGrid>
          <ProfileField
            label="Full name"
            onChange={(event) =>
              updatePersonalInfo("name", event.target.value)
            }
            required
            value={personalInfo.name}
          />
          <PhoneNumberField
            label="Phone number"
            onChange={(phoneNumber) =>
              updatePersonalInfo("phoneNumber", phoneNumber)
            }
            placeholder="Enter phone number"
            required
            value={personalInfo.phoneNumber}
          />
          <ProfileField
            disabled
            inputClassName="disabled:cursor-not-allowed disabled:opacity-60"
            label="Email address"
            type="email"
            value={accountSetup.user.email}
          />
        </FieldGrid>
      </SettingsCard>
    </ProfileSectionShell>
  );
}
