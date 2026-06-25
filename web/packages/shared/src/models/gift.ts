export type GiftStatusType = "draft" | "active" | "disabled";

export type GiftData = {
  id: string;
  businessId: string;
  createdAt: number;
  updatedAt: number;
  name: string;
  description?: string | null;
  status: GiftStatusType;
  estimatedValue?: number | null;
  currency?: string | null;
  quantityAvailable?: number | null;
  maxPerContact: number;
  imageUrl?: string | null;
  tags: string[];
};

export type GiftDraft = {
  currency: string;
  description: string;
  estimatedValue: string;
  imageUrl: string;
  maxPerContact: string;
  name: string;
  quantityAvailable: string;
  status: GiftStatusType;
  tags: string;
};
