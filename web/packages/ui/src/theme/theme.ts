import { appColors } from "./colors";
import { appSpacing } from "./spacing";
import { appFonts, appTextTheme } from "./typography";

export const appTheme = {
  colors: appColors,
  fonts: appFonts,
  spacing: appSpacing,
  text: appTextTheme,
} as const;

export type AppTheme = typeof appTheme;
