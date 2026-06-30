import * as React from "react";
import {
  Megaphone,
  Loader2,
  MoreVertical,
  Package,
  Pencil,
  Trash2,
} from "lucide-react";
import { AppPopup, Badge, EmptyState, cn } from "@piya/ui";
import type {
  OfferingDisplayConfig,
  OfferingTableColumn,
} from "@/utils/offering-display";
import type { OfferingData } from "@piya/shared/models";
import { formatOfferingLabel } from "@piya/shared/utils";

type OfferingsTableProps = {
  display: OfferingDisplayConfig;
  isLoading: boolean;
  offerings: OfferingData[];
  onDelete: (offering: OfferingData) => void;
  onEdit: (offering: OfferingData) => void;
  onView: (offering: OfferingData) => void;
};

export function OfferingsTable({
  display,
  isLoading,
  offerings,
  onDelete,
  onEdit,
  onView,
}: OfferingsTableProps) {
  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2
          aria-label={`Loading ${display.plural.toLowerCase()}`}
          className="size-6 animate-spin text-primary"
        />
      </div>
    );
  }

  if (offerings.length === 0) {
    return (
      <EmptyState
        className="flex h-[200px] flex-col items-center justify-center border-0 bg-transparent p-0 text-center"
        icon={<Package className="size-5" />}
        title={
          <span className="font-normal text-[#2F4B4F]/55">
            {display.plural} you add will appear here.
          </span>
        }
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-left">
        <thead>
          <tr className="border-b border-border text-caption-1 text-[#2F4B4F]/60">
            <th className="py-3 pr-4 font-semibold">{display.singular}</th>
            {display.tableColumns.map((column) => (
              <th className="px-4 py-3 font-semibold" key={column}>
                {getColumnLabel(column, display)}
              </th>
            ))}
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
              {display.tableColumns.map((column) => (
                <td
                  className="px-4 py-4 text-callout text-[#2F4B4F]/75"
                  key={column}
                >
                  <OfferingTableValue column={column} offering={offering} />
                </td>
              ))}
              <td className="py-4 pl-4">
                <OfferingActions
                  editLabel={display.editActionLabel}
                  offering={offering}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OfferingTableValue({
  column,
  offering,
}: {
  column: OfferingTableColumn;
  offering: OfferingData;
}) {
  if (column === "category") {
    return (
      <>
        {formatOfferingLabel(
          offering.category?.name ?? offering.subType ?? "Not set",
        )}
      </>
    );
  }

  if (column === "duration") {
    return <>{offering.duration ? `${offering.duration} minutes` : "Not set"}</>;
  }

  if (column === "price") {
    return <>{formatPrice(offering)}</>;
  }

  if (column === "stock") {
    return <>{formatStock(offering)}</>;
  }

  return <StatusBadge status={offering.status} />;
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
  editLabel,
  offering,
  onDelete,
  onEdit,
}: {
  editLabel: string;
  offering: OfferingData;
  onDelete: (offering: OfferingData) => void;
  onEdit: (offering: OfferingData) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [anchorElement, setAnchorElement] =
    React.useState<HTMLButtonElement | null>(null);

  return (
    <div className="relative flex justify-end">
      <button
        aria-expanded={open}
        aria-label={`Open actions for ${offering.name}`}
        className="flex size-9 items-center justify-center rounded-full text-[#2F4B4F]/65 transition hover:bg-fill hover:text-[#2F4B4F]"
        onClick={(event) => {
          setAnchorElement(event.currentTarget);
          setOpen((current) => !current);
        }}
        type="button"
      >
        <MoreVertical className="size-5" />
      </button>

      <AppPopup
        anchorElement={anchorElement}
        className="w-48 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg"
        onClose={() => setOpen(false)}
        open={open}
        placement="bottom-end"
      >
          <ActionMenuItem
            icon={<Pencil className="size-4" />}
            label={editLabel}
            onClick={() => {
              setOpen(false);
              onEdit(offering);
            }}
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
            onClick={() => {
              setOpen(false);
              onDelete(offering);
            }}
          />
      </AppPopup>
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

function formatStock(offering: OfferingData) {
  if (offering.inventory?.trackQuantity) {
    return offering.inventory.quantity?.toString() ?? "Not set";
  }

  return offering.inventory?.sku ?? "Not set";
}

function getColumnLabel(
  column: OfferingTableColumn,
  display: OfferingDisplayConfig,
) {
  if (column === "category") return display.categoryColumnLabel;
  if (column === "duration") return "Duration";
  if (column === "price") return "Price";
  if (column === "stock") return "Stock";
  return "Status";
}
