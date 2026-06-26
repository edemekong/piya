import * as React from "react";

export type ThemeScriptProps = {
  storageKey?: string;
};

export function ThemeScript({ storageKey = "piya.theme" }: ThemeScriptProps) {
  const script = `
(function () {
  try {
    var mode = window.localStorage.getItem(${JSON.stringify(storageKey)}) || "system";
    var systemDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var newMode = mode === "dark" || (mode === "system" && systemDark) ? "dark" : "light";
    document.documentElement.dataset.theme = newMode;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
