import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "rgb(var(--color-border) / <alpha-value>)",
        "border-opaque": "rgb(var(--color-border-opaque) / <alpha-value>)",
        divider: "rgb(var(--color-divider) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        "background-elevated":
          "rgb(var(--color-background-elevated) / <alpha-value>)",
        muted: "rgb(var(--color-surface-secondary) / <alpha-value>)",
        "muted-foreground":
          "rgb(var(--color-text-secondary) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-secondary":
          "rgb(var(--color-surface-secondary) / <alpha-value>)",
        "surface-tertiary":
          "rgb(var(--color-surface-tertiary) / <alpha-value>)",
        foreground: "rgb(var(--color-foreground) / <alpha-value>)",
        "text-body": "rgb(var(--color-text-body) / <alpha-value>)",
        "text-secondary":
          "rgb(var(--color-text-secondary) / <alpha-value>)",
        "text-tertiary": "rgb(var(--color-text-tertiary) / <alpha-value>)",
        "text-quaternary":
          "rgb(var(--color-text-quaternary) / <alpha-value>)",
        fill: "rgb(var(--color-fill) / <alpha-value>)",
        unselected: "rgb(var(--color-unselected) / <alpha-value>)",
        "fill-secondary": "rgb(var(--color-fill-secondary) / <alpha-value>)",
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-light": "rgb(var(--color-primary-light) / <alpha-value>)",
        "primary-lighter":
          "rgb(var(--color-primary-lighter) / <alpha-value>)",
        "primary-dark": "rgb(var(--color-primary-dark) / <alpha-value>)",
        "primary-foreground":
          "rgb(var(--color-primary-foreground) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        "secondary-light":
          "rgb(var(--color-secondary-light) / <alpha-value>)",
        "secondary-lighter":
          "rgb(var(--color-secondary-lighter) / <alpha-value>)",
        "secondary-dark": "rgb(var(--color-secondary-dark) / <alpha-value>)",
        "secondary-foreground":
          "rgb(var(--color-secondary-foreground) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        info: "rgb(var(--color-info) / <alpha-value>)",
      },
      borderRadius: {
        sm: "var(--app-radius-text-field)",
        md: "var(--app-radius-default)",
        lg: "var(--app-radius-large)",
        full: "var(--app-radius-pill)",
      },
      fontFamily: {
        sans: ["var(--font-app)"],
      },
      maxWidth: {
        web: "var(--app-web-width)",
      },
      spacing: {
        screen: "var(--app-screen-padding)",
        card: "var(--app-card-padding)",
        element: "var(--app-element-spacing)",
        "element-sm": "var(--app-element-spacing-small)",
      },
      fontSize: {
        "large-title": ["34px", { lineHeight: "1.21", letterSpacing: "0" }],
        "title-1": ["28px", { lineHeight: "1.21", letterSpacing: "0" }],
        "title-2": ["22px", { lineHeight: "1.27", letterSpacing: "0" }],
        "title-3": ["20px", { lineHeight: "1.25", letterSpacing: "0" }],
        headline: ["17px", { lineHeight: "1.29", letterSpacing: "0" }],
        body: ["17px", { lineHeight: "1.29", letterSpacing: "0" }],
        callout: ["16px", { lineHeight: "1.31", letterSpacing: "0" }],
        subheadline: ["15px", { lineHeight: "1.33", letterSpacing: "0" }],
        footnote: ["13px", { lineHeight: "1.38", letterSpacing: "0" }],
        "caption-1": ["12px", { lineHeight: "1.33", letterSpacing: "0" }],
        "caption-2": ["11px", { lineHeight: "1.18", letterSpacing: "0" }],
        micro: ["11px", { lineHeight: "1.18", letterSpacing: "0" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
