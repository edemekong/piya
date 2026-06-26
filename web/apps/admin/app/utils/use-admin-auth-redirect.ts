import * as React from "react";
import { useLocation, useNavigate } from "@remix-run/react";
import { authService, userService } from "@piya/shared";
import {
  DEFAULT_AUTHENTICATED_PATH,
  getAccountSetupPathWithReturnTo,
  getAuthPathWithReturnTo,
  getCurrentRoutePath,
  getReturnToFromSearch,
  getSafeReturnTo,
} from "./auth-routing";

type AuthRedirectMode = "guest" | "require-auth" | "account-setup";
type AuthRedirectStatus = "checking" | "ready" | "redirecting";

export function useAdminAuthRedirect(mode: AuthRedirectMode) {
  const location = useLocation();
  const navigate = useNavigate();
  const locationRef = React.useRef(location);
  const [status, setStatus] = React.useState<AuthRedirectStatus>("checking");

  React.useEffect(() => {
    locationRef.current = location;
  }, [location]);

  React.useEffect(() => {
    let isActive = true;
    setStatus("checking");

    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (!isActive) return;

      const currentLocation = locationRef.current;
      const returnTo = getReturnToFromSearch(currentLocation.search);
      const currentRoutePath = getCurrentRoutePath(currentLocation);

      if (!firebaseUser) {
        if (mode === "require-auth") {
          setStatus("redirecting");
          navigate(getAuthPathWithReturnTo(currentRoutePath), {
            replace: true,
          });
          return;
        }

        if (mode === "account-setup") {
          setStatus("redirecting");
          navigate(getAuthPathWithReturnTo(returnTo ?? ""), {
            replace: true,
          });
          return;
        }

        setStatus("ready");
        return;
      }

      const currentUser = await userService.getCurrentUser(firebaseUser.uid);
      if (!isActive) return;

      const accountSetupCompleted = currentUser?.accountSetupCompleted === true;

      if (mode === "guest") {
        setStatus("redirecting");
        navigate(
          accountSetupCompleted
            ? getSafeReturnTo(returnTo)
            : getAccountSetupPathWithReturnTo(returnTo ?? ""),
          { replace: true },
        );
        return;
      }

      if (!accountSetupCompleted && mode === "require-auth") {
        setStatus("redirecting");
        navigate(getAccountSetupPathWithReturnTo(currentRoutePath), {
          replace: true,
        });
        return;
      }

      if (accountSetupCompleted && mode === "account-setup") {
        setStatus("redirecting");
        navigate(getSafeReturnTo(returnTo, DEFAULT_AUTHENTICATED_PATH), {
          replace: true,
        });
        return;
      }

      if (!currentUser && mode === "account-setup") {
        await userService.createUser({});
        if (!isActive) return;
      }

      setStatus("ready");
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [mode, navigate]);

  return status;
}
