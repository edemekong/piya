import type { OfferingType } from "./offering.type";

type ServiceType = Extract<OfferingType, "service">;

export type { ServiceType };
