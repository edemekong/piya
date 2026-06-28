import * as React from "react";
import { useSearchParams } from "@remix-run/react";
import {
  showToast,
  type AccountSetupPayload,
  type AppDispatch,
  useGetAccountSetupQuery,
} from "@piya/shared";
import { Button } from "@piya/ui";
import { useDispatch } from "react-redux";
import { ProfileSidebar } from "./components";
import {
  BrandingProfilePage,
  BusinessProfilePage,
  IntegrationProfilePage,
  MembersProfilePage,
  NotificationsProfilePage,
  PersonalProfilePage,
  SecurityProfilePage,
} from "./pages";
import { getProfileErrorMessage } from "./profileErrorMessage";
import type { ProfileSection } from "./profileSections";

export function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSection = getProfilePage(searchParams.get("page"));
  const {
    data: accountSetup,
    error: accountSetupError,
    isFetching,
    isLoading,
    refetch,
  } = useGetAccountSetupQuery();

  React.useEffect(() => {
    if (isProfileSection(searchParams.get("page"))) return;

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("section");
    nextSearchParams.set("page", "personal");
    setSearchParams(nextSearchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  React.useEffect(() => {
    if (!accountSetupError) return;

    showToast(dispatch, {
      message: getProfileErrorMessage(
        accountSetupError,
        "Unable to load your profile.",
      ),
      variant: "error",
    });
  }, [accountSetupError, dispatch]);

  function showProfilePage(page: ProfileSection) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.delete("section");
    nextSearchParams.set("page", page);
    setSearchParams(nextSearchParams);
  }

  return (
    <div className="grid gap-6">
      <header className="rounded-md bg-white p-6 shadow-sm">
        <h1 className="text-title-1 font-semibold text-[#2F4B4F]">Profile</h1>
        <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
          Manage your account, business profile, team, and messaging setup.
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
        <ProfileSidebar
          activeSection={activeSection}
          onSectionChange={showProfilePage}
        />
        {isLoading ? (
          <div
            aria-live="polite"
            className="flex min-h-40 items-center justify-center rounded-md border border-border bg-white p-6"
            role="status"
          >
            <span
              aria-hidden="true"
              className="size-7 animate-spin rounded-full border-2 border-primary border-t-transparent"
            />
            <span className="sr-only">Loading your profile</span>
          </div>
        ) : accountSetup ? (
          <ProfileSectionContent
            accountSetup={accountSetup}
            section={activeSection}
          />
        ) : (
          <div className="grid gap-4 rounded-md border border-border bg-white p-6">
            <p className="text-callout text-error">
              Unable to load your profile.
            </p>
            <Button
              buttonState={isFetching ? "loading" : "enabled"}
              className="w-fit"
              loadingLabel="Loading profile"
              onClick={() => void refetch()}
              size="sm"
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function isProfileSection(section: string | null): section is ProfileSection {
  return (
    section === "personal" ||
    section === "business" ||
    section === "branding" ||
    section === "members" ||
    section === "channels" ||
    section === "notifications" ||
    section === "security"
  );
}

function getProfilePage(page: string | null): ProfileSection {
  return isProfileSection(page) ? page : "personal";
}

function ProfileSectionContent({
  accountSetup,
  section,
}: {
  accountSetup: AccountSetupPayload;
  section: ProfileSection;
}) {
  switch (section) {
    case "business":
      return <BusinessProfilePage accountSetup={accountSetup} />;
    case "branding":
      return <BrandingProfilePage accountSetup={accountSetup} />;
    case "members":
      return <MembersProfilePage />;
    case "channels":
      return <IntegrationProfilePage />;
    case "security":
      return <SecurityProfilePage />;
    case "notifications":
      return <NotificationsProfilePage accountSetup={accountSetup} />;
    case "personal":
    default:
      return <PersonalProfilePage accountSetup={accountSetup} />;
  }
}
