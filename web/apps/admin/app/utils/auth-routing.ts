export const AUTH_PATH = "/auth";
export const ACCOUNT_SETUP_PATH = "/auth/account-setup";
export const DEFAULT_AUTHENTICATED_PATH = "/overview";

const authRoutePrefixes = [AUTH_PATH, ACCOUNT_SETUP_PATH];

export function getCurrentRoutePath(location: {
  pathname: string;
  search: string;
}) {
  return `${location.pathname}${location.search}`;
}

export function getAuthPathWithReturnTo(returnTo: string) {
  const safeReturnTo = getSafeReturnTo(returnTo, "");

  if (!safeReturnTo) {
    return AUTH_PATH;
  }

  return `${AUTH_PATH}?returnTo=${encodeURIComponent(safeReturnTo)}`;
}

export function getAccountSetupPathWithReturnTo(returnTo: string) {
  const safeReturnTo = getSafeReturnTo(returnTo, "");

  if (!safeReturnTo) {
    return ACCOUNT_SETUP_PATH;
  }

  return `${ACCOUNT_SETUP_PATH}?returnTo=${encodeURIComponent(safeReturnTo)}`;
}

export function getReturnToFromSearch(search: string) {
  return new URLSearchParams(search).get("returnTo");
}

export function getSafeReturnTo(
  returnTo: string | null | undefined,
  fallback = DEFAULT_AUTHENTICATED_PATH,
) {
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("//")) {
    return fallback;
  }

  const pathname = returnTo.split(/[?#]/, 1)[0] || "/";

  if (authRoutePrefixes.some((prefix) => pathname === prefix)) {
    return fallback;
  }

  return returnTo;
}
