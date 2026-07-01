export const businessModules = [
  "contacts",
  "orders",
  "logistics",
  "storefront",
  "team",
] as const;

export type BusinessModule = (typeof businessModules)[number];

export * from "./accommodation";
export * from "./availability";
export * from "./badge";
export * from "./base";
export * from "./booking";
export * from "./business";
export * from "./campaign";
export * from "./channel-settings";
export * from "./chat";
export * from "./communication";
export * from "./contact";
export * from "./contact-tag";
export * from "./delivery";
export * from "./delivery-pricing";
export * from "./discount";
export * from "./document";
export * from "./gift";
export * from "./lead-request";
export * from "./location";
export * from "./offering";
export * from "./order";
export * from "./service-location";
export * from "./site";
export * from "./site-flow";
export * from "./storefront";
export * from "./user";
