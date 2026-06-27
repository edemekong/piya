import type { BaseModel } from "./base";

export type LeadRequestType = "demo" | "remind_me";
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

export type LeadRequestDataPayload =
  | DemoLeadRequestData
  | RemindMeLeadRequestData;

type LeadRequestBaseData = BaseModel & {
  email: string;
  status: LeadRequestStatus;
};

export type LeadRequestData =
  | (LeadRequestBaseData & {
      type: "demo";
      data: DemoLeadRequestData;
    })
  | (LeadRequestBaseData & {
      type: "remind_me";
      data: RemindMeLeadRequestData;
    });
