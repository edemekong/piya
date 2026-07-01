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
  BadgeInput,
  BadgePayload,
  BadgesPayload,
  BaseAPIServiceOptions,
  BulkCreateContactResult,
  BulkCreateContactsInput,
  BulkCreateContactsPayload,
  BusinessSlugAvailabilityPayload,
  CommunicationInput,
  CommunicationPayload,
  CommunicationRecipientsPayload,
  CommunicationsPayload,
  ContactListQuery,
  ContactPayload,
  ContactTagsPayload,
  ContactsPayload,
  CreateContactInput,
  CreateUserInput,
  CreateLeadRequestInput,
  DiscountInput,
  DiscountPayload,
  DiscountsPayload,
  GiftInput,
  GiftPayload,
  GiftsPayload,
  InviteMemberInput,
  MemberInvitationPayload,
  MemberPayload,
  LocationPayload,
  LocationPredictionsPayload,
  OfferingInput,
  OfferingListQuery,
  OfferingPayload,
  OfferingsPayload,
  TeamPayload,
  TokenProvider,
  UpdateAccountSetupRequest,
  UpdateContactInput,
  UpdateMemberInvitationRoleRequest,
  UpdateMemberRoleRequest,
  UpdateTeamEntryRoleInput,
  UpdateUserInput,
  UserPayload,
} from "./api";

export type { FirebaseWebConfig, ImportMetaWithEnv } from "./config";

export type {
  AddContactMode,
  ContactOverviewTab,
  ContactViewParentTab,
  DiscountFormDraft,
  GiftDraft,
  OfferingAttributeDraft,
  OfferingFormDraft,
  OfferingOptionDraft,
  OfferingVariantDraft,
  OrderDraft,
  OverviewRange,
} from "./forms";

export type {
  AccommodationReservationStatusType,
  AccommodationUnitStatusType,
} from "./accommodation.type";

export type {
  AvailabilityIntervalType,
  AvailabilityStatusType,
} from "./availability.type";
export type {
  AvailabilityDay,
  AvailabilityPayload,
  AvailabilityScheduleDraft,
  AvailabilityTimeSlot,
} from "./availability";
export type {
  DeliveryPricingPayload,
  UpdateDeliveryPricingInput,
} from "./delivery-pricing";

export type {
  BookingParticipantRoleType,
  BookingParticipantStatusType,
  BookingParticipantType,
  BookingStatusType,
} from "./booking.type";

export type {
  BusinessCategoryTypes,
  BusinessSellingType,
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

export type { ContactBadgeType, ContactStatusType } from "./contact.type";

export type { DeliveryStatusType } from "./delivery.type";

export type { DocumentStatusType, IDType } from "./document.type";

export type {
  AccommodationOrderItem,
  AppointmentOrderItem,
  DeliveryOrderItem,
  DigitalOrderItem,
  EventOrderItem,
  OrderCheckoutIntentType,
  OrderContact,
  OrderFulfillmentDetails,
  OrderItem,
  OrderItemBase,
  OrderItemType,
  OrderPaymentMode,
  OrderPaymentStatus,
  OrderRelatedRecord,
  OrderRelatedRecordType,
  OrderSourceType,
  OrderStatus,
  PhysicalOrderItem,
} from "./order.type";

export type {
  OfferingAttributeValueType,
  OfferingCheckoutIntentType,
  OfferingFeatureType,
  OfferingStatusType,
  OfferingSubType,
  OfferingType,
} from "./offering.type";

export type { ServiceType } from "./service.type";

export type { SiteFlowPayload, UpdateSiteFlowInput } from "./site-flow";

export type { SiteSections, SiteStatusType } from "./site.type";

export type {
  BusinessDomainFamily,
  CheckoutIntentType,
  CheckoutPaymentMode,
  StorefrontConfigStatus,
  StorefrontCreateRelation,
  StorefrontCreateType,
  StorefrontNodeActionType,
  StorefrontNodeType,
  StorefrontPresetId,
  StorefrontRequirementType,
  StorefrontSetupRequirementType,
} from "./storefront.type";

export type { MiniUserData, UserGenderType, UserRoleType } from "./user.type";

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
