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

export function getAuthPathWithReturnTo(
  returnTo: string,
  invitationTo?: string | null,
) {
  const safeReturnTo = getSafeReturnTo(returnTo, "");
  const params = new URLSearchParams();

  if (safeReturnTo) params.set("returnTo", safeReturnTo);
  if (invitationTo) params.set("invitationTo", invitationTo);

  const query = params.toString();
  return query ? `${AUTH_PATH}?${query}` : AUTH_PATH;
}

export function getAccountSetupPathWithReturnTo(
  returnTo: string,
  invitationTo?: string | null,
) {
  const safeReturnTo = getSafeReturnTo(returnTo, "");
  const params = new URLSearchParams();

  if (safeReturnTo) params.set("returnTo", safeReturnTo);
  if (invitationTo) params.set("invitationTo", invitationTo);

  const query = params.toString();
  return query ? `${ACCOUNT_SETUP_PATH}?${query}` : ACCOUNT_SETUP_PATH;
}

export function getReturnToFromSearch(search: string) {
  return new URLSearchParams(search).get("returnTo");
}

export function getInvitationToFromSearch(search: string) {
  return new URLSearchParams(search).get("invitationTo");
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
