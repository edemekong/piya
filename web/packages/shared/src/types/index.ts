export type BusinessType = "storefront" | "logistics" | "services";

export type Business = {
  id: string;
  name: string;
  type: BusinessType;
};

export type {
  AccountSetupBrandDetailsInput,
  AccountSetupBusinessProfileInput,
  AccountSetupCompleteInput,
  AccountSetupEmailIntegrationInput,
  AccountSetupInput,
  AccountSetupInputByStep,
  AccountSetupIntegrationInput,
  AccountSetupPayload,
  AccountSetupPersonalInfoInput,
  AccountSetupStep,
  ApiClientOptions,
  ApiRequestOptions,
  ApiResponseBody,
  AuthTokenPayload,
  BaseAPIServiceOptions,
  BusinessSlugAvailabilityPayload,
  CreateUserInput,
  CreateLeadRequestInput,
  InviteMemberInput,
  MemberInvitationPayload,
  MemberPayload,
  TeamPayload,
  TokenProvider,
  UpdateAccountSetupRequest,
  UpdateMemberInvitationRoleRequest,
  UpdateMemberRoleRequest,
  UpdateTeamEntryRoleInput,
  UpdateUserInput,
  UserPayload,
} from "./api";

export type {
  FirebaseWebConfig,
  ImportMetaWithEnv,
} from "./config";

export type {
  AddContactMode,
  ContactOverviewTab,
  ContactViewParentTab,
  DiscountFormDraft,
  GiftDraft,
  OfferingFormDraft,
  OrderDraft,
  OverviewRange,
} from "./forms";

export type {
  AvailabilityIntervalType,
  AvailabilityStatusType,
} from "./availability.type";

export type {
  BookingParticipantRoleType,
  BookingParticipantStatusType,
  BookingParticipantType,
  BookingStatusType,
} from "./booking.type";

export type {
  BusinessCategoryTypes,
  BusinessStatusType,
  InvitableMemberRoleType,
  MemberInvitationStatusType,
  MemberPermissionType,
  MemberRoleType,
} from "./business.type";

export type {
  CampaignStatusType,
  CampaignType,
  RewardType,
} from "./campaign.type";

export type {
  ChannelProviderType,
  ChannelProviderStatusType,
  SMSRegistrationStatusType,
  SMSSenderType,
} from "./channel-settings.type";

export type {
  ChatChannelType,
  ChatProfileRoleType,
  MessageDeliveryStatusType,
  MessageDirectionType,
} from "./chat.type";

export type {
  CommunicationAdminData,
  CommunicationAdminStats,
  CommunicationAdminStep,
  CommunicationChannel,
  CommunicationEditorMode,
  CommunicationRecipient,
  CommunicationStatus,
} from "./communication";

export type {
  CommunicationEventType,
  CommunicationFrequency,
} from "./communication.type";

export type {
  ContactBadgeType,
  ContactStatusType,
} from "./contact.type";

export type {
  DeliveryStatusType,
} from "./delivery.type";

export type {
  DocumentStatusType,
  IDType,
} from "./document.type";

export type {
  OfferingFeatureType,
  OfferingStatusType,
  OfferingSubType,
  OfferingType,
} from "./offering.type";

export type {
  ServiceType,
} from "./service.type";

export type {
  SiteSections,
  SiteStatusType,
} from "./site.type";

export type {
  MiniUserData,
  UserGenderType,
  UserRoleType,
} from "./user.type";

export type {
  DecodedBase64File,
  ImageContentType,
  UploadFileOptions,
} from "./storage";

export type {
  OTPDeliveryChannel,
  OTPRequestType,
  RequestOTPBody,
  RequestEmailOTPParams,
  RequestOTPResult,
  RequestPhoneOTPParams,
  SendSMSParams,
  SendSMSResponse,
  VerifyAuthOTPParams,
  VerifyAuthOTPReason,
  VerifyAuthOTPResult,
} from "./auth";

export type {
  CompleteWhatsAppConnectionInput,
  SendWhatsAppMessageInput,
  SendWhatsAppMessagePayload,
  WhatsAppConnectionPayload,
  WhatsAppWebhookEventPayload,
} from "./whatsapp.type";
