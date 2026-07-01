import type { LucideIcon } from "lucide-react";
import type {
  BusinessCategoryTypes,
  SiteFlowModuleData,
  SiteModuleId as SharedSiteModuleId,
} from "@piya/shared";

export type SiteModuleGroupId =
  | "start"
  | "browse"
  | "customer-action"
  | "finish";

export type SiteBusinessFamily =
  | "all"
  | "commerce"
  | "appointment"
  | "delivery"
  | "custom-work"
  | "hospitality";

export type SiteModuleId = SharedSiteModuleId;

export type SiteModuleDefinition = {
  appliesTo: SiteBusinessFamily[];
  description: string;
  groupId: SiteModuleGroupId;
  icon: LucideIcon;
  id: SiteModuleId;
  modelLabels: string[];
  title: string;
};

export type SiteModuleDisplay = {
  description: string;
  title: string;
};

export type SiteFlowModule = SiteFlowModuleData;

export type SiteModuleGroup = {
  id: SiteModuleGroupId;
  title: string;
};

export type SiteCategory = BusinessCategoryTypes | null | undefined;
