const RESERVED_BUSINESS_SLUGS = new Set([
  "admin",
  "api",
  "assets",
  "auth",
  "cdn",
  "dashboard",
  "mail",
  "piya",
  "reply",
  "status",
  "support",
  "www",
]);

function getBusinessSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 55)
    .replace(/-+$/g, "");
}

function getBusinessSlugFromHostname(
  hostname: string,
  appDomain?: string | null,
) {
  const normalizedHostname = hostname
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  const normalizedAppDomain = appDomain?.trim().toLowerCase();

  if (!normalizedAppDomain) return null;

  const suffix = `.${normalizedAppDomain}`;
  if (!normalizedHostname.endsWith(suffix)) return null;

  const slug = normalizedHostname.slice(0, -suffix.length);
  if (!slug || slug.includes(".") || isReservedBusinessSlug(slug)) {
    return null;
  }

  return slug;
}

function isReservedBusinessSlug(slug: string) {
  return RESERVED_BUSINESS_SLUGS.has(slug);
}

export {
  getBusinessSlug,
  getBusinessSlugFromHostname,
  isReservedBusinessSlug,
};
