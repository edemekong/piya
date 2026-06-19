export type BusinessType = "storefront" | "logistics" | "services";

export type Business = {
  id: string;
  name: string;
  type: BusinessType;
};

export type Contact = {
  id: string;
  businessId: string;
  name: string;
  phone?: string;
  email?: string;
};
