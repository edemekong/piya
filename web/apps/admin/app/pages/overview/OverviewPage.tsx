import { Megaphone } from "lucide-react";
import { Button } from "@yinapp/ui";
import { getContacts } from "@/services/contacts.service";
import {
  OverviewStatsGrid,
  OverviewTrendChart,
  ProductPerformance,
  RecentConversations,
} from "./components";

const contacts = getContacts();

export function OverviewPage() {
  return (
    <div className="grid gap-6">
      <header className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="mt-2 text-title-1 font-semibold text-[#2F4B4F]">
            Overview
          </h1>
          <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
            Track contacts, campaigns, messaging, and product performance across your business.
          </p>
        </div>
        <Button icon={<Megaphone />}>
          Create campaign
        </Button>
      </header>

      <OverviewStatsGrid contacts={contacts} />
      <OverviewTrendChart />

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <ProductPerformance />
        <RecentConversations />
      </div>
    </div>
  );
}
