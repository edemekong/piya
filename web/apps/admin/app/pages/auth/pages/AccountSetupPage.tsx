import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  MessageCircle,
  Palette,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import {
  showToast,
  type AppDispatch,
  type BusinessData,
  type UserData,
  useGetAccountSetupQuery,
  useUpdateAccountSetupMutation,
} from "@piya/shared";
import { Button, cn, isValidSupportedPhoneNumber } from "@piya/ui";
import { useDispatch } from "react-redux";
import { StepContent } from "@/pages/auth/components/account-setup";
import type {
  SetupDraft,
  SetupStep,
  SetupStepId,
} from "@/pages/auth/utils/account-setup-types";
import {
  ACCOUNT_SETUP_PATH,
  DEFAULT_AUTHENTICATED_PATH,
  getReturnToFromSearch,
  getSafeReturnTo,
} from "@/utils/auth-routing";
import { useAdminAuthRedirect } from "@/utils/use-admin-auth-redirect";

const setupSteps: SetupStep[] = [
  {
    id: "personal-info",
    title: "Personal info",
    description: "Your name and admin contact details",
    icon: Users,
  },
  {
    id: "business-profile",
    title: "Business profile",
    description: "Store identity and operating details",
    icon: Building2,
  },
  {
    id: "brand-details",
    title: "Brand details",
    description: "Tone, visuals, and customer promise",
    icon: Palette,
  },
  {
    id: "integration",
    title: "Integration",
    description: "Connect the services your workspace depends on",
    icon: MessageCircle,
    optional: true,
  },
  {
    id: "team",
    title: "Team",
    description: "Invite teammates and assign roles",
    icon: Users,
    optional: true,
  },
];

const initialSetupDraft: SetupDraft = {
  personalInfo: {
    name: "",
    gender: null,
    phoneNumber: "",
    profileImage: "",
    profileImageUrl: "",
  },
  businessProfile: {
    name: "",
    category: "fashion_store",
    domain: "",
    description: "",
    email: "",
    phoneNumber: "",
  },
  brandDetails: {
    logo: "",
    favicon: "",
    coverImage: "",
    primaryColor: "#2F4B4F",
    secondaryColor: "#F4C95D",
    accentColor: "#F6F8F7",
    socialLinks: {
      instagram: "",
      x: "",
      facebook: "",
      linkedin: "",
    },
  },
};

