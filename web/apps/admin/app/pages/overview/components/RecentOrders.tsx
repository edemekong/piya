import { Badge, cn } from "@piya/ui";
import { useGetOrdersQuery } from "@piya/shared";
import type { OrderStatus } from "@piya/shared/models";
import {
  formatMoney,
  formatOrderLabel,
} from "@piya/shared/utils";

export function RecentOrders() {
  const { data: orders = [] } = useGetOrdersQuery();
  const recentOrders = [...orders]
    .sort((left, right) => right.createdAt - left.createdAt)
    .slice(0, 4);

  return (
    <section className="flex h-full min-h-[360px] flex-col rounded-md bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-title-3 font-semibold text-[#2F4B4F]">
          Recent orders
        </h2>
        <a
          className="text-callout font-semibold text-primary transition hover:underline"
          href="/orders"
        >
          View all
        </a>
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border text-caption-1 uppercase text-[#2F4B4F]/60">
              <th className="py-3 pr-4 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Total</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="py-3 pl-4 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr
                className="border-b border-border last:border-0"
                key={order.id}
              >
                <td className="py-3 pr-4">
                  <p className="truncate font-semibold text-[#2F4B4F]">
                    {order.contact.name}
                  </p>
                  <p className="mt-0.5 truncate text-footnote text-[#2F4B4F]/55">
                    {order.items[0]?.name ?? "Order item"}
                  </p>
                </td>
                <td className="px-4 py-3 text-callout font-semibold text-[#2F4B4F]">
                  {formatMoney(order.total, order.currency)}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="py-3 pl-4 text-callout text-[#2F4B4F]/65">
                  {formatRelativeTime(order.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const className =
    status === "fulfilled" || status === "completed"
      ? "border-success/20 bg-success/10 text-success"
      : status === "cancelled" || status === "archived"
      ? "border-error/20 bg-error/10 text-error"
      : status === "pending"
      ? "border-secondary-dark/20 bg-secondary/40 text-primary"
      : "border-border bg-white text-[#2F4B4F]/65";

  return (
    <Badge
      className={cn(
        "h-auto rounded-full px-2.5 py-1 text-caption-1 font-semibold",
        className
      )}
    >
      {formatOrderLabel(status)}
    </Badge>
  );
}

function formatRelativeTime(timestamp: number) {
  const diffInMinutes = Math.max(
    1,
    Math.round((Date.now() - timestamp) / (1000 * 60))
  );

  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.round(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;

  const diffInDays = Math.round(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
}
