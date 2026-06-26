import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  ContactData,
  DiscountData,
  GiftData,
  OfferingData,
  OrderData,
} from "../models";
import type { CommunicationAdminData, CommunicationRecipient } from "../types";
import { communicationsService } from "../services/communications.service";
import { contactsService } from "../services/contacts.service";
import { discountsService } from "../services/discounts.service";
import { giftsService } from "../services/gifts.service";
import { offeringsService } from "../services/offerings.service";
import { ordersService } from "../services/orders.service";

export const domainApi = createApi({
  baseQuery: fakeBaseQuery(),
  reducerPath: "domainApi",
  tagTypes: [
    "Communication",
    "CommunicationRecipient",
    "Contact",
    "Discount",
    "Gift",
    "Offering",
    "Order",
  ],
  endpoints: (builder) => ({
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
  useGetCommunicationRecipientsQuery,
  useGetCommunicationsQuery,
  useGetContactsQuery,
  useGetDiscountsQuery,
  useGetGiftsQuery,
  useGetOfferingsQuery,
  useGetOrdersQuery,
} = domainApi;
