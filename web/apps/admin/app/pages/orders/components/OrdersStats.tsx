import { CheckCircle2, Clock3, PackageCheck, ReceiptText } from "lucide-react";
import { StatCard } from "@yinapp/ui";
import type { OrderData } from "@yinapp/shared/models";

type OrdersStatsProps = {
  orders: OrderData[];
};

export function OrdersStats({ orders }: OrdersStatsProps) {
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const completedOrders = orders.filter((order) =>
    ["fulfilled", "completed"].includes(order.status),
  ).length;
  const revenue = orders
    .filter((order) => order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        icon={<ReceiptText className="size-5" />}
        label="Total orders"
        value={orders.length.toLocaleString()}
      />
      <StatCard
        icon={<Clock3 className="size-5" />}
        label="Pending"
        value={pendingOrders.toLocaleString()}
      />
      <StatCard
        icon={<PackageCheck className="size-5" />}
        label="Fulfilled / completed"
        value={completedOrders.toLocaleString()}
      />
      <StatCard
        icon={<CheckCircle2 className="size-5" />}
        label="Revenue"
        value={formatCurrency(revenue)}
      />
    </section>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(value);
}
