import type {
  BusinessDomainFamily,
  CheckoutIntentType,
  CheckoutPaymentMode,
  StorefrontConfigStatus,
  StorefrontCreateRelation,
  StorefrontCreateType,
  StorefrontNodeActionType,
  StorefrontNodeType,
  StorefrontPresetId,
  StorefrontRequirementType,
  StorefrontSetupRequirementType,
} from "../types/storefront.type";
import type { BusinessCategoryTypes } from "../types/business.type";
import type { OfferingType } from "../types/offering.type";
import type { SiteSections } from "../types/site.type";
import type { BaseModel } from "./base";

interface StorefrontPresetData {
  id: StorefrontPresetId;
  domainFamily: BusinessDomainFamily;
  label: string;
  description: string;
  defaultSiteSections: SiteSections[];
  defaultNodes: StorefrontNodeData[];
  defaultEdges: StorefrontEdgeData[];
  defaultOfferingTypes: OfferingType[];
  defaultCheckoutIntents: CheckoutIntentType[];
  setupRequirements: StorefrontSetupRequirement[];
}

interface StorefrontConfigData extends BaseModel {
  businessId: string;
  siteId: string;
  category: BusinessCategoryTypes;
  domainFamily: BusinessDomainFamily;
  presetId: StorefrontPresetId;
  status: StorefrontConfigStatus;
  nodes: StorefrontNodeData[];
  edges: StorefrontEdgeData[];
  checkoutIntents: CheckoutIntentConfig[];
  setupRequirements: StorefrontSetupRequirement[];
  settings?: StorefrontSettings | null;
}

interface StorefrontNodeData {
  nodeId: string;
  type: StorefrontNodeType;
  enabled: boolean;
  title?: string | null;
  description?: string | null;
  settings?: Record<string, string | number | boolean> | null;
}

interface StorefrontEdgeData {
  fromNodeId: string;
  toNodeId: string;
  action: StorefrontNodeActionType;
  label?: string | null;
  condition?: StorefrontEdgeCondition | null;
}

interface StorefrontEdgeCondition {
  requirementId?: string | null;
  settingKey?: string | null;
  equals?: string | number | boolean | null;
}

interface CheckoutIntentConfig {
  intentId: string;
  type: CheckoutIntentType;
  label: string;
  entryNodeId: string;
  requirements: StorefrontRequirementRef[];
  creates: StorefrontCreateRef[];
  paymentModes: CheckoutPaymentMode[];
  settings?: Record<string, string | number | boolean> | null;
}

interface StorefrontRequirementRef {
  id: string;
  type: StorefrontRequirementType;
  nodeId?: string | null;
  required: boolean;
}

interface StorefrontCreateRef {
  id: string;
  type: StorefrontCreateType;
  required: boolean;
  relation?: StorefrontCreateRelation;
}

interface StorefrontSetupRequirement {
  id: string;
  type: StorefrontSetupRequirementType;
  label: string;
  nodeId?: string | null;
  required: boolean;
  completed: boolean;
}

interface StorefrontSettings {
  defaultCurrency?: string | null;
  allowGuestCheckout?: boolean;
  requireBusinessConfirmation?: boolean;
}

export {
  CheckoutIntentConfig,
  StorefrontConfigData,
  StorefrontCreateRef,
  StorefrontEdgeCondition,
  StorefrontEdgeData,
  StorefrontNodeData,
  StorefrontPresetData,
  StorefrontRequirementRef,
  StorefrontSettings,
  StorefrontSetupRequirement,
};
