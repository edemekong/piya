import type { BaseModel } from "./base";

export type LeadRequestType =
  | "demo"
  | "remind_me"
  | "quote"
  | "contact_business";
export type LeadRequestStatus = "new" | "contacted" | "closed";

export type DemoLeadRequestData = {
  fullName: string;
  workEmail: string;
  businessName: string;
  phone?: string | null;
  businessSize?: string | null;
  demoFocus: string;
  notes?: string | null;
};

export type RemindMeLeadRequestData = {
  email: string;
};

export type QuoteLeadRequestData = {
  customerName: string;
  email: string;
  phoneNumber?: string | null;
  offeringId?: string | null;
  details: string;
  budget?: number | null;
  preferredDate?: string | null;
  attachmentUrls?: string[] | null;
};

export type ContactBusinessLeadRequestData = {
  customerName: string;
  email: string;
  phoneNumber?: string | null;
  message: string;
};

export type LeadRequestDataPayload =
  | DemoLeadRequestData
  | RemindMeLeadRequestData
  | QuoteLeadRequestData
  | ContactBusinessLeadRequestData;

type LeadRequestBaseData = BaseModel & {
  email: string;
  status: LeadRequestStatus;
  businessId?: string | null;
  orderId?: string | null;
};

export type LeadRequestData =
  | (LeadRequestBaseData & {
      type: "demo";
      data: DemoLeadRequestData;
    })
  | (LeadRequestBaseData & {
      type: "remind_me";
      data: RemindMeLeadRequestData;
    })
  | (LeadRequestBaseData & {
      type: "quote";
      businessId: string;
      orderId: string;
      data: QuoteLeadRequestData;
    })
  | (LeadRequestBaseData & {
      type: "contact_business";
      businessId: string;
      data: ContactBusinessLeadRequestData;
    });
