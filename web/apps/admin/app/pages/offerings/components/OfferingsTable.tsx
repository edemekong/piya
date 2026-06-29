import * as React from "react";
import {
  Megaphone,
  MoreVertical,
  Package,
  Pencil,
  Percent,
  Trash2,
} from "lucide-react";
import { Badge, cn } from "@piya/ui";
import type { OfferingData } from "@piya/shared/models";
import { formatOfferingLabel } from "@piya/shared/utils";

type OfferingsTableProps = {
  offerings: OfferingData[];
  onEdit: (offering: OfferingData) => void;
  onView: (offering: OfferingData) => void;
};

export function OfferingsTable({
  offerings,
  onEdit,
  onView,
}: OfferingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-caption-1 text-[#2F4B4F]/60">
            <th className="py-3 pr-4 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Type</th>
            <th className="px-4 py-3 font-semibold">Category</th>
            <th className="px-4 py-3 font-semibold">Price</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="py-3 pl-4 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {offerings.map((offering) => (
            <tr className="border-b border-border last:border-0" key={offering.id}>
              <td className="py-4 pr-4">
                <button
                  className="flex items-center gap-3 text-left"
                  onClick={() => onView(offering)}
                  type="button"
                >
                  <OfferingImage offering={offering} />
                  <span>
                    <p className="font-semibold text-[#2F4B4F]">
                      {offering.name}
                    </p>
                    <p className="mt-1 line-clamp-1 max-w-xs text-callout text-[#2F4B4F]/65">
                      {offering.description}
                    </p>
                  </span>
                </button>
              </td>
              <td className="px-4 py-4 text-callout font-semibold text-[#2F4B4F]">
                {formatOfferingLabel(offering.type)}
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                {formatOfferingLabel(offering.subType ?? "Not set")}
              </td>
              <td className="px-4 py-4 text-callout text-[#2F4B4F]/75">
                {formatPrice(offering)}
              </td>
              <td className="px-4 py-4">
                <StatusBadge status={offering.status} />
              </td>
              <td className="py-4 pl-4">
                <OfferingActions offering={offering} onEdit={onEdit} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OfferingImage({ offering }: { offering: OfferingData }) {
  const imageUrl = offering.imageUrls?.[0];

  return imageUrl ? (
    <img
      alt=""
      className="size-12 shrink-0 rounded-md object-cover"
      src={imageUrl}
    />
  ) : (
    <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-fill text-[#2F4B4F]/55">
      <Package className="size-5" />
    </span>
  );
}

function StatusBadge({ status }: { status: OfferingData["status"] }) {
  const className =
    status === "active"
      ? "border-success/20 bg-success/10 text-success"
      : status === "paused"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-border bg-fill text-[#2F4B4F]/65";

  return (
    <Badge
      className={cn(
        "h-auto rounded-full px-3 py-1.5 text-caption-1 font-semibold",
        className,
      )}
    >
      {formatOfferingLabel(status)}
    </Badge>
  );
}

function OfferingActions({
  offering,
  onEdit,
}: {
  offering: OfferingData;
  onEdit: (offering: OfferingData) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative flex justify-end">
      <button
        aria-expanded={open}
        aria-label={`Open actions for ${offering.name}`}
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
            label="Edit offering"
            onClick={() => {
              setOpen(false);
              onEdit(offering);
            }}
          />
          <ActionMenuItem
            icon={<Percent className="size-4" />}
            label="Add discount"
            onClick={() => setOpen(false)}
          />
          <ActionMenuItem
            icon={<Megaphone className="size-4" />}
            label="Send as offer"
            onClick={() => setOpen(false)}
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

function formatPrice(offering: OfferingData) {
  if (offering.price == null) return "Not set";

  return new Intl.NumberFormat("en-NG", {
    currency: offering.currency ?? "NGN",
    style: "currency",
  }).format(offering.price);
}
