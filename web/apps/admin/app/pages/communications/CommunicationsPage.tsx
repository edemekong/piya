import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@piya/ui";
import {
  showToast,
  useCreateCommunicationMutation,
  useDeleteCommunicationMutation,
  useGetCommunicationRecipientsQuery,
  useGetCommunicationsQuery,
  useUpdateCommunicationMutation,
  type AppDispatch,
} from "@piya/shared";
import type {
  CommunicationAdminData as CommunicationData,
  CommunicationEditorMode,
  CommunicationInput,
} from "@piya/shared/types";
import { useDispatch } from "react-redux";
import {
  CommunicationActionDialog,
  type CommunicationAction,
  CommunicationEditorSheet,
  CommunicationRecipientsSheet,
  CommunicationStatsBar,
  CommunicationViewSheet,
  CommunicationsTable,
} from "./components";

export function CommunicationsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: queriedCommunications = [],
    isError: isCommunicationsError,
    isLoading: isCommunicationsLoading,
  } = useGetCommunicationsQuery();
  const [createCommunication, createCommunicationState] =
    useCreateCommunicationMutation();
  const [updateCommunication, updateCommunicationState] =
    useUpdateCommunicationMutation();
  const [deleteCommunication, deleteCommunicationState] =
    useDeleteCommunicationMutation();
  const [editorMode, setEditorMode] =
    React.useState<CommunicationEditorMode>("create");
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [selectedCommunication, setSelectedCommunication] =
    React.useState<CommunicationData | null>(null);
  const [viewingCommunication, setViewingCommunication] =
    React.useState<CommunicationData | null>(null);
  const [recipientsCommunication, setRecipientsCommunication] =
    React.useState<CommunicationData | null>(null);
  const [pendingAction, setPendingAction] = React.useState<{
    action: CommunicationAction;
    communication: CommunicationData;
  } | null>(null);
  const { data: recipients = [] } = useGetCommunicationRecipientsQuery(
    recipientsCommunication?.id ?? "",
    { skip: !recipientsCommunication },
  );
  const communications = queriedCommunications;
  const isSavingCommunication =
    createCommunicationState.isLoading || updateCommunicationState.isLoading;

  const stats = React.useMemo(
    () => ({
      active: communications.filter((item) => item.status === "active").length,
      paused: communications.filter((item) => item.status === "paused").length,
      recipients: communications.reduce(
        (total, item) => total + item.stats.recipients,
        0,
      ),
      total: communications.length,
    }),
    [communications],
  );

  function openCreateEditor() {
    setEditorMode("create");
    setSelectedCommunication(null);
    setIsEditorOpen(true);
  }

  function openEditEditor(communication: CommunicationData) {
    setEditorMode("edit");
    setSelectedCommunication(communication);
    setIsEditorOpen(true);
  }

  async function handleSave(communication: CommunicationData) {
    const input = getCommunicationInput(communication);

    if (editorMode === "edit" && selectedCommunication) {
      await updateCommunication({
        communicationId: selectedCommunication.id,
        input,
      }).unwrap();
    } else {
      await createCommunication(input).unwrap();
    }

    setIsEditorOpen(false);
    setSelectedCommunication(null);
  }

  function requestStatusChange(communication: CommunicationData) {
    setPendingAction({
      action: communication.status === "active" ? "pause" : "enable",
      communication,
    });
  }

  async function confirmCommunicationAction() {
    if (!pendingAction) return;

    const { action, communication } = pendingAction;

    try {
      if (action === "delete") {
        await deleteCommunication(communication.id).unwrap();
      } else {
        const isEnabling = action === "enable";
        await updateCommunication({
          communicationId: communication.id,
          input: getCommunicationInput({
            ...communication,
            isActive: isEnabling,
            status: isEnabling ? "active" : "paused",
          }),
        }).unwrap();
      }

      showToast(dispatch, {
        message:
          action === "delete"
            ? "Communication deleted."
            : `Communication ${action === "enable" ? "enabled" : "paused"}.`,
        variant: "success",
      });
      setPendingAction(null);
    } catch (error) {
      showToast(dispatch, {
        message: getCommunicationActionErrorMessage(error, action),
        variant: "error",
      });
    }
  }

  return (
    <>
      <div className="grid gap-6">
        <header className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-title-1 font-semibold text-[#2F4B4F]">
              Communications
            </h1>
            <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
              Create, edit, and track customer messages across automated and
              broadcast journeys.
            </p>
          </div>
          <Button icon={<Plus />} onClick={openCreateEditor}>
            Add communication
          </Button>
        </header>

        <CommunicationStatsBar stats={stats} />

        <CommunicationsTable
          communications={communications}
          isError={isCommunicationsError}
          isLoading={isCommunicationsLoading}
          onDelete={(communication) =>
            setPendingAction({ action: "delete", communication })
          }
          onEdit={openEditEditor}
          onStatusChange={requestStatusChange}
          onView={setViewingCommunication}
          onViewRecipients={setRecipientsCommunication}
        />
      </div>

      <CommunicationEditorSheet
        communication={selectedCommunication}
        mode={editorMode}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSave}
        open={isEditorOpen}
        saving={isSavingCommunication}
      />
      <CommunicationViewSheet
        communication={viewingCommunication}
        onClose={() => setViewingCommunication(null)}
        open={Boolean(viewingCommunication)}
      />
      <CommunicationRecipientsSheet
        communication={recipientsCommunication}
        onClose={() => setRecipientsCommunication(null)}
        open={Boolean(recipientsCommunication)}
        recipients={recipients}
      />
      <CommunicationActionDialog
        action={pendingAction?.action ?? "delete"}
        communication={pendingAction?.communication ?? null}
        loading={
          deleteCommunicationState.isLoading ||
          updateCommunicationState.isLoading
        }
        onClose={() => setPendingAction(null)}
        onConfirm={() => void confirmCommunicationAction()}
      />
    </>
  );
}

function getCommunicationInput(
  communication: CommunicationData,
): CommunicationInput {
  const {
    businessId: _businessId,
    createdAt: _createdAt,
    createdBy: _createdBy,
    id: _id,
    updatedAt: _updatedAt,
    ...input
  } = communication;

  return input;
}

function getCommunicationActionErrorMessage(
  error: unknown,
  action: CommunicationAction,
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return `Unable to ${action} this communication.`;
}
