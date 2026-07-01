import type { SiteFlowData, SiteFlowModuleData } from "../models";

type SiteFlowPayload = {
  flow: SiteFlowData | null;
};

type UpdateSiteFlowInput = {
  modules: SiteFlowModuleData[];
};

export type { SiteFlowPayload, UpdateSiteFlowInput };
