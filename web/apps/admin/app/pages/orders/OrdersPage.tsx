import * as React from "react";
import { ListFilter, Plus, Search } from "lucide-react";
import { Button } from "@piya/ui";
import {
  useGetContactsQuery,
  useGetOfferingsQuery,
  useGetOrdersQuery,
} from "@piya/shared";
import type { ContactData } from "@piya/shared/models";
import type { OfferingData, OrderData } from "@piya/shared/models";
import {
  ContactViewSheet,
  type ContactViewParentTab,
} from "@/pages/contacts/components/ContactViewSheet";
import { OfferingViewSheet } from "@/pages/offerings/components";
import {
  OrderEditorSheet,
  OrdersStats,
  OrdersTable,
  OrderViewSheet,
} from "./components";
import { getOrderFulfillment } from "@piya/shared/utils";

export function OrdersPage() {
  const { data: contactsPage } = useGetContactsQuery({ limit: 50 });
  const queriedContacts = contactsPage?.contacts ?? [];
  const { data: queriedOfferings = [] } = useGetOfferingsQuery();
  const { data: queriedOrders = [] } = useGetOrdersQuery();
  const [orders, setOrders] = React.useState<OrderData[]>([]);
  const [isCreateSheetOpen, setIsCreateSheetOpen] = React.useState(false);
  const [selectedOrder, setSelectedOrder] = React.useState<OrderData | null>(
    null
  );
  const [selectedContact, setSelectedContact] =
    React.useState<ContactData | null>(null);
  const [selectedOffering, setSelectedOffering] =
    React.useState<OfferingData | null>(null);
  const [contactSheetTab, setContactSheetTab] =
    React.useState<ContactViewParentTab>("overview");

  React.useEffect(() => {
    setOrders(queriedOrders);
  }, [queriedOrders]);

  function handleCreateOrder(order: OrderData) {
    setOrders((current) => [order, ...current]);
  }

  function openContactSheet(
    order: OrderData,
    initialTab: ContactViewParentTab = "overview"
  ) {
    const existingContact = queriedContacts.find(
      (contact) => contact.id === order.contact.id
    );
    setContactSheetTab(initialTab);
    setSelectedContact(existingContact ?? createContactFromOrder(order));
  }

  function handleItemSelect(offeringId?: string) {
    const offering = queriedOfferings.find((item) => item.id === offeringId);
    if (offering) setSelectedOffering(offering);
  }

  return (
    <>
      <div className="grid gap-6 bg-background">
        <header className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-title-1 font-semibold text-[#2F4B4F]">
              Orders
            </h1>
            <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
              View, create, and track customer orders across offerings.
            </p>
          </div>
          <Button icon={<Plus />} onClick={() => setIsCreateSheetOpen(true)}>
            Create order
          </Button>
        </header>

        <OrdersStats orders={orders} />

        <section className="rounded-md bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
              <input
                className="h-11 w-full rounded-sm border border-border bg-fill pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary focus:bg-white"
                placeholder="Search orders"
                type="search"
              />
            </div>
            <button
              aria-label="Filter orders"
              className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-border bg-fill text-[#2F4B4F]/70 transition hover:bg-secondary/40 hover:text-[#2F4B4F]"
              type="button"
            >
              <ListFilter className="size-5" />
            </button>
          </div>

          <OrdersTable
            orders={orders}
            onContactSelect={openContactSheet}
            onItemSelect={(item) => handleItemSelect(item.offeringId)}
            onSendMessage={(order) => openContactSheet(order, "conversations")}
            onView={setSelectedOrder}
          />
        </section>
      </div>

      <OrderEditorSheet
        onClose={() => setIsCreateSheetOpen(false)}
        onSave={handleCreateOrder}
        open={isCreateSheetOpen}
      />
      <OrderViewSheet
        onClose={() => setSelectedOrder(null)}
        open={Boolean(selectedOrder)}
        order={selectedOrder}
      />
      <ContactViewSheet
        contact={selectedContact}
        initialTab={contactSheetTab}
        notes={[]}
        onClose={() => setSelectedContact(null)}
        onCreateNote={() => undefined}
        onUpdateNote={() => undefined}
        open={Boolean(selectedContact)}
      />
      <OfferingViewSheet
        offering={selectedOffering}
        onClose={() => setSelectedOffering(null)}
        open={Boolean(selectedOffering)}
      />
    </>
  );
}

function createContactFromOrder(order: OrderData): ContactData {
  const now = Date.now();
  const fulfillment = getOrderFulfillment(order);

  return {
    id: order.contact.id,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    userId: order.contact.id,
    code: order.contact.id.toUpperCase(),
    createdBy: "admin_001",
    businessId: order.businessId,
    name: order.contact.name,
    profileImageUrl: null,
    email: order.contact.email ?? "Not provided",
    phoneNumber: order.contact.phoneNumber ?? "Not provided",
    countryCode: fulfillment?.country === "Ghana" ? "GH" : "NG",
    address: fulfillment
      ? {
          address: fulfillment.address,
          city: fulfillment.city,
          state: fulfillment.state,
          country: fulfillment.country,
        }
      : null,
    badge: {
      badgeId: "new",
      points: 0,
      updatedAt: now,
    },
    dob: null,
    bmd: null,
    preference: {
      unsubscribedEmailTypes: [],
      smsEnabled: Boolean(order.contact.phoneNumber),
      emailEnabled: Boolean(order.contact.email),
      whatsappEnabled: false,
    },
    status: "lead",
    lastInteractionAt: order.updatedAt,
    anniversary: null,
    tags: ["order contact"],
    counts: {
      lifetimeValue: order.total,
      totalOrders: 1,
      messagesSentCount: 0,
      messagesRepliedCount: 0,
    },
    metadata: null,
  };
}
