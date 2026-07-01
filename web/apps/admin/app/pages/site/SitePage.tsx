import * as React from "react";
import {
  showToast,
  type AppDispatch,
  useGetAccountSetupQuery,
  useGetSiteFlowQuery,
  useUpdateSiteFlowMutation,
} from "@piya/shared";
import { Button } from "@piya/ui";
import { ExternalLink, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import {
  getSiteModuleRequirement,
  getNextSiteModuleGroupId,
  getSiteModuleDefinition,
  getSiteModuleDisplay,
  getSiteModuleGroupTitle,
} from "./site-modules";
import type {
  SiteFlowModule,
  SiteModuleDefinition,
  SiteModuleGroupId,
  SiteModuleId,
} from "./types";
import { SiteCanvas, SiteModulePanel } from "./components";

function createFlowModule(moduleId: SiteModuleId): SiteFlowModule {
  return {
    moduleId,
    flowId: `${moduleId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  };
}

function getActiveAddGroupIds(
  groupId: SiteModuleGroupId | undefined,
  isEmpty: boolean,
): SiteModuleGroupId[] {
  if (isEmpty) return ["start", "browse"];
  if (groupId === "browse") return ["browse", "customer-action"];
  if (groupId === "customer-action") return ["customer-action", "finish"];
  if (groupId === "finish") return ["finish"];

  return [getNextSiteModuleGroupId(groupId) as SiteModuleGroupId];
}

export function SitePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: accountSetup } = useGetAccountSetupQuery();
  const [modules, setModules] = React.useState<SiteFlowModule[]>([]);
  const [hasLoadedFlow, setHasLoadedFlow] = React.useState(false);
  const [pendingSaveCount, setPendingSaveCount] = React.useState(0);
  const [insertAfterFlowId, setInsertAfterFlowId] = React.useState<string>();
  const [selectedModule, setSelectedModule] =
    React.useState<SiteModuleDefinition>();
  const [selectedFlowId, setSelectedFlowId] = React.useState<string>();
  const {
    data: siteFlowPayload,
    error: siteFlowError,
    isFetching: isFetchingSiteFlow,
    isLoading: isLoadingSiteFlow,
    refetch: refetchSiteFlow,
  } = useGetSiteFlowQuery();
  const [updateSiteFlow] = useUpdateSiteFlowMutation();
  const saveQueueRef = React.useRef<Promise<void>>(Promise.resolve());

  React.useEffect(() => {
    if (!siteFlowPayload || hasLoadedFlow) return;

    setModules(siteFlowPayload.flow?.modules ?? []);
    setHasLoadedFlow(true);
  }, [hasLoadedFlow, siteFlowPayload]);

  React.useEffect(() => {
    if (!siteFlowError || !hasLoadedFlow) return;

    showToast(dispatch, {
      message: getSiteFlowErrorMessage(
        siteFlowError,
        "Unable to refresh your Site flow.",
      ),
      variant: "error",
    });
  }, [dispatch, hasLoadedFlow, siteFlowError]);

  const businessCategory = accountSetup?.business?.category ?? null;
  const businessSlug = accountSetup?.business?.slug;
  const siteUrl = businessSlug
    ? `https://${businessSlug}.piya.store`
    : undefined;
  const exampleSiteUrl = siteUrl ?? "https://your-site.piya.store";
  const insertAfterModule =
    modules.find((module) => module.flowId === insertAfterFlowId) ??
    modules[modules.length - 1];
  const insertAfterDefinition = insertAfterModule
    ? getSiteModuleDefinition(insertAfterModule.moduleId)
    : undefined;
  const activeAddGroupId = getNextSiteModuleGroupId(
    insertAfterDefinition?.groupId,
  ) as SiteModuleGroupId;
  const activeAddGroupIds = getActiveAddGroupIds(
    insertAfterDefinition?.groupId,
    modules.length === 0,
  );
  const insertAfterIndex = insertAfterFlowId
    ? modules.findIndex((module) => module.flowId === insertAfterFlowId)
    : modules.length - 1;
  const priorModuleIds = modules
    .slice(0, insertAfterIndex + 1)
    .map((module) => module.moduleId);
  const addedModuleIds = modules.map((module) => module.moduleId);

  function persistModules(
    nextModules: SiteFlowModule[],
    successMessage?: string,
  ) {
    setPendingSaveCount((current) => current + 1);
    saveQueueRef.current = saveQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        await updateSiteFlow({ modules: nextModules }).unwrap();
        if (successMessage) {
          showToast(dispatch, {
            message: successMessage,
            variant: "success",
          });
        }
      })
      .catch((error) => {
        showToast(dispatch, {
          message: getSiteFlowErrorMessage(
            error,
            "Unable to save your Site flow.",
          ),
          variant: "error",
        });
      })
      .finally(() => {
        setPendingSaveCount((current) => Math.max(0, current - 1));
      });
  }

  function addModule(moduleId: SiteModuleId) {
    if (getSiteModuleRequirement(moduleId, priorModuleIds, businessCategory)) {
      return;
    }

    const nextModule = createFlowModule(moduleId);
    const insertIndex = insertAfterFlowId
      ? modules.findIndex((module) => module.flowId === insertAfterFlowId)
      : -1;
    const nextModules =
      insertIndex === -1
        ? [...modules, nextModule]
        : [
            ...modules.slice(0, insertIndex + 1),
            nextModule,
            ...modules.slice(insertIndex + 1),
          ];

    setModules(nextModules);
    persistModules(nextModules);

    setSelectedFlowId(undefined);
    setSelectedModule(undefined);
    setInsertAfterFlowId(undefined);
  }

  function removeModule(flowId: string) {
    const nextModules = modules.filter((module) => module.flowId !== flowId);
    setModules(nextModules);
    persistModules(nextModules);
    if (selectedFlowId === flowId) {
      setSelectedFlowId(undefined);
      setSelectedModule(undefined);
    }
    if (insertAfterFlowId === flowId) {
      setInsertAfterFlowId(undefined);
    }
  }

  function selectFlowModule(module: SiteFlowModule) {
    setSelectedFlowId(module.flowId);
    setSelectedModule(getSiteModuleDefinition(module.moduleId));
  }

  function showAddModules() {
    setSelectedFlowId(undefined);
    setSelectedModule(undefined);
  }

  function saveCurrentFlow() {
    persistModules(modules, "Site flow saved.");
  }

  if (isLoadingSiteFlow && !hasLoadedFlow) {
    return (
      <div
        aria-live="polite"
        className="flex h-[calc(100vh-4rem)] items-center justify-center overflow-hidden"
        role="status"
      >
        <span
          aria-hidden="true"
          className="size-7 animate-spin rounded-full border-2 border-primary border-t-transparent"
        />
        <span className="sr-only">Loading Site flow</span>
      </div>
    );
  }

  if (siteFlowError && !hasLoadedFlow) {
    return (
      <div className="grid h-[calc(100vh-4rem)] place-content-center gap-4 overflow-hidden rounded-md border border-border bg-white p-6 text-center">
        <p className="text-callout text-error">
          {getSiteFlowErrorMessage(
            siteFlowError,
            "Unable to load your Site flow.",
          )}
        </p>
        <Button
          buttonState={isFetchingSiteFlow ? "loading" : "enabled"}
          loadingLabel="Loading Site flow"
          onClick={() => void refetchSiteFlow()}
          size="sm"
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="grid h-[calc(100vh-4rem)] min-h-0 grid-rows-[auto_minmax(0,1fr)] gap-4 overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-4 rounded-md bg-white px-5 py-4 shadow-sm">
        <p className="max-w-2xl text-callout text-[#2F4B4F]/75">
          Shape the journey customers follow, preview the experience, and save
          the current flow.
        </p>

        <div className="flex items-center gap-3">
          {siteUrl ? (
            <Button asChild className="group relative" size="sm" variant="link">
              <a
                href={siteUrl}
                rel="noreferrer"
                target="_blank"
              >
                <ExternalLink />
                Preview site
                <span className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-50 -translate-x-1/2 whitespace-nowrap rounded-sm bg-[#102A2D] px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  {siteUrl}
                </span>
              </a>
            </Button>
          ) : (
            <Button buttonState="disabled" size="sm" variant="link">
              Preview site
            </Button>
          )}
          <Button
            buttonState={pendingSaveCount > 0 ? "loading" : "enabled"}
            icon={<Save />}
            loadingLabel="Saving Site flow"
            onClick={saveCurrentFlow}
            size="sm"
          >
            Save changes
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 grid-cols-[minmax(0,1fr)_25rem] gap-6 overflow-hidden">
        <div className="relative overflow-hidden rounded-md border border-border bg-[#f8fafc] shadow-sm">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <SiteCanvas
            category={businessCategory}
            modules={modules}
            onAddAfter={setInsertAfterFlowId}
            onOpenModulePanel={showAddModules}
            onRemove={removeModule}
            onSelect={selectFlowModule}
            pendingAddAfterFlowId={insertAfterFlowId}
            selectedFlowId={selectedFlowId}
            siteUrl={exampleSiteUrl}
          />
        </div>

        <SiteModulePanel
          activeGroupIds={activeAddGroupIds}
          activeGroupTitle={getSiteModuleGroupTitle(activeAddGroupId)}
          category={businessCategory}
          insertAfterTitle={
            insertAfterDefinition
              ? getSiteModuleDisplay(insertAfterDefinition, businessCategory)
                  .title
              : undefined
          }
          mode={selectedModule ? "customize" : "add"}
          addedModuleIds={addedModuleIds}
          onAddModule={addModule}
          onBackToAdd={showAddModules}
          priorModuleIds={priorModuleIds}
          selectedModule={selectedModule}
        />
      </div>
    </div>
  );
}

function getSiteFlowErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return error instanceof Error ? error.message : fallback;
}
