import type { BaseModel } from "./base";

type GiftStatusType = "active" | "disabled";

interface GiftData extends BaseModel {
  businessId: string;
  createdBy: string;
  name: string;
  description?: string | null;
  status: GiftStatusType;
  estimatedValue?: number | null;
  currency?: string | null;
  quantityAvailable?: number | null;
  imageUrl?: string | null;
}

export { GiftData, GiftStatusType };
