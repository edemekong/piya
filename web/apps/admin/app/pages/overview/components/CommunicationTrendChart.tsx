import * as React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { OverviewRange } from "@piya/shared/types";
import { communicationTrend } from "../overview.mock";
import { OverviewRangeSelect } from "./OverviewRangeSelect";

export function CommunicationTrendChart() {
  const [range, setRange] = React.useState<OverviewRange>("last_7_days");
  const totals = communicationTrend.reduce(
    (summary, item) => ({
      failed: summary.failed + item.failed,
      opened: summary.opened + item.opened,
      received: summary.received + item.received,
      unsubscribed: summary.unsubscribed + item.unsubscribed,
    }),
    { failed: 0, opened: 0, received: 0, unsubscribed: 0 }
  );
  const messagesSent = totals.received + totals.failed;
  const deliveryRate = messagesSent
    ? Math.round((totals.received / messagesSent) * 100)
    : 0;

  return (
    <section className="h-full min-h-[360px] rounded-md bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="grid gap-2">
          <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
            Communication trend
          </h2>
          <OverviewRangeSelect onChange={setRange} value={range} />
        </div>
        <div className="flex flex-wrap items-start gap-5">
          <Metric label="Messages sent" value={messagesSent.toLocaleString()} />
          <Metric label="Delivery rate" value={`${deliveryRate}%`} />
        </div>
      </div>

      <div className="mt-8 h-56 w-full">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart
            data={communicationTrend}
            margin={{ bottom: 0, left: 0, right: 8, top: 8 }}
          >
            <CartesianGrid stroke="rgb(var(--color-border))" vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="label"
              tick={{ fill: "#2F4B4F", fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#2F4B4F", fontSize: 12 }}
              tickLine={false}
              width={36}
            />
            <Tooltip
              contentStyle={{
                border: "1px solid rgb(var(--color-border))",
                borderRadius: 8,
                color: "#2F4B4F",
              }}
            />
            <Line
              dataKey="received"
              dot={false}
              name="Received"
              stroke="#0F766E"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              dataKey="opened"
              dot={false}
              name="Opened"
              stroke="#2563EB"
              strokeWidth={3}
              type="monotone"
            />
            <Line
              dataKey="failed"
              dot={false}
              name="Failed"
              stroke="#DC2626"
              strokeWidth={2}
              type="monotone"
            />
            <Line
              dataKey="unsubscribed"
              dot={false}
              name="Unsubscribed"
              stroke="#6B7280"
              strokeWidth={2}
              type="monotone"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap gap-3 text-caption-1 font-semibold text-[#2F4B4F]/65">
        <Legend color="#0F766E" label="Received" />
        <Legend color="#2563EB" label="Opened" />
        <Legend color="#DC2626" label="Failed" />
        <Legend color="#6B7280" label="Unsubscribed" />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption-1 text-[#2F4B4F]/65">{label}</p>
      <p className="mt-0.5 text-headline font-semibold text-[#2F4B4F]">
        {value}
      </p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
