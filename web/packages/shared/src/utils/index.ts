export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

export function formatInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function formatMoney(
  value: number,
  options: {
    currency?: string;
    locale?: string;
    maximumFractionDigits?: number;
  } = {},
) {
  const {
    currency = "NGN",
    locale = "en-NG",
    maximumFractionDigits = 0,
  } = options;

  return new Intl.NumberFormat(locale, {
    currency,
    maximumFractionDigits,
    style: "currency",
  }).format(value);
}
