import type { BusinessData } from "../model/business";
import type { ChannelSettingsData } from "../model/channel-settings";
import type { UserData } from "../model/user";

type BusinessBrand = {
  businessId: string;
};

type UpsertBusinessProfileResult = {
  business: BusinessData;
  user: UserData;
};

type UpdateBusinessIntegrationsResult = {
  business: BusinessData;
  channelSettings: ChannelSettingsData | null;
};

type UpdateBusinessIntegrationsOutcome =
  | {
      status: "updated";
      data: UpdateBusinessIntegrationsResult;
    }
  | {
      status:
        | "business-not-found"
        | "domain-not-configured"
        | "email-domain-mismatch"
        | "slug-unavailable";
    };

export {
  BusinessBrand,
  UpsertBusinessProfileResult,
  UpdateBusinessIntegrationsOutcome,
  UpdateBusinessIntegrationsResult,
};
