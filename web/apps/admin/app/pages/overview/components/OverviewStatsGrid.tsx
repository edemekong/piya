import { Megaphone, Send, TrendingUp, Users } from "lucide-react";
import { StatCard } from "@yinapp/ui";
import type { ContactData } from "@yinapp/shared/types";
import { formatMoney } from "@yinapp/shared/utils";
import {
  communicationPerformance,
  communicationTrend,
  productPerformance,
} from "../overview.mock";

export function OverviewStatsGrid({ contacts }: { contacts: ContactData[] }) {
  const revenue = productPerformance.reduce(
    (total, product) => total + product.revenue,
    0,
  );
  const messagesSent = communicationTrend.reduce(
    (total, item) => total + item.received + item.failed,
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
      label: "Active communications",
      value: communicationPerformance
        .filter((communication) => communication.status === "Active")
        .length.toString(),
    },
    {
      icon: Send,
      label: "Messages sent",
      value: messagesSent.toLocaleString(),
    },
    {
      icon: TrendingUp,
      label: "Sales",
      value: formatMoney(revenue),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
