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

export {
  BusinessBrand,
  UpsertBusinessProfileResult,
  UpdateBusinessIntegrationsResult,
};