export function AccountSetupPage() {
  const authStatus = useAdminAuthRedirect("account-setup");
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const activeStepId = getSetupStepId(location.search);
  const activeStep = setupSteps.findIndex((step) => step.id === activeStepId);
  const currentStepIndex = activeStep === -1 ? 0 : activeStep;
  const [draft, setDraft] = useState<SetupDraft>(initialSetupDraft);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);
  const [isFinishingSetup, setIsFinishingSetup] = useState(false);
  const [maxVisitedStepIndex, setMaxVisitedStepIndex] =
    useState(currentStepIndex);
  const currentStep = setupSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === setupSteps.length - 1;
  const isOptionalStep = currentStep.optional === true;
  const {
    data: accountSetup,
    error: accountSetupLoadError,
  } = useGetAccountSetupQuery(undefined, {
    skip: authStatus !== "ready",
  });
  const [updateAccountSetup] = useUpdateAccountSetupMutation();

  useEffect(() => {
    if (new URLSearchParams(location.search).get("step")) return;

    const params = new URLSearchParams(location.search);
    params.set("step", activeStepId);
    navigate(`${ACCOUNT_SETUP_PATH}?${params.toString()}`, { replace: true });
  }, [activeStepId, location.search, navigate]);

  useEffect(() => {
    if (!accountSetup || isDraftLoaded) return;

    setDraft(createSetupDraft(accountSetup.user, accountSetup.business));
    setIsDraftLoaded(true);
  }, [accountSetup, isDraftLoaded]);

  useEffect(() => {
    if (!accountSetupLoadError || isDraftLoaded) return;

    showToast(dispatch, {
      message: getAccountSetupErrorMessage(
        accountSetupLoadError,
        "Unable to load saved account setup. Empty fields are shown so you can continue.",
      ),
      variant: "error",
    });
    setIsDraftLoaded(true);
  }, [accountSetupLoadError, dispatch, isDraftLoaded]);

  useEffect(() => {
    setMaxVisitedStepIndex((current) => Math.max(current, currentStepIndex));
  }, [currentStepIndex]);

  function showPreviousStep() {
    showVisitedStepByIndex(Math.max(currentStepIndex - 1, 0));
  }

  function showNextStep() {
    showStepByIndex(Math.min(currentStepIndex + 1, setupSteps.length - 1));
  }

  function showStepByIndex(index: number) {
    const step = setupSteps[index] ?? setupSteps[0];
    const params = new URLSearchParams(location.search);
    params.set("step", step.id);
    setMaxVisitedStepIndex((current) => Math.max(current, index));
    navigate(`${ACCOUNT_SETUP_PATH}?${params.toString()}`);
  }

  function showVisitedStepByIndex(index: number) {
    if (index > maxVisitedStepIndex) return;

    const step = setupSteps[index] ?? setupSteps[0];
    const params = new URLSearchParams(location.search);
    params.set("step", step.id);
    navigate(`${ACCOUNT_SETUP_PATH}?${params.toString()}`);
  }

  async function saveCurrentStep() {
    if (currentStep.id === "personal-info") {
      if (!isValidSupportedPhoneNumber(draft.personalInfo.phoneNumber)) {
        throw new Error("Enter a valid phone number.");
      }

      await updateAccountSetup({
        step: "personal-info",
        input: {
          name: draft.personalInfo.name,
          gender: draft.personalInfo.gender ?? null,
          phoneNumber: emptyStringToUndefined(draft.personalInfo.phoneNumber),
          profileImage: emptyStringToUndefined(draft.personalInfo.profileImage),
          profileImageUrl: emptyStringToUndefined(
            draft.personalInfo.profileImageUrl,
          ),
        },
      }).unwrap();
      return;
    }

    if (currentStep.id === "business-profile") {
      if (
        draft.businessProfile.phoneNumber &&
        !isValidSupportedPhoneNumber(draft.businessProfile.phoneNumber)
      ) {
        throw new Error("Enter a valid business phone number.");
      }

      await updateAccountSetup({
        step: "business-profile",
        input: {
          name: draft.businessProfile.name,
          category: draft.businessProfile.category,
          domain: draft.businessProfile.domain,
          description: draft.businessProfile.description,
          email: emptyStringToUndefined(draft.businessProfile.email),
          phoneNumber: emptyStringToUndefined(
            draft.businessProfile.phoneNumber,
          ),
          logo: emptyStringToUndefined(draft.businessProfile.logo),
        },
      }).unwrap();
      return;
    }

    if (currentStep.id === "brand-details") {
      const result = await updateAccountSetup({
        step: "brand-details",
        input: {
          logo: emptyStringToUndefined(draft.brandDetails.logo),
          logoBase64: draft.brandDetails.logoBase64,
          favicon: emptyStringToUndefined(draft.brandDetails.favicon),
          faviconBase64: draft.brandDetails.faviconBase64,
          coverImage: emptyStringToUndefined(draft.brandDetails.coverImage),
          coverImageBase64: draft.brandDetails.coverImageBase64,
          primaryColor: draft.brandDetails.primaryColor,
          secondaryColor: emptyStringToUndefined(
            draft.brandDetails.secondaryColor,
          ),
          accentColor: emptyStringToUndefined(draft.brandDetails.accentColor),
          socialLinks: getNonEmptySocialLinks(draft.brandDetails.socialLinks),
        },
      }).unwrap();
      const branding = result.business?.branding;

      if (branding) {
        setDraft((current) => ({
          ...current,
          brandDetails: {
            ...current.brandDetails,
            logo: branding.logo ?? "",
            logoBase64: undefined,
            favicon: branding.favicon ?? "",
            faviconBase64: undefined,
            coverImage: branding.coverImage ?? "",
            coverImageBase64: undefined,
          },
        }));
      }
    }
  }

  async function continueFromCurrentStep() {
    setIsFinishingSetup(true);

    try {
      await saveCurrentStep();
      showNextStep();
    } catch (error) {
      const message = getAccountSetupErrorMessage(
        error,
        "Unable to save this account setup step. Please try again.",
      );
      showToast(dispatch, {
        message,
        variant: "error",
      });
    } finally {
      setIsFinishingSetup(false);
    }
  }

  async function finishSetup() {
    setIsFinishingSetup(true);

    try {
      await updateAccountSetup({ step: "complete", input: {} }).unwrap();
      const returnTo = getSafeReturnTo(
        getReturnToFromSearch(location.search),
        DEFAULT_AUTHENTICATED_PATH,
      );
      navigate(returnTo, { replace: true });
    } catch (error) {
      const message = getAccountSetupErrorMessage(
        error,
        "Unable to finish account setup. Please try again.",
      );
      showToast(dispatch, {
        message,
        variant: "error",
      });
    } finally {
      setIsFinishingSetup(false);
    }
  }

  if (authStatus !== "ready") return null;

  return (
    <main className="min-h-screen bg-background px-10 py-10 text-foreground">
      <section className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-[1160px] flex-col">
        <div className="grid flex-1 items-start gap-[13px] lg:grid-cols-[320px_1fr]">
          <aside className="sticky top-10 flex max-h-[calc(100vh-80px)] flex-col self-start pb-card pl-0 pr-card pt-0">
            <p className="pl-2 text-title3 font-semibold text-primary">
              Account setup
            </p>

            <div className="mt-8 space-y-2">
              {setupSteps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStepIndex;
                const isComplete = index < currentStepIndex;
                const isVisited = index <= maxVisitedStepIndex;

                return (
                  <button
                    className={cn(
                      "group grid w-full grid-cols-[32px_1fr] gap-3 p-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
                      isVisited
                        ? "hover:text-primary"
                        : "cursor-not-allowed opacity-55",
                      isActive && "text-primary",
                    )}
                    disabled={!isVisited}
                    key={step.id}
                    onClick={() => showVisitedStepByIndex(index)}
                    type="button"
                  >
                    <span className="relative flex justify-center">
                      {index < setupSteps.length - 1 ? (
                        <span
                          className={cn(
                            "absolute left-1/2 top-8 h-[calc(100%+8px)] w-px -translate-x-1/2 bg-border",
                            isComplete && "bg-primary",
                          )}
                        />
                      ) : null}
                      <span
                        className={cn(
                          "relative z-10 flex size-8 items-center justify-center rounded-full border bg-white text-text-tertiary transition",
                          isActive && "border-primary bg-primary text-white",
                          isComplete &&
                            "border-primary bg-secondary text-primary",
                        )}
                      >
                        {isComplete ? (
                          <Check className="size-4" />
                        ) : (
                          <StepIcon className="size-4" />
                        )}
                      </span>
                    </span>

                    <span className="min-w-0 pt-1.5">
                      <span
                        className={cn(
                          "block text-footnote font-normal text-[#2F4B4F]",
                          isActive && "font-semibold text-primary",
                        )}
                      >
                        {step.title}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-8">
              <span className="inline-flex rounded-full bg-secondary px-4 py-2 text-footnote font-semibold text-primary">
                {Math.round(((currentStepIndex + 1) / setupSteps.length) * 100)}
                % complete
              </span>
            </div>
          </aside>

          <section className="flex min-h-[calc(100vh-80px)] flex-col rounded-lg bg-white p-card">
            <div className="flex items-start justify-between gap-4 pb-4">
              <div className="space-y-1">
                <h2 className="text-title1 font-semibold text-[#102F34]">
                  {currentStep.title}
                </h2>
                <p className="text-callout leading-relaxed text-text-secondary">
                  {currentStep.description}
                </p>
              </div>
              <p className="shrink-0 text-footnote font-semibold text-primary">
                {currentStepIndex + 1} of {setupSteps.length}
              </p>
            </div>

            <form
              className="flex flex-1 flex-col"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex-1 py-6">
                {!isDraftLoaded ? (
                  <div className="max-w-[820px] rounded-sm border border-border bg-fill p-4">
                    <p className="text-callout text-text-secondary">
                      Loading saved account setup...
                    </p>
                  </div>
                ) : (
                  <StepContent
                    draft={draft}
                    email={accountSetup?.user.email ?? ""}
                    setDraft={setDraft}
                    stepId={currentStep.id}
                  />
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  disabled={isFirstStep}
                  icon={<ArrowLeft />}
                  onClick={showPreviousStep}
                  type="button"
                  variant="secondary"
                >
                  Back
                </Button>

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                  {isOptionalStep ? (
                    <button
                      className="text-callout font-semibold text-primary underline underline-offset-4 transition hover:text-[#2F4B4F]"
                      disabled={!isDraftLoaded || isFinishingSetup}
                      onClick={showNextStep}
                      type="button"
                    >
                      Skip for now
                    </button>
                  ) : null}

                  <Button
                    disabled={!isDraftLoaded || isFinishingSetup}
                    onClick={isLastStep ? finishSetup : continueFromCurrentStep}
                    trailing={<ArrowRight />}
                    type="button"
                  >
                    {isLastStep
                      ? isFinishingSetup
                        ? "Finishing..."
                        : "Finish setup"
                      : isFinishingSetup
                        ? "Saving..."
                        : "Continue"}
                  </Button>
                </div>
              </div>
            </form>
          </section>
        </div>
      </section>
    </main>
  );
}

function getAccountSetupErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}

function createSetupDraft(
  user: UserData,
  business?: BusinessData | null,
): SetupDraft {
  const branding = business?.branding;

  return {
    personalInfo: {
      name: user.name,
      gender: user.gender ?? null,
      phoneNumber: user.phoneNumber ?? "",
      profileImage: "",
      profileImageUrl: user.profileImageUrl ?? "",
      dob: user.dob ?? null,
    },
    businessProfile: {
      name: business?.name ?? "",
      category: business?.category ?? "fashion_store",
      domain: business?.domain ?? "",
      description: business?.description ?? "",
      email: business?.email ?? "",
      phoneNumber: business?.phoneNumber ?? "",
      logo: business?.logo ?? "",
    },
    brandDetails: {
      logo: branding?.logo ?? "",
      favicon: branding?.favicon ?? "",
      coverImage: branding?.coverImage ?? "",
      primaryColor: branding?.primaryColor ?? "#2F4B4F",
      secondaryColor: branding?.secondaryColor ?? "#F4C95D",
      accentColor: branding?.accentColor ?? "#F6F8F7",
      socialLinks: {
        instagram: branding?.socialLinks?.instagram ?? "",
        x: branding?.socialLinks?.x ?? "",
        facebook: branding?.socialLinks?.facebook ?? "",
        linkedin: branding?.socialLinks?.linkedin ?? "",
      },
    },
  };
}

function getSetupStepId(search: string): SetupStepId {
  const step = new URLSearchParams(search).get("step");

  if (setupSteps.some((setupStep) => setupStep.id === step)) {
    return step as SetupStepId;
  }

  return "personal-info";
}

function emptyStringToUndefined(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function getNonEmptySocialLinks(
  socialLinks: Record<string, string> | null | undefined,
) {
  if (!socialLinks) return undefined;

  const entries = Object.entries(socialLinks).filter(
    ([, value]) => value.trim().length > 0,
  );

  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}
