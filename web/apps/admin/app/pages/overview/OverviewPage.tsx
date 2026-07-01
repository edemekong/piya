import * as React from "react";
import { Megaphone } from "lucide-react";
import { Button } from "@piya/ui";
import {
  useCreateCommunicationMutation,
  useGetContactsQuery,
} from "@piya/shared";
import type {
  CommunicationAdminData as CommunicationData,
  CommunicationInput,
} from "@piya/shared/types";
import { CommunicationEditorSheet } from "@/pages/communications/components";
import {
  CommunicationTrendChart,
  OfferingPerformance,
  OverviewStatsGrid,
  OverviewTrendChart,
  QuickActions,
  RecentConversations,
  RecentOrders,
} from "./components";

export function OverviewPage() {
  const { data: contactsPage } = useGetContactsQuery({ limit: 50 });
  const [createCommunication, createCommunicationState] =
    useCreateCommunicationMutation();
  const contacts = contactsPage?.contacts ?? [];
  const [isCommunicationSheetOpen, setIsCommunicationSheetOpen] =
    React.useState(false);

  async function handleCreateCommunication(communication: CommunicationData) {
    await createCommunication(getCommunicationInput(communication)).unwrap();
    setIsCommunicationSheetOpen(false);
  }

  return (
    <>
      <div className="grid gap-6">
        <header className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-2 text-title-1 font-semibold text-[#2F4B4F]">
              Overview
            </h1>
            <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
              Track contacts, communications, messaging, orders, and catalog
              performance across your business.
            </p>
          </div>
          <Button
            icon={<Megaphone />}
            onClick={() => setIsCommunicationSheetOpen(true)}
          >
            Create campaign
          </Button>
        </header>

        <OverviewStatsGrid contacts={contacts} />
        <div className="grid gap-6 xl:grid-cols-2">
          <OverviewTrendChart />
          <CommunicationTrendChart />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <RecentOrders />
          <QuickActions />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <OfferingPerformance />
          <RecentConversations />
        </div>
      </div>

      <CommunicationEditorSheet
        communication={null}
        mode="create"
        onClose={() => setIsCommunicationSheetOpen(false)}
        onSave={handleCreateCommunication}
        open={isCommunicationSheetOpen}
        saving={createCommunicationState.isLoading}
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
