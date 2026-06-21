import { BaseModel } from "./base";

type ProductType = "physical" | "digital";

type ProductStatusType =
  | "draft"
  | "active"
  | "out_of_stock"
  | "disabled";

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

export { ProductData, ProductType, ProductStatusType };
