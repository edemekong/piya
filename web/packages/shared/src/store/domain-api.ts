import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BadgeData,
  ContactData,
  ContactTagData,
  DiscountData,
  GiftData,
  LocationData,
  LocationPrediction,
  OfferingData,
  OrderData,
  UserData,
} from "../models";
import type {
  AccountSetupPayload,
  AvailabilityPayload,
  AvailabilityScheduleDraft,
  BadgeInput,
  BadgesPayload,
  BulkCreateContactsInput,
  BulkCreateContactsPayload,
  BusinessSlugAvailabilityPayload,
  CommunicationAdminData,
  CommunicationRecipient,
  CompleteWhatsAppConnectionInput,
  ContactListQuery,
  ContactsPayload,
  CreateContactInput,
  CreateLeadRequestInput,
  DeliveryPricingPayload,
  DiscountInput,
  GiftInput,
  InviteMemberInput,
  OfferingInput,
  OfferingListQuery,
  OfferingsPayload,
  SendWhatsAppMessageInput,
  SendWhatsAppMessagePayload,
  TeamPayload,
  UpdateContactInput,
  UpdateDeliveryPricingInput,
  UpdateAccountSetupRequest,
  UpdateMemberInvitationRoleRequest,
  UpdateMemberRoleRequest,
  UpdateUserInput,
  WhatsAppConnectionPayload,
} from "../types";
import { ApiServiceError } from "../services/base-api.service";
import { availabilityService } from "../services/availability.service";
import { badgesService } from "../services/badges.service";
import { deliveryPricingService } from "../services/delivery-pricing.service";
import { businessService } from "../services/business.service";
import { communicationsService } from "../services/communications.service";
import { contactsService } from "../services/contacts.service";
import { discountsService } from "../services/discounts.service";
import { giftsService } from "../services/gifts.service";
import { leadRequestService } from "../services/lead-request.service";
import { locationsService } from "../services/locations.service";
import { offeringsService } from "../services/offerings.service";
import { ordersService } from "../services/orders.service";
import { teamService } from "../services/team.service";
import { userService } from "../services/user.service";
import { whatsappService } from "../services/whatsapp.service";

type DomainApiError = {
  message: string;
  code?: string;
  statusCode?: number;
};

function getDomainApiError(error: unknown): DomainApiError {
  if (error instanceof ApiServiceError) {
    return {
      message: error.message,
      ...(error.code ? { code: error.code } : {}),
      ...(error.statusCode ? { statusCode: error.statusCode } : {}),
    };
  }

  return {
    message: error instanceof Error ? error.message : "Request failed",
  };
}

