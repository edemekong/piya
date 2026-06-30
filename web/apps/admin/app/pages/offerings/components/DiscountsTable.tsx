import * as React from "react";
import { CalendarDays, MoreVertical, Pencil, TicketPercent, Trash2 } from "lucide-react";
import { cn } from "@piya/ui";
import type { DiscountData } from "@piya/shared/models";
import {
  formatDiscountDate,
  formatDiscountLabel,
} from "@piya/shared/utils";

type DiscountsTableProps = {
  discounts: DiscountData[];
  onEdit: (discount: DiscountData) => void;
  onView: (discount: DiscountData) => void;
};

export function DiscountsTable({
  discounts,
  onEdit,
  onView,
}: DiscountsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[900px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-caption-1 text-[#2F4B4F]/60">
            <th className="py-3 pr-4 font-semibold">Discount</th>
            <th className="px-4 py-3 font-semibold">Reward</th>
            <th className="px-4 py-3 font-semibold">Code</th>
            <th className="px-4 py-3 font-semibold">Rules</th>
            <th className="px-4 py-3 font-semibold">Schedule</th>
            <th className="py-3 pl-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr className="border-b border-border last:border-0" key={discount.id}>
              <td className="py-4 pr-4">
                <button
                  className="flex items-center gap-3 text-left"
                  onClick={() => onView(discount)}
                  type="button"
                >
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-fill text-[#2F4B4F]/55">
                    <TicketPercent className="size-5" />
                  </span>
                  <span>
                    <p className="font-semibold text-[#2F4B4F]">
                      {discount.title}
                    </p>
                    <p className="mt-1 line-clamp-1 max-w-xs text-callout text-[#2F4B4F]/65">
                      {discount.description}
                    </p>
                  </span>
                </button>
              </td>
              <td className="px-4 py-4">
                <p className="text-callout font-semibold text-[#2F4B4F]">
                  {formatReward(discount)}
                </p>
                <p className="mt-1 text-caption-1 text-[#2F4B4F]/60">
                  {formatDiscountLabel(discount.reward.type)}
                </p>
              </td>
              <td className="px-4 py-4 text-callout font-semibold text-[#2F4B4F]">
                {formatCode(discount)}
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                <p>{formatMinimum(discount)}</p>
                <p className="mt-1 text-caption-1 text-[#2F4B4F]/60">
                  {discount.rules.maxUsesPerContact} use
                  {discount.rules.maxUsesPerContact === 1 ? "" : "s"} per contact
                </p>
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-[#2F4B4F]/45" />
                  {formatDiscountDate(discount.startsAt)}
                </span>
                <p className="mt-1 text-caption-1 text-[#2F4B4F]/60">
                  Ends {formatDiscountDate(discount.endsAt).toLowerCase()}
                </p>
              </td>
              <td className="py-4 pl-4">
                <DiscountActions discount={discount} onEdit={onEdit} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DiscountActions({
  discount,
  onEdit,
}: {
  discount: DiscountData;
  onEdit: (discount: DiscountData) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative flex justify-end">
      <button
        aria-expanded={open}
        aria-label={`Open actions for ${discount.title}`}
        className="flex size-9 items-center justify-center rounded-full text-[#2F4B4F]/65 transition hover:bg-fill hover:text-[#2F4B4F]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <MoreVertical className="size-5" />
      </button>

      {open ? (
        <div className="absolute right-0 top-10 z-20 w-48 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
          <ActionMenuItem
            icon={<Pencil className="size-4" />}
            label="Edit discount"
            onClick={() => {
              setOpen(false);
              onEdit(discount);
            }}
          />
          <ActionMenuItem
            destructive
            icon={<Trash2 className="size-4" />}
            label="Delete"
            onClick={() => setOpen(false)}
          />
        </div>
      ) : null}
    </div>
  );
}

function ActionMenuItem({
  destructive = false,
  icon,
  label,
  onClick,
}: {
  destructive?: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-3 border-b border-border px-5 py-3 text-left transition last:border-b-0 hover:bg-fill",
        destructive ? "text-error" : "text-[#2F4B4F]",
      )}
      onClick={onClick}
      type="button"
    >
      {icon}
      {label}
    </button>
  );
}

function formatReward(discount: DiscountData) {
  if (discount.reward.type === "percentage_discount") {
    return `${discount.reward.value}% off`;
  }

  if (discount.reward.type === "fixed_amount_discount") {
    return formatCurrency(discount.reward.value);
  }

  if (discount.reward.type === "buy_x_get_y") {
    const { buyQuantity, getQuantity } = discount.reward.metadata;

    return `Buy ${buyQuantity}, get ${getQuantity}`;
  }

  if (discount.reward.type === "freebie_product") {
    return "Freebie product";
  }

  if (discount.reward.type === "cashback_credit") {
    return `${formatCurrency(discount.reward.value)} cashback`;
  }

  return formatDiscountLabel(discount.reward.type);
}

function formatCode(discount: DiscountData) {
  return discount.code ?? "No code";
}

function formatMinimum(discount: DiscountData) {
  if (!discount.rules.minimumOrderValue) return "No minimum";

  return `Min. ${formatCurrency(discount.rules.minimumOrderValue)}`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-NG", {
    currency: "NGN",
    style: "currency",
  }).format(value);
}
