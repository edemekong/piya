import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ContactData,
  DiscountData,
  GiftData,
  OfferingData,
  OrderData,
} from "../models";
import type {
  AccountSetupPayload,
  CommunicationAdminData,
  CommunicationRecipient,
  InviteMemberInput,
  TeamPayload,
  UpdateAccountSetupRequest,
  UpdateMemberInvitationRoleRequest,
  UpdateMemberRoleRequest,
} from "../types";
import { ApiServiceError } from "../services/base-api.service";
import { communicationsService } from "../services/communications.service";
import { contactsService } from "../services/contacts.service";
import { discountsService } from "../services/discounts.service";
import { giftsService } from "../services/gifts.service";
import { offeringsService } from "../services/offerings.service";
import { ordersService } from "../services/orders.service";
import { teamService } from "../services/team.service";
import { userService } from "../services/user.service";

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
    "Communication",
    "CommunicationRecipient",
    "Contact",
    "Discount",
    "Gift",
    "Offering",
    "Order",
    "Team",
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
    getCommunications: builder.query<CommunicationAdminData[], void>({
      queryFn: () => ({ data: communicationsService.getCommunications() }),
      providesTags: ["Communication"],
    }),
    getCommunicationRecipients: builder.query<CommunicationRecipient[], string>({
      queryFn: (communicationId) => ({
        data: communicationsService.getCommunicationRecipients(communicationId),
      }),
      providesTags: (_result, _error, communicationId) => [
        { id: communicationId, type: "CommunicationRecipient" },
      ],
    }),
    getContacts: builder.query<ContactData[], void>({
      queryFn: () => ({ data: contactsService.getContacts() }),
      providesTags: ["Contact"],
    }),
    getDiscounts: builder.query<DiscountData[], void>({
      queryFn: () => ({ data: discountsService.getDiscounts() }),
      providesTags: ["Discount"],
    }),
    getGifts: builder.query<GiftData[], void>({
      queryFn: () => ({ data: giftsService.getGifts() }),
      providesTags: ["Gift"],
    }),
    getOfferings: builder.query<OfferingData[], void>({
      queryFn: () => ({ data: offeringsService.getOfferings() }),
      providesTags: ["Offering"],
    }),
    getOrders: builder.query<OrderData[], void>({
      queryFn: () => ({ data: ordersService.getOrders() }),
      providesTags: ["Order"],
    }),
  }),
});

export const {
  useDeleteMemberInvitationMutation,
  useDeleteMemberMutation,
  useGetAccountSetupQuery,
  useGetCommunicationRecipientsQuery,
  useGetCommunicationsQuery,
  useGetContactsQuery,
  useGetDiscountsQuery,
  useGetGiftsQuery,
  useGetOfferingsQuery,
  useGetOrdersQuery,
  useGetTeamQuery,
  useInviteMemberMutation,
  useUpdateMemberInvitationRoleMutation,
  useUpdateMemberRoleMutation,
  useUpdateAccountSetupMutation,
} = domainApi;
