import type { BaseModel } from "./base";

type LeadRequestType = "demo" | "remind_me";
type LeadRequestStatus = "new" | "contacted" | "closed";

type DemoLeadRequestData = {
  fullName: string;
  workEmail: string;
  businessName: string;
  phone?: string | null;
  businessSize?: string | null;
  demoFocus: string;
  notes?: string | null;
};

type RemindMeLeadRequestData = {
  email: string;
};

type LeadRequestDataPayload = DemoLeadRequestData | RemindMeLeadRequestData;

type LeadRequestBaseData = BaseModel & {
  email: string;
  status: LeadRequestStatus;
};

type LeadRequestData =
  | (LeadRequestBaseData & {
      type: "demo";
      data: DemoLeadRequestData;
    })
  | (LeadRequestBaseData & {
      type: "remind_me";
      data: RemindMeLeadRequestData;
    });

export {
  LeadRequestData,
  LeadRequestDataPayload,
  LeadRequestStatus,
  LeadRequestType,
  DemoLeadRequestData,
  RemindMeLeadRequestData,
};
