import {
  makeAppStore,
  removeToast,
  setThemeMode,
  type AppDispatch,
  type AppStore,
  type RootState,
  type ThemeMode,
} from "@piya/shared";
import { ToastViewport } from "@piya/ui";
import * as React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";

const themeStorageKey = "piya.theme";

function getAppliedTheme(mode: ThemeMode): "light" | "dark" {
  if (mode === "dark" || mode === "light") {
    return mode;
  }

  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function ThemeSync() {
  const dispatch = useDispatch<AppDispatch>();
  const mode = useSelector((state: RootState) => state.theme.mode);

  React.useEffect(() => {
    const storedMode = window.localStorage.getItem(themeStorageKey);

    if (
      storedMode === "light" ||
      storedMode === "dark" ||
      storedMode === "system"
    ) {
      dispatch(setThemeMode(storedMode));
    }
  }, [dispatch]);

  React.useEffect(() => {
    const appliedTheme = getAppliedTheme(mode);

    document.documentElement.dataset.theme = appliedTheme;
    window.localStorage.setItem(themeStorageKey, mode);
  }, [mode]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange() {
      if (mode === "system") {
        document.documentElement.dataset.theme = getAppliedTheme(mode);
      }
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  return null;
}

function ToastSync() {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(
    (state: RootState) => state.toast.notifications,
  );

  const handleDismiss = React.useCallback(
    (id: string) => {
      dispatch(removeToast(id));
    },
    [dispatch],
  );

  return (
    <ToastViewport
      notifications={notifications}
      onDismiss={handleDismiss}
    />
  );
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = React.useRef<AppStore | null>(null);

  if (storeRef.current === null) {
    storeRef.current = makeAppStore();
  }

  return (
    <Provider store={storeRef.current}>
      <ThemeSync />
      {children}
      <ToastSync />
    </Provider>
  );
}
