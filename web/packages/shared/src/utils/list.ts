export function splitCommaList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function nullableCommaList(value: string) {
  const list = splitCommaList(value);
  return list.length > 0 ? list : null;
}

export function joinCommaList(values?: string[] | null) {
  return values?.join(", ") ?? "";
}
