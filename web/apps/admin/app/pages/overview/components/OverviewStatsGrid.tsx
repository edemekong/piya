import { Megaphone, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@yinapp/ui";
import type { ContactData } from "@yinapp/shared/types";
import { campaignPerformance, productPerformance } from "../overview.mock";

export function OverviewStatsGrid({ contacts }: { contacts: ContactData[] }) {
  const revenue = productPerformance.reduce(
    (total, product) => total + product.revenue,
    0,
  );

  const overviewStats = [
    {
      icon: Users,
      label: "Total contacts",
      value: contacts.length.toString(),
    },
    {
      icon: Megaphone,
      label: "Active campaigns",
      value: campaignPerformance
        .filter((campaign) => campaign.status === "Active")
        .length.toString(),
    },
    {
      icon: TrendingUp,
      label: "Sales",
      value: formatMoney(revenue),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {overviewStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <StatCard
            className="shadow-sm"
            icon={<Icon className="size-5" />}
            key={stat.label}
            label={stat.label}
            value={stat.value}
          />
        );
      })}
    </div>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
