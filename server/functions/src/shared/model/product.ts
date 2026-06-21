import type { ProductStatusType, ProductType } from "../types/product.type";
import type { BaseModel } from "./base";

interface ProductData extends BaseModel {
  businessId: string;
  name: string;
  description?: string | null;
  type: ProductType;
  status: ProductStatusType;
  imageUrls: string[];
  price: number;
  currency: string;
  quantity?: number | null;
  tags: string[];
}

export { ProductData };
