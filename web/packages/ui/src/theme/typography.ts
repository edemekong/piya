export const appFonts = {
  figtree: "Figtree",
  fallback:
    "Figtree, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif",
} as const;

export const appTextTheme = {
  largeTitle: {
    fontSize: "34px",
    lineHeight: "1.21",
    fontWeight: 400,
    letterSpacing: "0",
  },
  title1: {
    fontSize: "28px",
    lineHeight: "1.21",
    fontWeight: 600,
    letterSpacing: "0",
  },
  title2: {
    fontSize: "22px",
    lineHeight: "1.27",
    fontWeight: 400,
    letterSpacing: "0",
  },
  title3: {
    fontSize: "20px",
    lineHeight: "1.25",
    fontWeight: 400,
    letterSpacing: "0",
  },
  headline: {
    fontSize: "17px",
    lineHeight: "1.29",
    fontWeight: 600,
    letterSpacing: "0",
  },
  body: {
    fontSize: "17px",
    lineHeight: "1.29",
    fontWeight: 400,
    letterSpacing: "0",
  },
  callout: {
    fontSize: "16px",
    lineHeight: "1.31",
    fontWeight: 400,
    letterSpacing: "0",
  },
  subheadline: {
    fontSize: "15px",
    lineHeight: "1.33",
    fontWeight: 400,
    letterSpacing: "0",
  },
  footnote: {
    fontSize: "13px",
    lineHeight: "1.38",
    fontWeight: 400,
    letterSpacing: "0",
  },
  caption1: {
    fontSize: "12px",
    lineHeight: "1.33",
    fontWeight: 400,
    letterSpacing: "0",
  },
  caption2: {
    fontSize: "11px",
    lineHeight: "1.18",
    fontWeight: 400,
    letterSpacing: "0",
  },
  micro: {
    fontSize: "11px",
    lineHeight: "1.18",
    fontWeight: 600,
    letterSpacing: "0",
  },
} as const;

export type AppTextVariant = keyof typeof appTextTheme;
