import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@yinapp/ui";
import {
  getCommunicationRecipients,
  getCommunications,
} from "@/services/communications.service";
import type {
  CommunicationData,
  CommunicationEditorMode,
} from "./types";
import {
  CommunicationCardsList,
  CommunicationEditorSheet,
  CommunicationRecipientsSheet,
  CommunicationStatsBar,
  CommunicationViewSheet,
} from "./components";

const initialCommunications = getCommunications();

export function CommunicationsPage() {
  const [communications, setCommunications] =
    React.useState<CommunicationData[]>(initialCommunications);
  const [editorMode, setEditorMode] =
    React.useState<CommunicationEditorMode>("create");
  const [isEditorOpen, setIsEditorOpen] = React.useState(false);
  const [selectedCommunication, setSelectedCommunication] =
    React.useState<CommunicationData | null>(null);
  const [viewingCommunication, setViewingCommunication] =
    React.useState<CommunicationData | null>(null);
  const [recipientsCommunication, setRecipientsCommunication] =
    React.useState<CommunicationData | null>(null);

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

  const recipients = recipientsCommunication
    ? getCommunicationRecipients(recipientsCommunication.id)
    : [];

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

  function handlePause(communication: CommunicationData) {
    setCommunications((current) =>
      current.map((item) =>
        item.id === communication.id
          ? { ...item, isActive: false, status: "paused" }
          : item,
      ),
    );
  }

  function handleDelete(communication: CommunicationData) {
    setCommunications((current) =>
      current.filter((item) => item.id !== communication.id),
    );
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

        <CommunicationCardsList
          communications={communications}
          onDelete={handleDelete}
          onEdit={openEditEditor}
          onPause={handlePause}
          onView={setViewingCommunication}
          onViewRecipients={setRecipientsCommunication}
        />
      </div>

      <CommunicationEditorSheet
        communication={selectedCommunication}
        mode={editorMode}
        onClose={() => setIsEditorOpen(false)}
        open={isEditorOpen}
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
    </>
  );
}
