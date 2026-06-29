import type { AxiosInstance } from "axios";

export type ApiResponseBody<T = unknown> = {
  status: 0 | 1;
  message: string;
  code?: string;
  data?: T | null;
  details?: unknown;
};

export type TokenProvider = () => Promise<string | null> | string | null;

export type BaseAPIServiceOptions = {
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
  tokenProvider?: TokenProvider;
  axiosInstance?: AxiosInstance;
};

export type ApiRequestOptions<TBody = unknown> = {
  body?: TBody;
  headers?: Record<string, string>;
  maxRetries?: number;
  queryParameters?: Record<string, unknown>;
  withToken?: boolean;
  signal?: AbortSignal;
};

export type ApiClientOptions = {
  baseUrl: string;
  axiosInstance?: AxiosInstance;
};

export type UserPayload = {
  user: import("../models").UserData;
};

export type AccountSetupPayload = {
  business?: import("../models").BusinessData | null;
  channelSettings?: import("../models").ChannelSettingsData | null;
  user: import("../models").UserData;
};

export type BusinessSlugAvailabilityPayload = {
  available: boolean;
  slug: string;
};

export type CreateDemoLeadRequestInput = {
  type: "demo";
  data: import("../models").DemoLeadRequestData;
};

export type CreateRemindMeLeadRequestInput = {
  type: "remind_me";
  data: import("../models").RemindMeLeadRequestData;
};

export type CreateLeadRequestInput =
  | CreateDemoLeadRequestInput
  | CreateRemindMeLeadRequestInput;

export type CreateContactInput = {
  name: string;
  email?: string | null;
  phoneNumber?: string | null;
  address?: import("../models").LocationData | null;
  dob?: string | null;
  gender?: import("./user.type").UserGenderType | null;
  tags: string[];
};

export type ContactListQuery = {
  query?: string;
  status?: import("./contact.type").ContactStatusType;
  bmdFrom?: string;
  bmdTo?: string;
  tagId?: string;
  limit?: number;
  cursor?: string;
};

export type ContactsPayload = {
  contacts: import("../models").ContactData[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

export type ContactPayload = {
  contact: import("../models").ContactData;
};

export type ContactTagsPayload = {
  tags: import("../models").ContactTagData[];
};

export type LocationPredictionsPayload = {
  predictions: import("../models").LocationPrediction[];
};

export type LocationPayload = {
  location: import("../models").LocationData;
};

export type AuthTokenPayload = {
  authToken: string;
};

export type CreateUserInput = Partial<
  Omit<import("../models").UserData, "id" | "createdAt" | "updatedAt">
>;

export type UpdateUserInput = Partial<
  Pick<
    import("../models").UserData,
    "name" | "profileImageUrl" | "accountSetupCompleted" | "dob" | "gender"
  > & {
    settings: Partial<import("../models").UserSettingsData>;
  }
>;

export type AccountSetupStep =
  | "personal-info"
  | "business-profile"
  | "brand-details"
  | "integration"
  | "complete";

export type AccountSetupPersonalInfoInput = {
  name: string;
  phoneNumber: string;
  profileImage?: string;
  profileImageUrl?: string;
  dob?: string | null;
  gender?: import("./user.type").UserGenderType | null;
};

export type AccountSetupBusinessProfileInput = {
  name: string;
  category?: import("./business.type").BusinessCategoryTypes;
  description: string;
  email?: string | null;
  phoneNumber?: string | null;
  logo?: string;
};

export type AccountSetupBrandDetailsInput = {
  logo?: string | null;
  logoBase64?: string;
  favicon?: string | null;
  faviconBase64?: string;
  coverImage?: string | null;
  coverImageBase64?: string;
  primaryColor: string;
  secondaryColor?: string | null;
  accentColor?: string | null;
  socialLinks?: Record<string, string> | null;
};

export type AccountSetupEmailIntegrationInput = {
  fromEmailLocalPart: string;
  replyToEmail: string;
};

export type AccountSetupIntegrationInput = {
  slug?: string | null;
  email?: AccountSetupEmailIntegrationInput | null;
};

export type AccountSetupCompleteInput = Record<string, never>;

export type AccountSetupInputByStep = {
  "personal-info": AccountSetupPersonalInfoInput;
  "business-profile": AccountSetupBusinessProfileInput;
  "brand-details": AccountSetupBrandDetailsInput;
  integration: AccountSetupIntegrationInput;
  complete: AccountSetupCompleteInput;
};

export type AccountSetupInput<TStep extends AccountSetupStep> =
  AccountSetupInputByStep[TStep];

export type UpdateAccountSetupRequest = {
  [TStep in AccountSetupStep]: {
    step: TStep;
    input: AccountSetupInput<TStep>;
  };
}[AccountSetupStep];

export type TeamPayload = {
  currentUserRole: import("./business.type").MemberRoleType;
  invitations: import("../models").MemberInvitationData[];
  members: import("../models").MemberData[];
};

export type InviteMemberInput = {
  email: string;
  role: import("./business.type").InvitableMemberRoleType;
};

export type UpdateTeamEntryRoleInput = {
  role: import("./business.type").InvitableMemberRoleType;
};

export type MemberPayload = {
  member: import("../models").MemberData;
};

export type MemberInvitationPayload = {
  invitation: import("../models").MemberInvitationData;
};

export type UpdateMemberRoleRequest = UpdateTeamEntryRoleInput & {
  memberId: string;
};

export type UpdateMemberInvitationRoleRequest = UpdateTeamEntryRoleInput & {
  invitationId: string;
};
