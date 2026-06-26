import * as React from "react";
import { Gift, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@piya/ui";
import type { GiftData } from "@piya/shared/models";

type GiftsTableProps = {
  gifts: GiftData[];
  onEdit: (gift: GiftData) => void;
  onView: (gift: GiftData) => void;
};

export function GiftsTable({ gifts, onEdit, onView }: GiftsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-caption-1 uppercase text-[#2F4B4F]/60">
            <th className="py-3 pr-4 font-semibold">Gift name</th>
            <th className="px-4 py-3 font-semibold">Value</th>
            <th className="px-4 py-3 font-semibold">Quantity</th>
            <th className="px-4 py-3 font-semibold">Max/contact</th>
            <th className="py-3 pl-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {gifts.map((gift) => (
            <tr className="border-b border-border last:border-0" key={gift.id}>
              <td className="py-4 pr-4">
                <button
                  className="flex items-center gap-3 text-left"
                  onClick={() => onView(gift)}
                  type="button"
                >
                  <GiftImage gift={gift} />
                  <span>
                    <p className="font-semibold text-[#2F4B4F]">{gift.name}</p>
                    <p className="mt-1 line-clamp-1 max-w-xs text-callout text-[#2F4B4F]/65">
                      {gift.description}
                    </p>
                  </span>
                </button>
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                {formatCurrency(gift)}
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                {gift.quantityAvailable ?? "Unlimited"}
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                {gift.maxPerContact}
              </td>
              <td className="py-4 pl-4">
                <GiftActions gift={gift} onEdit={onEdit} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GiftImage({ gift }: { gift: GiftData }) {
  return gift.imageUrl ? (
    <img
      alt=""
      className="size-12 shrink-0 rounded-md object-cover"
      src={gift.imageUrl}
    />
  ) : (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-fill text-[#2F4B4F]/55">
      <Gift className="size-5" />
    </span>
  );
}

function GiftActions({
  gift,
  onEdit,
}: {
  gift: GiftData;
  onEdit: (gift: GiftData) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative flex justify-end">
      <button
        aria-expanded={open}
        aria-label={`Open actions for ${gift.name}`}
        className="flex size-9 items-center justify-center rounded-full text-[#2F4B4F]/65 transition hover:bg-fill hover:text-[#2F4B4F]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        <MoreVertical className="size-5" />
      </button>

      {open ? (
        <div className="absolute right-0 top-10 z-20 w-44 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
          <ActionMenuItem
            icon={<Pencil className="size-4" />}
            label="Edit gift"
            onClick={() => {
              setOpen(false);
              onEdit(gift);
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

function formatCurrency(gift: GiftData) {
  if (gift.estimatedValue == null) return "Not set";

  return new Intl.NumberFormat("en-NG", {
    currency: gift.currency ?? "NGN",
    style: "currency",
  }).format(gift.estimatedValue);
}
