import * as React from "react";
import {
  showToast,
  type AccountSetupPayload,
  type AppDispatch,
  type UserSettingsData,
  useUpdateCurrentUserMutation,
} from "@piya/shared";
import {
  Button,
  SettingsCard,
  SettingsSection as ProfileSectionShell,
} from "@piya/ui";
import { useDispatch } from "react-redux";
import { profileMenuItems } from "../profileSections";
import { getProfileErrorMessage } from "../profileErrorMessage";

const section = profileMenuItems.find(
  (item) => item.value === "notifications",
)!;

type NotificationSettings = UserSettingsData["notifications"];

const notificationOptions: Array<{
  description: string;
  field: keyof NotificationSettings;
  label: string;
}> = [
  {
    description: "Receive notifications on supported signed-in devices.",
    field: "pushEnabled",
    label: "Push notifications",
  },
  {
    description: "Receive account and business updates by email.",
    field: "emailEnabled",
    label: "Email notifications",
  },
  {
    description: "Receive supported alerts by SMS.",
    field: "smsEnabled",
    label: "SMS notifications",
  },
];

type NotificationsProfilePageProps = {
  accountSetup: AccountSetupPayload;
};

export function NotificationsProfilePage({
  accountSetup,
}: NotificationsProfilePageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [notifications, setNotifications] =
    React.useState<NotificationSettings>(
      accountSetup.user.settings.notifications,
    );
  const [updateCurrentUser, updateState] = useUpdateCurrentUserMutation();

  async function saveNotificationSettings() {
    try {
      const user = await updateCurrentUser({
        settings: { notifications },
      }).unwrap();

      setNotifications(user.settings.notifications);
      showToast(dispatch, {
        message: "Notification preferences saved.",
        variant: "success",
      });
    } catch (error) {
      showToast(dispatch, {
        message: getProfileErrorMessage(
          error,
          "Unable to save your notification preferences.",
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
          loadingLabel="Saving notification preferences"
          onClick={() => void saveNotificationSettings()}
          size="sm"
        >
          Save preferences
        </Button>
      }
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Notification delivery">
        <div className="grid gap-3">
          {notificationOptions.map((option) => (
            <label
              className="flex items-center justify-between gap-4 rounded-md bg-fill px-3 py-3"
              key={option.field}
            >
              <span>
                <span className="block font-semibold text-[#2F4B4F]">
                  {option.label}
                </span>
                <span className="mt-1 block text-footnote text-[#2F4B4F]/65">
                  {option.description}
                </span>
              </span>
              <input
                checked={notifications[option.field]}
                className="size-5 shrink-0 accent-primary"
                onChange={(event) =>
                  setNotifications((current) => ({
                    ...current,
                    [option.field]: event.target.checked,
                  }))
                }
                type="checkbox"
              />
            </label>
          ))}
        </div>
      </SettingsCard>
    </ProfileSectionShell>
  );
}
