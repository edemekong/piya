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
import { formatMoney } from "@piya/shared/utils";
import type { OverviewRange } from "../overview.mock";
import { overviewTrend } from "../overview.mock";
import { OverviewRangeSelect } from "./OverviewRangeSelect";

export function OverviewTrendChart() {
  const [range, setRange] = React.useState<OverviewRange>("last_7_days");

  return (
    <section className="h-full min-h-[360px] rounded-md bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-2">
          <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
            Sales trend
          </h2>
          <OverviewRangeSelect onChange={setRange} value={range} />
        </div>
      </div>

      <div className="mt-6">
        <div className="h-56 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={overviewTrend}
              margin={{ bottom: 0, left: 0, right: 8, top: 8 }}
            >
              <CartesianGrid
                stroke="rgb(var(--color-border))"
                vertical={false}
              />
              <XAxis
                axisLine={false}
                dataKey="label"
                tick={{ fill: "#2F4B4F", fontSize: 12 }}
                tickLine={false}
              />
              <YAxis
                axisLine={false}
                tick={{ fill: "#2F4B4F", fontSize: 12 }}
                tickFormatter={(value: number) => `${value / 1000}k`}
                tickLine={false}
                width={44}
              />
              <Tooltip
                contentStyle={{
                  border: "1px solid rgb(var(--color-border))",
                  borderRadius: 8,
                  color: "#2F4B4F",
                }}
                formatter={(value, name) => {
                  const numericValue = Number(value ?? 0);
                  const dataKey = String(name);

                  return [
                    dataKey === "revenue"
                      ? formatMoney(numericValue)
                      : numericValue,
                    dataKey === "revenue" ? "Sales" : "Contacts",
                  ];
                }}
              />
              <Line
                dataKey="revenue"
                dot={{ fill: "rgb(var(--color-secondary))", r: 4 }}
                stroke="rgb(var(--color-primary))"
                strokeWidth={3}
                type="monotone"
              />
              <Line
                dataKey="contacts"
                dot={false}
                stroke="rgb(var(--color-secondary-dark))"
                strokeDasharray="4 4"
                strokeWidth={2}
                type="monotone"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-2 text-center text-caption-1 text-[#2F4B4F]/60">
          {overviewTrend.map((item) => (
            <div key={item.label}>
              <p>{item.label}</p>
              <p className="mt-1 font-semibold text-[#2F4B4F]">
                {item.contacts}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
