import * as React from "react";
import { CheckCircle2, Info } from "lucide-react";
import type {
  DeliveryPricingCurrency,
  DeliveryPricingData,
  DeliveryVehicleType,
  UpdateDeliveryPricingInput,
} from "@piya/shared";
import { AppCheckbox, AppSelectField, AppSheet, Button, cn } from "@piya/ui";

type DeliveryPricingVehicle = {
  baseFee: string;
  enabled: boolean;
  id: DeliveryVehicleType;
  imageUrl: string;
  name: string;
  pricePerKm: string;
};

type ConnectDeliveryPricingSheetProps = {
  initialPricing?: DeliveryPricingData | null;
  isSaving?: boolean;
  onClose: () => void;
  onSave?: (pricing: UpdateDeliveryPricingInput) => Promise<unknown> | unknown;
  open: boolean;
};

const currencyOptions = [
  { label: "Nigeria (NGN)", value: "NGN" },
  { label: "United States (USD)", value: "USD" },
  { label: "Ghana (GHS)", value: "GHS" },
  { label: "Kenya (KES)", value: "KES" },
  { label: "South Africa (ZAR)", value: "ZAR" },
] as const;

const defaultDeliveryPricingVehicles: DeliveryPricingVehicle[] = [
  {
    baseFee: "",
    enabled: false,
    id: "bicycle",
    imageUrl: "/assets/bicycle.png",
    name: "Bicycle",
    pricePerKm: "",
  },
  {
    baseFee: "",
    enabled: false,
    id: "motorcycle",
    imageUrl: "/assets/motorcycle.png",
    name: "Motorcycle",
    pricePerKm: "",
  },
  {
    baseFee: "",
    enabled: false,
    id: "car",
    imageUrl: "/assets/car.png",
    name: "Car",
    pricePerKm: "",
  },
  {
    baseFee: "",
    enabled: false,
    id: "truck",
    imageUrl: "/assets/truck.png",
    name: "Truck",
    pricePerKm: "",
  },
  {
    baseFee: "",
    enabled: false,
    id: "van",
    imageUrl: "/assets/van.png",
    name: "Van",
    pricePerKm: "",
  },
];

function createDefaultDeliveryPricingVehicles() {
  return defaultDeliveryPricingVehicles.map((vehicle) => ({ ...vehicle }));
}

function createDeliveryPricingVehicles(pricing?: DeliveryPricingData | null) {
  return createDefaultDeliveryPricingVehicles().map((vehicle) => {
    const savedVehicle = pricing?.vehicles[vehicle.id];
    if (!savedVehicle) return vehicle;

    return {
      ...vehicle,
      baseFee: String(savedVehicle.baseFee),
      enabled: savedVehicle.enabled,
      pricePerKm: String(savedVehicle.chargePerKm),
    };
  });
}

