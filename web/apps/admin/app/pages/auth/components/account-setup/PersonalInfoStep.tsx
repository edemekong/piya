import type * as React from "react";
import { useRef, useState } from "react";
import type { AccountSetupPersonalInfoInput } from "@piya/shared";
import { Button, PhoneNumberField, SettingsCard } from "@piya/ui";
import { Upload, UserRound } from "lucide-react";
import {
  FieldGrid,
  ProfileField,
  ProfileSelect,
} from "@/pages/profile/components/ProfileFields";
import { genderOptions } from "@/pages/auth/utils/account-setup-options";
import type { SetupDraft } from "@/pages/auth/utils/account-setup-types";

type PersonalInfoStepProps = {
  draft: SetupDraft;
  email: string;
  setDraft: React.Dispatch<React.SetStateAction<SetupDraft>>;
};

function PersonalInfoStep({ draft, email, setDraft }: PersonalInfoStepProps) {
  const personalInfo = draft.personalInfo;
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [profileImageError, setProfileImageError] = useState("");
  const profileImagePreview =
    personalInfo.profileImage || personalInfo.profileImageUrl;

  function updatePersonalInfo<TField extends keyof AccountSetupPersonalInfoInput>(
    field: TField,
    value: AccountSetupPersonalInfoInput[TField],
  ) {
    setDraft((current) => ({
      ...current,
      personalInfo: {
        ...current.personalInfo,
        [field]: value,
      },
    }));
  }

  function handleProfileImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
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

  return (
    <div className="max-w-[820px] space-y-4">
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
              onChange={handleProfileImageChange}
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
            onChange={(event) => updatePersonalInfo("name", event.target.value)}
            placeholder="Enter full name"
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
            value={personalInfo.phoneNumber ?? ""}
          />
          <ProfileSelect
            label="Gender"
            onChange={(event) =>
              updatePersonalInfo(
                "gender",
                event.target.value
                  ? (event.target
                      .value as AccountSetupPersonalInfoInput["gender"])
                  : null,
              )
            }
            options={genderOptions}
            value={personalInfo.gender ?? ""}
          />
          <ProfileField
            disabled
            inputClassName="disabled:cursor-not-allowed disabled:opacity-60"
            label="Email"
            type="email"
            value={email}
          />
        </FieldGrid>
      </SettingsCard>
    </div>
  );
}

export { PersonalInfoStep };
