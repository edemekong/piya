import { Activity, CirclePause, Send } from "lucide-react";
import { formatNumber } from "@piya/shared/utils";

type CommunicationStatsBarProps = {
  stats: {
    active: number;
    paused: number;
    recipients: number;
    total: number;
  };
};

export function CommunicationStatsBar({ stats }: CommunicationStatsBarProps) {
  const items = [
    { icon: Send, label: "Total", value: stats.total },
    { icon: Activity, label: "Active", value: stats.active },
    { icon: CirclePause, label: "Paused", value: stats.paused },
    { icon: Send, label: "Recipients", value: stats.recipients },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div className="rounded-md bg-white p-5 shadow-sm" key={item.label}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-footnote text-[#2F4B4F]/60">{item.label}</p>
                <p className="mt-2 text-title-2 font-semibold text-[#2F4B4F]">
                  {formatNumber(item.value)}
                </p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-md bg-secondary text-primary">
                <Icon className="size-5" />
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