function ConnectDeliveryPricingSheet({
  initialPricing,
  isSaving = false,
  onClose,
  onSave,
  open,
}: ConnectDeliveryPricingSheetProps) {
  const [currency, setCurrency] = React.useState<DeliveryPricingCurrency>(
    initialPricing?.currency ?? "NGN"
  );
  const [vehicles, setVehicles] = React.useState<DeliveryPricingVehicle[]>(() =>
    createDeliveryPricingVehicles(initialPricing)
  );
  const [showValidation, setShowValidation] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;

    setCurrency(initialPricing?.currency ?? "NGN");
    setVehicles(createDeliveryPricingVehicles(initialPricing));
    setShowValidation(false);
  }, [initialPricing, open]);

  const hasEnabledVehicle = vehicles.some((vehicle) => vehicle.enabled);
  const hasInvalidPrice = vehicles.some(
    (vehicle) =>
      vehicle.enabled &&
      (!vehicle.baseFee ||
        !vehicle.pricePerKm ||
        Number(vehicle.pricePerKm) <= 0)
  );

  function updateVehicle(
    vehicleId: DeliveryPricingVehicle["id"],
    updates: Partial<DeliveryPricingVehicle>
  ) {
    setVehicles((current) =>
      current.map((vehicle) =>
        vehicle.id === vehicleId ? { ...vehicle, ...updates } : vehicle
      )
    );
  }

  async function saveVehicles() {
    setShowValidation(true);
    if (!hasEnabledVehicle || hasInvalidPrice) return;

    await onSave?.({
      currency,
      vehicles: {
        bicycle: getVehiclePricing(vehicles, "bicycle"),
        motorcycle: getVehiclePricing(vehicles, "motorcycle"),
        car: getVehiclePricing(vehicles, "car"),
        truck: getVehiclePricing(vehicles, "truck"),
        van: getVehiclePricing(vehicles, "van"),
      },
    });
    onClose();
  }

  return (
    <AppSheet
      ariaLabel="set delivery prices"
      description="Set the base fee and price per kilometer for each delivery vehicle."
      footer={
        <>
          <Button onClick={onClose} type="button" variant="secondary">
            Cancel
          </Button>
          <Button
            buttonState={isSaving ? "loading" : "enabled"}
            icon={<CheckCircle2 />}
            onClick={() => void saveVehicles()}
            type="button"
          >
            Save prices
          </Button>
        </>
      }
      maxWidthClassName="max-w-3xl"
      onClose={onClose}
      open={open}
      title="Set delivery prices"
    >
      <div className="grid gap-3">
        <AppSelectField
          className="max-w-xs"
          label="Currency"
          onChange={(event) =>
            setCurrency(event.target.value as DeliveryPricingCurrency)
          }
          options={currencyOptions}
          value={currency}
        />

        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full min-w-[640px] table-fixed border-collapse text-left">
            <colgroup>
              <col />
              <col className="w-24" />
              <col className="w-36" />
              <col className="w-40" />
            </colgroup>
            <thead>
              <tr className="border-b border-border bg-fill text-footnote text-[#2F4B4F]/60">
                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                  Vehicle type
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-center font-semibold">
                  Activate
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                  <PricingHeader
                    description="A fixed amount charged at the start of every delivery, before distance charges are added."
                    label="Base fee"
                    tooltipId="base-fee-tooltip"
                  />
                </th>
                <th className="whitespace-nowrap px-4 py-3 font-semibold">
                  <PricingHeader
                    align="right"
                    description="The amount added for each kilometer traveled. It is multiplied by the delivery distance."
                    label="Charge per km"
                    tooltipId="charge-per-km-tooltip"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => {
                const hasBaseFeeError =
                  showValidation && vehicle.enabled && !vehicle.baseFee;
                const hasPricePerKmError =
                  showValidation &&
                  vehicle.enabled &&
                  (!vehicle.pricePerKm || Number(vehicle.pricePerKm) <= 0);

                return (
                  <tr
                    className="border-b border-border last:border-0"
                    key={vehicle.id}
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="flex items-center gap-3 font-semibold text-[#2F4B4F]">
                        <img
                          alt=""
                          className="h-10 w-14 shrink-0 object-contain"
                          src={vehicle.imageUrl}
                        />
                        {vehicle.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <AppCheckbox
                        checked={vehicle.enabled}
                        className="mx-auto"
                        label={`${vehicle.enabled ? "Disable" : "Enable"} ${
                          vehicle.name
                        } delivery pricing`}
                        onCheckedChange={(enabled) =>
                          updateVehicle(vehicle.id, { enabled })
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <DeliveryPriceField
                        disabled={!vehicle.enabled}
                        errorMessage="Enter zero or more."
                        hasError={hasBaseFeeError}
                        label={`${vehicle.name} base fee`}
                        onChange={(baseFee) =>
                          updateVehicle(vehicle.id, { baseFee })
                        }
                        value={vehicle.baseFee}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <DeliveryPriceField
                        disabled={!vehicle.enabled}
                        errorMessage="Enter an amount above zero."
                        hasError={hasPricePerKmError}
                        label={`${vehicle.name} price per kilometer`}
                        onChange={(pricePerKm) =>
                          updateVehicle(vehicle.id, { pricePerKm })
                        }
                        value={vehicle.pricePerKm}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {showValidation && !hasEnabledVehicle ? (
          <p className="text-footnote text-error">
            Enable at least one delivery vehicle.
          </p>
        ) : null}
      </div>
    </AppSheet>
  );
}

function PricingHeader({
  align = "left",
  description,
  label,
  tooltipId,
}: {
  align?: "left" | "right";
  description: string;
  label: string;
  tooltipId: string;
}) {
  return (
    <span className="group relative inline-flex items-center gap-1.5">
      {label}
      <button
        aria-describedby={tooltipId}
        aria-label={`About ${label}`}
        className="flex size-5 items-center justify-center rounded-full text-[#2F4B4F]/50 transition hover:bg-secondary hover:text-primary focus-visible:bg-secondary focus-visible:text-primary focus-visible:outline-none"
        type="button"
      >
        <Info className="size-3.5" />
      </button>
      <span
        className={cn(
          "pointer-events-none absolute top-full z-20 mt-2 hidden w-56 rounded-md bg-[#102A2D] px-3 py-2 text-left text-footnote font-normal leading-relaxed text-white shadow-lg group-hover:block group-focus-within:block",
          align === "right" ? "right-0" : "left-0"
        )}
        id={tooltipId}
        role="tooltip"
      >
        {description}
      </span>
    </span>
  );
}

function DeliveryPriceField({
  disabled,
  errorMessage,
  hasError,
  label,
  onChange,
  value,
}: {
  disabled: boolean;
  errorMessage: string;
  hasError: boolean;
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="block w-28">
      <span className="sr-only">{label}</span>
      <input
        className={cn(
          "h-10 w-full rounded-sm border border-border bg-fill px-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white",
          hasError && "border-error focus:border-error",
          disabled && "opacity-50"
        )}
        disabled={disabled}
        inputMode="numeric"
        onChange={(event) => onChange(getDigits(event.target.value))}
        placeholder="0"
        type="text"
        value={formatDigits(value)}
      />
      {hasError ? (
        <span className="mt-1 block text-footnote text-error">
          {errorMessage}
        </span>
      ) : null}
    </label>
  );
}

function getDigits(value: string) {
  return value.replace(/\D/g, "");
}

function formatDigits(value: string) {
  return value ? new Intl.NumberFormat("en-NG").format(Number(value)) : "";
}

function getVehiclePricing(
  vehicles: DeliveryPricingVehicle[],
  vehicleType: DeliveryVehicleType
) {
  const vehicle = vehicles.find((item) => item.id === vehicleType);

  return {
    baseFee: Number(vehicle?.baseFee ?? 0),
    chargePerKm: Number(vehicle?.pricePerKm ?? 0),
    enabled: vehicle?.enabled ?? false,
  };
}

export { ConnectDeliveryPricingSheet };
export type { ConnectDeliveryPricingSheetProps };
