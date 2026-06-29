import * as React from "react";
import { Megaphone } from "lucide-react";
import { Button } from "@piya/ui";
import { useGetContactsQuery } from "@piya/shared";
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
  const contacts = contactsPage?.contacts ?? [];
  const [isCommunicationSheetOpen, setIsCommunicationSheetOpen] =
    React.useState(false);

  return (
    <>
      <div className="grid gap-6">
        <header className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="mt-2 text-title-1 font-semibold text-[#2F4B4F]">
              Overview
            </h1>
            <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
              Track contacts, communications, messaging, orders, and offering
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
        open={isCommunicationSheetOpen}
      />
    </>
  );
}
