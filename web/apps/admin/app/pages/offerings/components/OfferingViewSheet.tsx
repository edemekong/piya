import { AppSheet, Badge } from "@piya/ui";
import type { OfferingData } from "@piya/shared/services";
import { formatOfferingLabel } from "./offeringForm";

type OfferingViewSheetProps = {
  offering: OfferingData | null;
  onClose: () => void;
  open: boolean;
};

export function OfferingViewSheet({
  offering,
  onClose,
  open,
}: OfferingViewSheetProps) {
  if (!offering) return null;

  const category = offering.subType ?? "Not set";

  return (
    <AppSheet
      ariaLabel="view offering sheet"
      description={offering.description ?? "No description added."}
      maxWidthClassName="max-w-2xl"
      onClose={onClose}
      open={open}
      title={offering.name}
    >
      <div className="grid gap-5">
        <section className="rounded-md border border-border bg-white p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge>{formatOfferingLabel(offering.type)}</Badge>
            <Badge>{formatOfferingLabel(offering.status)}</Badge>
            <Badge>{formatOfferingLabel(category)}</Badge>
          </div>
        </section>

        <section className="grid gap-4 rounded-md border border-border bg-white p-4 sm:grid-cols-2">
          <Detail label="Price" value={formatPrice(offering)} />
          <Detail label="Currency" value={offering.currency ?? "Not set"} />
          {offering.type === "product" ? (
            <>
              <Detail
                label="Sub type"
                value={formatOfferingLabel(offering.subType ?? "Not set")}
              />
              <Detail
                label="Quantity"
                value={offering.quantity?.toString() ?? "Not set"}
              />
              <Detail
                label="Image URLs"
                value={offering.imageUrls?.join(", ") || "Not set"}
              />
            </>
          ) : (
            <>
              <Detail
                label="Sub type"
                value={formatOfferingLabel(offering.subType ?? "Not set")}
              />
              <Detail
                label="Duration"
                value={
                  offering.duration ? `${offering.duration} minutes` : "Not set"
                }
              />
              <Detail
                label="Features"
                value={
                  offering.features?.map(formatOfferingLabel).join(", ") ||
                  "Not set"
                }
              />
              <Detail label="Image URL" value={offering.imageUrl ?? "Not set"} />
            </>
          )}
          <Detail label="Tags" value={offering.tags.join(", ") || "Not set"} />
        </section>

        {offering.type === "service" && offering.location ? (
          <section className="grid gap-4 rounded-md border border-border bg-white p-4 sm:grid-cols-2">
            <Detail label="Address" value={offering.location.address} />
            <Detail label="City" value={offering.location.city} />
            <Detail label="State" value={offering.location.state} />
            <Detail label="Country" value={offering.location.country} />
            <Detail
              label="Postal code"
              value={offering.location.postalCode ?? "Not set"}
            />
          </section>
        ) : null}
      </div>
    </AppSheet>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-caption-1 uppercase text-[#2F4B4F]/55">{label}</p>
      <p className="mt-1 break-words text-callout font-semibold text-[#2F4B4F]">
        {value}
      </p>
    </div>
  );
}

function formatPrice(offering: OfferingData) {
  if (offering.price == null) return "Not set";

  return new Intl.NumberFormat("en-NG", {
    currency: offering.currency ?? "NGN",
    style: "currency",
  }).format(offering.price);
}
