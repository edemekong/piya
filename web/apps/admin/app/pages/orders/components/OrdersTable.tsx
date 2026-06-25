import * as React from "react";
import {
  Archive,
  Eye,
  MessageCircle,
  MoreVertical,
  Route,
} from "lucide-react";
import { AppAvatar, Badge, cn } from "@yinapp/ui";
import type {
  OrderData,
  OrderItem,
  OrderStatus,
} from "@yinapp/shared/models";
import {
  formatDate,
  formatMoney,
  formatOrderLabel,
  getItemCountLabel,
  getPrimaryOrderType,
  isTrackableOrder,
} from "./orderUtils";

type OrdersTableProps = {
  orders: OrderData[];
  onContactSelect: (order: OrderData) => void;
  onItemSelect: (item: OrderItem) => void;
  onSendMessage: (order: OrderData) => void;
  onView: (order: OrderData) => void;
};

export function OrdersTable({
  orders,
  onContactSelect,
  onItemSelect,
  onSendMessage,
  onView,
}: OrdersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-caption-1 uppercase text-[#2F4B4F]/60">
            <th className="py-3 pr-4 font-semibold">Order / customer</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Items</th>
            <th className="px-4 py-3 font-semibold">Total</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Date</th>
            <th className="py-3 pl-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr className="border-b border-border last:border-0" key={order.id}>
              <td className="py-4 pr-4">
                <div className="grid gap-1">
                  <button
                    className="w-fit text-left font-semibold text-[#2F4B4F] transition hover:underline"
                    onClick={() => onView(order)}
                    type="button"
                  >
                    # {order.shareId}
                  </button>
                  <button
                    className="group flex w-fit items-center gap-1 text-left"
                    onClick={() => onContactSelect(order)}
                    type="button"
                  >
                    <AppAvatar
                      className="size-4 text-[9px] text-white"
                      name={order.contact.name}
                    />
                    <span className="text-callout text-[#2F4B4F]/65 transition group-hover:text-[#2F4B4F] group-hover:underline">
                      {order.contact.name}
                    </span>
                  </button>
                </div>
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                <span className="inline-flex rounded-full border border-border bg-fill px-2.5 py-1 text-caption-1 font-semibold text-[#2F4B4F]/65">
                  {formatOrderLabel(getPrimaryOrderType(order))}
                </span>
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                <p className="font-semibold text-[#2F4B4F]">
                  {getItemCountLabel(order)}
                </p>
                <div className="mt-1 flex max-w-xs flex-wrap gap-x-1 gap-y-0.5 text-footnote text-[#2F4B4F]/60">
                  {order.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {item.offeringId ? (
                        <button
                          className="transition hover:text-[#2F4B4F] hover:underline"
                          onClick={() => onItemSelect(item)}
                          type="button"
                        >
                          {item.name}
                        </button>
                      ) : (
                        <span>{item.name}</span>
                      )}
                      {index < order.items.length - 1 ? <span>,</span> : null}
                    </React.Fragment>
                  ))}
                </div>
              </td>
              <td className="px-4 py-4 text-callout font-semibold text-[#2F4B4F]">
                {formatMoney(order.total, order.currency)}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={order.status} />
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/65">
                {formatDate(order.createdAt)}
              </td>
              <td className="py-4 pl-4">
                <OrderActions
                  order={order}
                  onContactSelect={onContactSelect}
                  onSendMessage={onSendMessage}
                  onView={onView}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
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
          : "border-border bg-fill text-[#2F4B4F]/65";

  return (
    <Badge
      className={cn(
        "h-auto rounded-full px-3 py-1.5 text-caption-1 font-semibold",
        className,
      )}
    >
      {formatOrderLabel(status)}
    </Badge>
  );
}

function OrderActions({
  order,
  onContactSelect,
  onSendMessage,
  onView,
}: {
  order: OrderData;
  onContactSelect: (order: OrderData) => void;
  onSendMessage: (order: OrderData) => void;
  onView: (order: OrderData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const trackable = isTrackableOrder(order);

  return (
    <div className="relative flex justify-end">
      <button
        aria-expanded={open}
        aria-label={`Open actions for ${order.id}`}
        className="flex size-9 items-center justify-center rounded-full text-[#2F4B4F]/65 transition hover:bg-fill hover:text-[#2F4B4F]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <MoreVertical className="size-5" />
      </button>

      {open ? (
        <div className="absolute right-0 top-10 z-20 w-52 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
          <ActionMenuItem
            icon={<Eye className="size-4" />}
            label="View contact"
            onClick={() => {
              setOpen(false);
              onContactSelect(order);
            }}
          />
          <ActionMenuItem
            disabled={!trackable}
            icon={<Route className="size-4" />}
            label="Track"
            onClick={() => {
              setOpen(false);
              if (trackable) onView(order);
            }}
          />
          <ActionMenuItem
            icon={<MessageCircle className="size-4" />}
            label="Send message"
            onClick={() => {
              setOpen(false);
              onSendMessage(order);
            }}
          />
          <ActionMenuItem
            destructive
            icon={<Archive className="size-4" />}
            label="Archive order"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

function ActionMenuItem({
  destructive = false,
  disabled = false,
  icon,
  label,
  onClick,
}: {
  destructive?: boolean;
  disabled?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-disabled={disabled || undefined}
      className={cn(
        "flex w-full items-center gap-3 border-b border-border px-5 py-3 text-left transition last:border-b-0 hover:bg-fill",
        destructive ? "text-error" : "text-[#2F4B4F]",
        disabled && "cursor-not-allowed text-[#2F4B4F]/35 hover:bg-white",
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}
