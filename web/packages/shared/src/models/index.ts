export const businessModules = [
  "contacts",
  "orders",
  "logistics",
  "storefront",
  "team",
] as const;

export type BusinessModule = (typeof businessModules)[number];

export * from "./base";
export * from "./order";
