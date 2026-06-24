import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { overviewTrend } from "../overview.mock";

export function OverviewTrendChart() {
  return (
    <section className="rounded-md bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
            Sales trend
          </h2>
          <p className="mt-1 text-callout text-[#2F4B4F]/70">
            Weekly sales and new contact movement.
          </p>
        </div>
        <p className="text-footnote font-semibold text-primary">Last 7 days</p>
      </div>

      <div className="mt-6">
        <div className="h-64 w-full">
          <ResponsiveContainer height="100%" width="100%">
            <LineChart
              data={overviewTrend}
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
                    dataKey === "revenue" ? formatMoney(numericValue) : numericValue,
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

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-caption-1 text-[#2F4B4F]/60">
          {overviewTrend.map((item) => (
            <div key={item.label}>
              <p>{item.label}</p>
              <p className="mt-1 font-semibold text-[#2F4B4F]">{item.contacts}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