export const domainApi = createApi({
  baseQuery: fakeBaseQuery<DomainApiError>(),
  reducerPath: "domainApi",
  tagTypes: [
    "AccountSetup",
    "Availability",
    "Badge",
    "DeliveryPricing",
    "Communication",
    "CommunicationRecipient",
    "Contact",
    "ContactTag",
    "Discount",
    "Gift",
    "Offering",
    "Order",
    "Team",
    "WhatsAppConnection",
  ],
  endpoints: (builder) => ({
    getAccountSetup: builder.query<AccountSetupPayload, void>({
      queryFn: async () => {
        try {
          return { data: await userService.getAccountSetup() };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["AccountSetup"],
    }),
    updateAccountSetup: builder.mutation<
      AccountSetupPayload,
      UpdateAccountSetupRequest
    >({
      queryFn: async ({ input, step }) => {
        try {
          return {
            data: await userService.updateAccountSetupStep(step, input),
          };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["AccountSetup"],
    }),
    updateCurrentUser: builder.mutation<UserData, UpdateUserInput>({
      queryFn: async (input) => {
        try {
          return { data: await userService.updateUser(input) };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["AccountSetup"],
    }),
    getPrimaryAvailability: builder.query<AvailabilityPayload, void>({
      queryFn: async () => {
        try {
          return { data: await availabilityService.getPrimaryAvailability() };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["Availability"],
    }),
    updatePrimaryAvailability: builder.mutation<
      AvailabilityPayload,
      AvailabilityScheduleDraft
    >({
      queryFn: async (input) => {
        try {
          return {
            data: await availabilityService.updatePrimaryAvailability(input),
          };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["AccountSetup", "Availability"],
    }),
    getPrimaryDeliveryPricing: builder.query<DeliveryPricingPayload, void>({
      queryFn: async () => {
        try {
          return {
            data: await deliveryPricingService.getPrimaryDeliveryPricing(),
          };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["DeliveryPricing"],
    }),
    updatePrimaryDeliveryPricing: builder.mutation<
      DeliveryPricingPayload,
      UpdateDeliveryPricingInput
    >({
      queryFn: async (input) => {
        try {
          return {
            data: await deliveryPricingService.updatePrimaryDeliveryPricing(
              input
            ),
          };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["AccountSetup", "DeliveryPricing"],
    }),
    checkBusinessSlugAvailability: builder.query<
      BusinessSlugAvailabilityPayload,
      string
    >({
      queryFn: async (slug, api) => {
        try {
          return {
            data: await businessService.checkSlugAvailability(slug, api.signal),
          };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
    }),
    createLeadRequest: builder.mutation<void, CreateLeadRequestInput>({
      queryFn: async (input, api) => {
        try {
          await leadRequestService.createLeadRequest(input, api.signal);
          return { data: undefined };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
    }),
    getTeam: builder.query<TeamPayload, void>({
      queryFn: async () => {
        try {
          return { data: await teamService.getTeam() };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["Team"],
    }),
    inviteMember: builder.mutation<void, InviteMemberInput>({
      queryFn: async (input) => {
        try {
          await teamService.inviteMember(input);
          return { data: undefined };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Team"],
    }),
    updateMemberRole: builder.mutation<void, UpdateMemberRoleRequest>({
      queryFn: async ({ memberId, role }) => {
        try {
          await teamService.updateMemberRole(memberId, { role });
          return { data: undefined };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Team"],
    }),
    updateMemberInvitationRole: builder.mutation<
      void,
      UpdateMemberInvitationRoleRequest
    >({
      queryFn: async ({ invitationId, role }) => {
        try {
          await teamService.updateInvitationRole(invitationId, { role });
          return { data: undefined };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Team"],
    }),
    deleteMember: builder.mutation<void, string>({
      queryFn: async (memberId) => {
        try {
          await teamService.deleteMember(memberId);
          return { data: undefined };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Team"],
    }),
    deleteMemberInvitation: builder.mutation<void, string>({
      queryFn: async (invitationId) => {
        try {
          await teamService.deleteInvitation(invitationId);
          return { data: undefined };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Team"],
    }),
    getWhatsAppConnection: builder.query<WhatsAppConnectionPayload, void>({
      queryFn: async () => {
        try {
          return { data: await whatsappService.getConnection() };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["WhatsAppConnection"],
    }),
    completeWhatsAppConnection: builder.mutation<
      WhatsAppConnectionPayload,
      CompleteWhatsAppConnectionInput
    >({
      queryFn: async (input) => {
        try {
          return { data: await whatsappService.completeConnection(input) };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["AccountSetup", "WhatsAppConnection"],
    }),
    disconnectWhatsAppConnection: builder.mutation<
      WhatsAppConnectionPayload,
      void
    >({
      queryFn: async () => {
        try {
          return { data: await whatsappService.disconnectConnection() };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["AccountSetup", "WhatsAppConnection"],
    }),
    sendWhatsAppMessage: builder.mutation<
      SendWhatsAppMessagePayload,
      SendWhatsAppMessageInput
    >({
      queryFn: async (input) => {
        try {
          return { data: await whatsappService.sendMessage(input) };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["WhatsAppConnection"],
    }),
    getCommunications: builder.query<CommunicationAdminData[], void>({
      queryFn: () => ({ data: communicationsService.getCommunications() }),
      providesTags: ["Communication"],
    }),
    getCommunicationRecipients: builder.query<CommunicationRecipient[], string>(
      {
        queryFn: (communicationId) => ({
          data: communicationsService.getCommunicationRecipients(
            communicationId
          ),
        }),
        providesTags: (_result, _error, communicationId) => [
          { id: communicationId, type: "CommunicationRecipient" },
        ],
      }
    ),
    getContacts: builder.query<ContactsPayload, ContactListQuery>({
      queryFn: async (input) => {
        try {
          return { data: await contactsService.getContacts(input) };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["Contact"],
    }),
    getContactTags: builder.query<ContactTagData[], void>({
      queryFn: async () => {
        try {
          return { data: await contactsService.getContactTags() };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["ContactTag"],
    }),
    getBadges: builder.query<BadgesPayload, void>({
      queryFn: async () => {
        try {
          return { data: await badgesService.getBadges() };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["Badge"],
    }),
    createBadge: builder.mutation<BadgeData, BadgeInput>({
      queryFn: async (input) => {
        try {
          const payload = await badgesService.createBadge(input);
          return { data: payload.badge };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Badge"],
    }),
    updateBadge: builder.mutation<
      BadgeData,
      { badgeId: string; input: BadgeInput }
    >({
      queryFn: async ({ badgeId, input }) => {
        try {
          const payload = await badgesService.updateBadge(badgeId, input);
          return { data: payload.badge };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Badge"],
    }),
    deleteBadge: builder.mutation<void, string>({
      queryFn: async (badgeId) => {
        try {
          await badgesService.deleteBadge(badgeId);
          return { data: undefined };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Badge"],
    }),
    createContact: builder.mutation<ContactData, CreateContactInput>({
      queryFn: async (input) => {
        try {
          return { data: await contactsService.createContact(input) };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Contact", "ContactTag"],
    }),
    updateContact: builder.mutation<
      ContactData,
      { contactId: string; input: UpdateContactInput }
    >({
      queryFn: async ({ contactId, input }) => {
        try {
          return { data: await contactsService.updateContact(contactId, input) };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Contact", "ContactTag"],
    }),
    bulkCreateContacts: builder.mutation<
      BulkCreateContactsPayload,
      BulkCreateContactsInput
    >({
      queryFn: async (input) => {
        try {
          return { data: await contactsService.bulkCreateContacts(input) };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Contact", "ContactTag"],
    }),
    searchLocations: builder.query<LocationPrediction[], string>({
      queryFn: async (input, api) => {
        try {
          return {
            data: await locationsService.searchLocations({ input }, api.signal),
          };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
    }),
    getLocationDetails: builder.query<LocationData, string>({
      queryFn: async (placeId, api) => {
        try {
          return {
            data: await locationsService.getLocationDetails(
              { placeId },
              api.signal
            ),
          };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
    }),
    getDiscounts: builder.query<DiscountData[], void>({
      queryFn: async () => {
        try {
          const payload = await discountsService.getDiscounts();
          return { data: payload.discounts };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["Discount"],
    }),
    createDiscount: builder.mutation<DiscountData, DiscountInput>({
      queryFn: async (input) => {
        try {
          const payload = await discountsService.createDiscount(input);
          return { data: payload.discount };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Discount"],
    }),
    updateDiscount: builder.mutation<
      DiscountData,
      { discountId: string; input: DiscountInput }
    >({
      queryFn: async ({ discountId, input }) => {
        try {
          const payload = await discountsService.updateDiscount(
            discountId,
            input,
          );
          return { data: payload.discount };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Discount"],
    }),
    getGifts: builder.query<GiftData[], void>({
      queryFn: async () => {
        try {
          const payload = await giftsService.getGifts();
          return { data: payload.gifts };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["Gift"],
    }),
    createGift: builder.mutation<GiftData, GiftInput>({
      queryFn: async (input) => {
        try {
          const payload = await giftsService.createGift(input);
          return { data: payload.gift };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Gift"],
    }),
    updateGift: builder.mutation<
      GiftData,
      { giftId: string; input: GiftInput }
    >({
      queryFn: async ({ giftId, input }) => {
        try {
          const payload = await giftsService.updateGift(giftId, input);
          return { data: payload.gift };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Gift"],
    }),
    getOfferings: builder.query<OfferingData[], void>({
      queryFn: async () => {
        try {
          const payload = await offeringsService.getOfferings();
          return { data: payload.offerings };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["Offering"],
    }),
    getOfferingsPage: builder.query<OfferingsPayload, OfferingListQuery>({
      queryFn: async (input) => {
        try {
          return { data: await offeringsService.getOfferings(input) };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      providesTags: ["Offering"],
    }),
    createOffering: builder.mutation<OfferingData, OfferingInput>({
      queryFn: async (input) => {
        try {
          const payload = await offeringsService.createOffering(input);
          return { data: payload.offering };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Offering"],
    }),
    updateOffering: builder.mutation<
      OfferingData,
      { input: OfferingInput; offeringId: string }
    >({
      queryFn: async ({ input, offeringId }) => {
        try {
          const payload = await offeringsService.updateOffering(
            offeringId,
            input,
          );
          return { data: payload.offering };
        } catch (error) {
          return { error: getDomainApiError(error) };
        }
      },
      invalidatesTags: ["Offering"],
    }),
    getOrders: builder.query<OrderData[], void>({
      queryFn: () => ({ data: ordersService.getOrders() }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useLazyCheckBusinessSlugAvailabilityQuery,
  useLazyGetLocationDetailsQuery,
  useLazySearchLocationsQuery,
  useBulkCreateContactsMutation,
  useCreateContactMutation,
  useCreateBadgeMutation,
  useCreateDiscountMutation,
  useCreateGiftMutation,
  useCreateLeadRequestMutation,
  useCreateOfferingMutation,
  useCompleteWhatsAppConnectionMutation,
  useDeleteMemberInvitationMutation,
  useDeleteMemberMutation,
  useDeleteBadgeMutation,
  useDisconnectWhatsAppConnectionMutation,
  useGetAccountSetupQuery,
  useGetPrimaryAvailabilityQuery,
  useGetPrimaryDeliveryPricingQuery,
  useGetCommunicationRecipientsQuery,
  useGetCommunicationsQuery,
  useGetContactTagsQuery,
  useGetContactsQuery,
  useGetBadgesQuery,
  useGetDiscountsQuery,
  useGetGiftsQuery,
  useGetOfferingsPageQuery,
  useGetOfferingsQuery,
  useGetOrdersQuery,
  useGetTeamQuery,
  useGetWhatsAppConnectionQuery,
  useInviteMemberMutation,
  useSendWhatsAppMessageMutation,
  useUpdatePrimaryAvailabilityMutation,
  useUpdatePrimaryDeliveryPricingMutation,
  useUpdateMemberInvitationRoleMutation,
  useUpdateMemberRoleMutation,
  useUpdateDiscountMutation,
  useUpdateGiftMutation,
  useUpdateOfferingMutation,
  useUpdateAccountSetupMutation,
  useUpdateContactMutation,
  useUpdateCurrentUserMutation,
  useUpdateBadgeMutation,
} = domainApi;
