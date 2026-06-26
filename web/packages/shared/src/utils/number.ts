export function formatNumber(value: number, locale = "en") {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatMoney(
  value: number,
  options:
    | string
    | {
        currency?: string;
        locale?: string;
        maximumFractionDigits?: number;
      } = {},
) {
  const newOptions =
    typeof options === "string" ? { currency: options } : options;
  const {
    currency = "NGN",
    locale = "en-NG",
    maximumFractionDigits = 0,
  } = newOptions;

  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits,
    style: "currency",
  }).format(value);
}

export function numberOrNull(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && value.trim() !== "" ? parsed : null;
}

export function numberOrZero(value: string) {
  return numberOrNull(value) ?? 0;
}

export function formatAmountInput(value: string) {
  if (!value) return "";

  const [wholePart, decimalPart] = value.split(".");
  const formattedWhole = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return decimalPart === undefined
    ? formattedWhole
    : `${formattedWhole}.${decimalPart}`;
}

export function parseAmountInput(value: string) {
  const cleaned = value.replace(/,/g, "").replace(/[^\d.]/g, "");
  const [wholePart, ...decimalParts] = cleaned.split(".");

  if (decimalParts.length === 0) return wholePart;

  return `${wholePart}.${decimalParts.join("")}`;
}
