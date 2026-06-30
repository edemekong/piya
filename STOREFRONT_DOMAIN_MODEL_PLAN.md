# Piya Storefront Domain Model Plan

## Purpose

Piya should let different small businesses run tailored public storefronts without building a separate app per category. A cloth seller, barber, salon, logistics company, tailor, restaurant, hotel, and consultant all need different customer journeys, but those journeys can be composed from the same domain primitives.

The core model is:

```text
business category -> storefront preset -> enabled modules -> offering types -> checkout intent -> order
```

Categories choose the starting preset. The preset creates a graph of storefront modules. Modules connect to other modules through node IDs. Checkout intents declare what they require and what they create through referenced IDs, not booleans. Every successful customer checkout creates an `OrderData`; bookings, deliveries, quote requests, and hospitality reservations attach to or are referenced by that order.

## High-Level Decision

Do not create separate persisted models for `product_business`, `appointment_business`, `logistics_business`, `custom_work_business`, and `hospitality_business`.

Use those as domain families or preset labels only. The persistent core should be:

- `BusinessData`
- `SiteData`
- `StorefrontConfigData`
- `StorefrontNodeData`
- `OfferingData`
- `OrderData`
- `BookingData`
- `DeliveryData`
- `LeadRequestData`
- future `AccommodationUnitData`
- future `AccommodationAvailabilityData`

This keeps the product flexible. A salon can sell products later. A cloth seller can add a tailoring appointment later. A logistics business can sell packaging materials later. The storefront should support combinations instead of locking a business into one hardcoded path.

## Existing Domain Primitives

The repo already has useful source-of-truth models under `server/functions/src/shared/model`:

| Existing model | Current role |
| --- | --- |
| `business.ts` | Business identity, category, selling types, contact details, branding, slug, status, and members. |
| `site.ts` | Public storefront metadata, status, and visible sections. |
| `offering.ts` | Product or service sold by the business, including price, duration, quantity, features, images, location, and metadata. |
| `order.ts` | Commercial order created from products, services, delivery, pickup, events, or consultations. |
| `booking.ts` | Scheduled service reservation connected to availability and participants. |
| `availability.ts` | Business availability schedule and available intervals. |
| `delivery.ts` | Logistics job, contacts, package details, rider assignment, and delivery status. |
| `delivery-pricing.ts` | Business delivery pricing by vehicle type. |
| `lead-request.ts` | Request/lead capture primitive that can support quotes, inquiries, or business-confirmed work. |

The plan below builds on these and adds storefront orchestration models.

## Core Concepts

### Business

`BusinessData` remains the source of truth for identity and category.

Responsibilities:

- business name, description, category, slug, status
- public contact details
- branding
- owner/team membership
- broad selling types such as products or services

`BusinessData` should not carry all storefront behavior. It should remain the business identity record.

### Site

`SiteData` remains the public site record.

Responsibilities:

- slug
- title and description
- publish status
- SEO metadata
- high-level visible sections

`SiteData` answers: "What public site is published for this business?"

It should not carry all module graph details. The module graph belongs in `StorefrontConfigData`.

### Storefront Config

`StorefrontConfigData` is the missing model that connects business category, site rendering, module flow, and checkout behavior.

It replaces the earlier `BusinessDomainProfileData` idea. We do not need a separate business profile if `BusinessData`, `SiteData`, and `StorefrontConfigData` are present:

- `BusinessData`: who the business is
- `SiteData`: the public website shell and publish state
- `StorefrontConfigData`: how the storefront behaves

## Proposed Models

### 1. Business Domain Family

This is a classification used by presets, setup guidance, and analytics. It does not need to be a separate persisted business model.

```ts
type BusinessDomainFamily =
  | "product_business"
  | "appointment_business"
  | "logistics_business"
  | "custom_work_business"
  | "hospitality_business";
```

### 2. Storefront Preset

A preset is a template for generating `StorefrontConfigData`. At first it can live as code constants. Later it can become database-configurable.

```ts
type StorefrontPresetId =
  | "product_catalog"
  | "appointment_services"
  | "logistics_delivery"
  | "custom_work"
  | "hospitality_booking";

interface StorefrontPresetData {
  id: StorefrontPresetId;
  domainFamily: BusinessDomainFamily;
  label: string;
  description: string;
  defaultSiteSections: SiteSections[];
  defaultNodes: StorefrontNodeTemplate[];
  defaultEdges: StorefrontEdgeTemplate[];
  defaultOfferingTypes: OfferingType[];
  defaultCheckoutIntents: CheckoutIntentType[];
  setupRequirements: StorefrontSetupRequirement[];
}
```

The preset is applied during onboarding or storefront creation. It creates the first module graph for the business.

### 3. Storefront Config

`StorefrontConfigData` is the saved storefront behavior configuration for a business/site.

```ts
interface StorefrontConfigData extends BaseModel {
  businessId: string;
  siteId: string;
  category: BusinessCategoryTypes;
  domainFamily: BusinessDomainFamily;
  presetId: StorefrontPresetId;
  status: "draft" | "published" | "disabled";
  nodes: StorefrontNodeData[];
  edges: StorefrontEdgeData[];
  checkoutIntents: CheckoutIntentConfig[];
  setupRequirements: StorefrontSetupRequirement[];
  settings?: StorefrontSettings | null;
}
```

`StorefrontConfigData` answers:

- what modules exist
- which modules are enabled
- how modules connect
- which customer actions are available
- what data each action requires
- what records each action creates

### 4. Storefront Node

Use `nodeId`, not `displayOrder`. A storefront should behave like a small graph because modules can connect to each other.

```ts
type StorefrontNodeType =
  | "business_profile"
  | "hero"
  | "product_catalog"
  | "product_detail"
  | "service_catalog"
  | "service_detail"
  | "availability_calendar"
  | "booking_form"
  | "cart"
  | "checkout"
  | "delivery_order_form"
  | "pickup_form"
  | "quote_request_form"
  | "room_catalog"
  | "room_detail"
  | "room_reservation_form"
  | "contact_form"
  | "location_map"
  | "reviews"
  | "loyalty";

interface StorefrontNodeData {
  nodeId: string;
  type: StorefrontNodeType;
  enabled: boolean;
  title?: string | null;
  description?: string | null;
  settings?: Record<string, string | number | boolean> | null;
}
```

Examples:

```ts
const productCatalogNode: StorefrontNodeData = {
  nodeId: "products",
  type: "product_catalog",
  enabled: true,
  title: "Shop",
};

const checkoutNode: StorefrontNodeData = {
  nodeId: "checkout",
  type: "checkout",
  enabled: true,
  title: "Checkout",
};
```

### 5. Storefront Edge

Edges connect modules. This lets the storefront know where a customer can go next.

```ts
interface StorefrontEdgeData {
  fromNodeId: string;
  toNodeId: string;
  action: StorefrontNodeActionType;
  label?: string | null;
  condition?: StorefrontEdgeCondition | null;
}

type StorefrontNodeActionType =
  | "view"
  | "select"
  | "add_to_cart"
  | "book"
  | "request_quote"
  | "create_delivery"
  | "reserve_room"
  | "contact"
  | "checkout";
```

Examples:

```ts
const productToCart: StorefrontEdgeData = {
  fromNodeId: "products",
  toNodeId: "cart",
  action: "add_to_cart",
};

const cartToCheckout: StorefrontEdgeData = {
  fromNodeId: "cart",
  toNodeId: "checkout",
  action: "checkout",
};
```

This gives us enough structure to build different storefronts without relying on one global section order.

### 6. Checkout Intent

Checkout intent is the customer's goal. It should declare dependencies and outcomes through ID arrays.

Use:

```ts
requirements: StorefrontRequirementRef[];
creates: StorefrontCreateRef[];
paymentModes: CheckoutPaymentMode[];
```

Do not use:

```ts
requiresOffering: boolean;
requiresAvailability: boolean;
createsOrder: boolean;
createsBooking: boolean;
createsDelivery: boolean;
createsLeadRequest: boolean;
paymentMode: CheckoutPaymentMode;
```

Recommended model:

```ts
type CheckoutIntentType =
  | "buy"
  | "book"
  | "request_quote"
  | "create_delivery"
  | "reserve_room"
  | "contact_business";

interface CheckoutIntentConfig {
  intentId: string;
  type: CheckoutIntentType;
  label: string;
  entryNodeId: string;
  requirements: StorefrontRequirementRef[];
  creates: StorefrontCreateRef[];
  paymentModes: CheckoutPaymentMode[];
  settings?: Record<string, string | number | boolean> | null;
}
```

Requirement references:

```ts
type StorefrontRequirementType =
  | "customer"
  | "offering"
  | "cart"
  | "availability"
  | "fulfillment"
  | "delivery_details"
  | "package_details"
  | "quote_details"
  | "room_dates"
  | "guest_details"
  | "payment";

interface StorefrontRequirementRef {
  id: string;
  type: StorefrontRequirementType;
  nodeId?: string | null;
  required: boolean;
}
```

Create references:

```ts
type StorefrontCreateType =
  | "order"
  | "booking"
  | "delivery"
  | "lead_request"
  | "payment";

interface StorefrontCreateRef {
  id: string;
  type: StorefrontCreateType;
  required: boolean;
  relation?: "primary" | "child" | "linked";
}
```

Payment modes are a list because many businesses need more than one option:

```ts
type CheckoutPaymentMode =
  | "none"
  | "pay_now"
  | "pay_later"
  | "deposit"
  | "business_confirms_first";
```

Example for a barber booking:

```ts
const barberBookingIntent: CheckoutIntentConfig = {
  intentId: "book_service",
  type: "book",
  label: "Book service",
  entryNodeId: "services",
  requirements: [
    { id: "customer", type: "customer", nodeId: "booking_form", required: true },
    { id: "service", type: "offering", nodeId: "services", required: true },
    {
      id: "time_slot",
      type: "availability",
      nodeId: "availability",
      required: true,
    },
  ],
  creates: [
    { id: "order", type: "order", required: true, relation: "primary" },
    { id: "booking", type: "booking", required: true, relation: "child" },
  ],
  paymentModes: ["pay_now", "deposit", "pay_later"],
};
```

Example for logistics delivery:

```ts
const deliveryIntent: CheckoutIntentConfig = {
  intentId: "create_delivery",
  type: "create_delivery",
  label: "Create delivery",
  entryNodeId: "delivery_order",
  requirements: [
    {
      id: "customer",
      type: "customer",
      nodeId: "delivery_order",
      required: true,
    },
    {
      id: "package",
      type: "package_details",
      nodeId: "delivery_order",
      required: true,
    },
    {
      id: "delivery",
      type: "delivery_details",
      nodeId: "delivery_order",
      required: true,
    },
  ],
  creates: [
    { id: "order", type: "order", required: true, relation: "primary" },
    { id: "delivery", type: "delivery", required: true, relation: "child" },
  ],
  paymentModes: ["pay_now", "pay_later", "business_confirms_first"],
};
```

### 7. Order As Checkout Parent

Every successful public checkout should create `OrderData`.

This means:

- product purchase creates an order
- service booking creates an order and a booking
- delivery request creates an order and a delivery
- quote request creates an order and a lead request
- hospitality reservation creates an order and a booking/reservation
- contact-only inquiry can create a lead request without order only if it is not a checkout

`OrderData` becomes the commercial parent and status timeline for customer work. It can hold payment status and general status even when payment is deferred.

Recommended order additions:

```ts
type OrderSourceType =
  | "storefront"
  | "admin"
  | "import"
  | "api";

type OrderCheckoutIntentType =
  | "buy"
  | "book"
  | "request_quote"
  | "create_delivery"
  | "reserve_room";

type OrderPaymentMode =
  | "none"
  | "pay_now"
  | "pay_later"
  | "deposit"
  | "business_confirms_first";

interface OrderRelatedRecord {
  id: string;
  type: "booking" | "delivery" | "lead_request" | "payment" | "reservation";
}
```

Potential `OrderData` additions:

```ts
interface OrderData extends BaseModel {
  shareId: string;
  businessId: string;
  source?: OrderSourceType;
  checkoutIntent?: OrderCheckoutIntentType;
  contact: OrderContact;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  paymentMode?: OrderPaymentMode | null;
  currency: string;
  subtotal: number;
  total: number;
  items: OrderItem[];
  relatedRecords?: OrderRelatedRecord[];
  notes?: string;
}
```

### 8. Booking Relationship To Order

When a service has a price, booking should always have a related order. For this new app direction, use an order for every booking created through public checkout, even if payment is not collected immediately.

Recommended additions:

```ts
interface BookingData extends BaseModel {
  businessId: string;
  orderId: string;
  availabilityId?: string | null;
  createdBy: string;
  service: MiniServiceData;
  participants: BookingParticipant[];
  status: BookingStatusType;
  when: BookingTimeData;
  metadata?: Record<string, any> | null;
}
```

This gives admin one place to track commercial status while booking keeps scheduling details.

### 9. Logistics Relationship To Order And Offering

For logistics businesses, public delivery checkout should create an `OrderData`.

Whether delivery should also be an `OfferingData` depends on what the business is selling:

- If the logistics company has fixed delivery products, such as "Bike delivery within city" or "Interstate van delivery", those can be `OfferingData`.
- If pricing is fully calculated from pickup, dropoff, vehicle, distance, and package details, the delivery flow can stand alone and create an order item at checkout.

Recommended default for the logistics preset:

- do not require an `OfferingData`
- use `DeliveryPricingData` for pricing rules
- create `DeliveryData`
- create `OrderData`
- create an order item of type `delivery`
- optionally link an offering later if the business defines fixed delivery packages

### 10. Offering Commerce Config

Keep one `OfferingData` model. Add typed commerce behavior to tell the storefront how the offering can be sold.

```ts
type OfferingCheckoutIntentType =
  | "buy"
  | "book"
  | "request_quote"
  | "reserve_room";

interface OfferingCommerceConfig {
  checkoutIntents: OfferingCheckoutIntentType[];
  paymentModes?: CheckoutPaymentMode[] | null;
  requiresBusinessConfirmation?: boolean;
  minQuantity?: number | null;
  maxQuantity?: number | null;
  depositAmount?: number | null;
  depositPercent?: number | null;
}
```

Potential `OfferingData` addition:

```ts
interface OfferingData extends BaseModel {
  businessId: string;
  name: string;
  description?: string | null;
  type: OfferingType;
  subType?: OfferingSubType | null;
  status: OfferingStatusType;
  imageUrls?: string[] | null;
  price?: number | null;
  currency?: string | null;
  quantity?: number | null;
  duration?: number | null;
  features?: OfferingFeatureType[] | null;
  commerce?: OfferingCommerceConfig | null;
  location?: LocationData | null;
  meta?: Record<string, any> | null;
  tags: string[];
}
```

## Hospitality Models

Because this is a new app build, hospitality should be included in the model design now. It does not need to share appointment availability.

Appointment availability answers: "What time slot can I book?"

Hospitality availability answers: "Which unit is available across this date range?"

Recommended models:

```ts
interface AccommodationUnitData extends BaseModel {
  businessId: string;
  offeringId?: string | null;
  name: string;
  description?: string | null;
  capacity: number;
  bedrooms?: number | null;
  bathrooms?: number | null;
  pricePerNight: number;
  currency: string;
  status: "active" | "paused" | "disabled";
  amenities: string[];
  imageUrls?: string[] | null;
  location?: LocationData | null;
}

interface AccommodationAvailabilityData extends BaseModel {
  businessId: string;
  unitId: string;
  date: string;
  availableQuantity: number;
  priceOverride?: number | null;
  blockedReason?: string | null;
}

interface AccommodationReservationData extends BaseModel {
  businessId: string;
  orderId: string;
  unitId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  metadata?: Record<string, any> | null;
}
```

Hospitality checkout creates:

- `OrderData`
- `AccommodationReservationData`
- optional `BookingData` only if we want reservations to appear in the same booking calendar as appointments

## Category To Preset Matrix

| Business category | Domain family | Storefront preset | Default nodes | Offering types | Checkout intents | Records created |
| --- | --- | --- | --- | --- | --- | --- |
| `fashion_store` | `product_business` | `product_catalog` | hero, product catalog, product detail, cart, checkout, pickup, contact | product / physical | buy | order |
| `electronics_store` | `product_business` | `product_catalog` | hero, product catalog, product detail, cart, checkout, pickup, delivery, contact | product / physical | buy | order, optional delivery |
| `supermarket` | `product_business` | `product_catalog` | hero, product catalog, cart, checkout, pickup, delivery, contact | product / physical | buy | order, optional delivery |
| `farm_produce` | `product_business` | `product_catalog` | hero, product catalog, cart, checkout, delivery, contact | product / physical | buy | order, optional delivery |
| `restaurant` | `product_business` | `product_catalog` | hero, menu/product catalog, cart, checkout, pickup, delivery, contact | product / physical | buy | order, optional delivery |
| `food_vendor` | `product_business` | `product_catalog` | hero, menu/product catalog, cart, checkout, pickup, delivery, contact | product / physical | buy | order, optional delivery |
| `barbershop` | `appointment_business` | `appointment_services` | hero, service catalog, service detail, availability, booking form, checkout, contact | service / consultation | book | order, booking |
| `salon` | `appointment_business` | `appointment_services` | hero, service catalog, service detail, availability, booking form, checkout, contact | service / consultation | book | order, booking |
| `spa` | `appointment_business` | `appointment_services` | hero, service catalog, service detail, availability, booking form, checkout, contact | service / consultation | book | order, booking |
| `beauty_studio` | `appointment_business` | `appointment_services` | hero, service catalog, service detail, availability, booking form, checkout, contact | service / consultation | book | order, booking |
| `photography` | `appointment_business` | `appointment_services` | hero, service catalog, availability, booking form, quote request, checkout, contact | service / consultation/event | book, request_quote | order, booking or lead request |
| `consulting` | `appointment_business` | `appointment_services` | hero, service catalog, availability, booking form, checkout, contact | service / consultation_online | book | order, booking |
| `logistics_delivery` | `logistics_business` | `logistics_delivery` | hero, delivery order form, pricing, checkout, tracking, contact | service / delivery optional | create_delivery | order, delivery |
| `laundry` | `custom_work_business` | `custom_work` | hero, service catalog, pickup form, delivery form, quote request, checkout, contact | service | request_quote, buy | order, lead request or delivery |
| `fashion_tailoring` | `custom_work_business` | `custom_work` | hero, service catalog, booking form, quote request, checkout, contact | service | book, request_quote | order, booking or lead request |
| `car_wash` | `appointment_business` | `appointment_services` | hero, service catalog, availability, booking form, checkout, location map, contact | service | book | order, booking |
| `real_estate_agent` | `custom_work_business` | `custom_work` | hero, service catalog, booking form, quote request, contact | service | book, contact_business | order, booking or lead request |
| `hotel_guesthouse` | `hospitality_business` | `hospitality_booking` | hero, room catalog, room detail, reservation form, checkout, location map, contact | accommodation unit | reserve_room | order, reservation |
| `shortlet_apartment` | `hospitality_business` | `hospitality_booking` | hero, room catalog, room detail, reservation form, checkout, location map, contact | accommodation unit | reserve_room | order, reservation |

## Customer Flow By Domain

### Product Businesses

Examples: cloth seller, food vendor, restaurant, supermarket, farm produce, electronics store.

Flow:

1. Customer visits public storefront by slug.
2. Storefront loads `BusinessData`, `SiteData`, and `StorefrontConfigData`.
3. Customer enters through the hero or product catalog node.
4. Customer opens product detail.
5. Customer chooses quantity and optional variants.
6. Customer adds item to cart.
7. Customer moves from cart node to checkout node.
8. Checkout validates requirements: customer, cart, fulfillment, optional payment.
9. System creates `OrderData`.
10. If delivery is selected, system creates or links delivery fulfillment.
11. Business manages the order from admin.

Records:

- `OrderData` always
- optional `DeliveryData`

### Appointment Businesses

Examples: barber, salon, spa, beauty studio, car wash, consulting, photography.

Flow:

1. Customer visits public storefront.
2. Customer selects a service from service catalog.
3. Customer chooses available date/time from availability node.
4. Customer enters participant details in booking form.
5. Customer chooses payment mode: pay now, deposit, pay later, or business confirms first.
6. System creates `OrderData`.
7. System creates `BookingData` with `orderId`.
8. Business tracks commercial state through order and schedule state through booking.

Records:

- `OrderData` always
- `BookingData` always for booking checkout

### Logistics Businesses

Example: delivery company with send/receive package flow on storefront home page.

Flow:

1. Customer visits public storefront.
2. Customer enters delivery order form directly.
3. Customer provides pickup, dropoff, package, contact, and optional item value.
4. System calculates delivery price from `DeliveryPricingData`.
5. Customer chooses payment mode.
6. System creates `OrderData` with delivery item.
7. System creates `DeliveryData` with `orderId` or related order reference.
8. Business assigns rider and tracks delivery.

Records:

- `OrderData` always
- `DeliveryData` always for delivery checkout
- `OfferingData` optional for fixed delivery packages

### Custom-Work Businesses

Examples: tailor, laundry, real estate agent, photography packages that need review.

Flow:

1. Customer visits public storefront.
2. Customer selects a service or starts custom request.
3. Customer provides measurements, package description, photos, dates, location, or budget.
4. Customer chooses request quote, book consultation, or place order.
5. System creates `OrderData`.
6. System creates `LeadRequestData`, `BookingData`, or delivery-related child record depending on the intent.
7. Business confirms price, edits order if needed, and moves the order through fulfillment.

Records:

- `OrderData` always for checkout
- `LeadRequestData` for quote/request checkout
- optional `BookingData`
- optional `DeliveryData`

### Hospitality Businesses

Examples: hotel, guesthouse, shortlet apartment.

Flow:

1. Customer visits public storefront.
2. Customer opens room/unit catalog.
3. Customer selects room/unit.
4. Customer chooses check-in, check-out, and guest count.
5. System checks `AccommodationAvailabilityData`.
6. Customer chooses payment mode.
7. System creates `OrderData`.
8. System creates `AccommodationReservationData`.
9. Business confirms reservation and manages stay.

Records:

- `OrderData` always
- `AccommodationReservationData` always for room reservation checkout

## Admin Setup Flow

1. Owner creates account.
2. Owner enters business profile.
3. Owner selects `BusinessCategoryTypes`.
4. System derives:
   - `BusinessDomainFamily`
   - `StorefrontPresetId`
   - default `sellingTypes`
   - default site sections
   - default storefront nodes
   - default storefront edges
   - default checkout intents
5. System creates `BusinessData`.
6. System creates `SiteData` in `draft` status.
7. System creates `StorefrontConfigData` from the preset.
8. Owner adds offerings, availability, delivery pricing, rooms, or request fields depending on setup requirements.
9. Owner publishes the site.

## Setup Requirements

Setup requirements should also use IDs, so they can connect to nodes and admin tasks.

```ts
type StorefrontSetupRequirementType =
  | "business_profile"
  | "branding"
  | "contact_details"
  | "offering"
  | "availability"
  | "delivery_pricing"
  | "pickup_location"
  | "quote_form"
  | "accommodation_unit"
  | "accommodation_availability"
  | "payment_settings";

interface StorefrontSetupRequirement {
  id: string;
  type: StorefrontSetupRequirementType;
  label: string;
  nodeId?: string | null;
  required: boolean;
  completed: boolean;
}
```

Examples:

| Requirement ID | Type | Connected node | Meaning |
| --- | --- | --- | --- |
| `add_products` | `offering` | `products` | Product catalog cannot publish well without products. |
| `set_availability` | `availability` | `availability` | Booking flow needs available times. |
| `set_delivery_pricing` | `delivery_pricing` | `delivery_order` | Logistics checkout needs pricing rules. |
| `add_rooms` | `accommodation_unit` | `rooms` | Hospitality catalog needs rooms/units. |

## Public Storefront Rendering Flow

1. Load business by slug.
2. Load `SiteData`.
3. Load `StorefrontConfigData`.
4. Filter enabled nodes.
5. Build navigation and CTAs from edges.
6. Load data required by enabled nodes:
   - offerings for product/service catalogs
   - availability for booking
   - delivery pricing for logistics
   - accommodation units and availability for hospitality
7. Render the storefront from nodes and edges.
8. Route customer actions to checkout intents by `entryNodeId`.
9. Resolve checkout intent into `OrderData` plus required child records.

## Checkout Resolution Flow

The final step of checkout maps intent to records:

| Checkout intent | Always creates | Also creates | Notes |
| --- | --- | --- | --- |
| `buy` | `OrderData` | optional `DeliveryData` | Product catalog checkout. |
| `book` | `OrderData` | `BookingData` | Booking has `orderId`. |
| `request_quote` | `OrderData` | `LeadRequestData` | Order can start as pending/business-confirmed. |
| `create_delivery` | `OrderData` | `DeliveryData` | Delivery can be priced dynamically without an offering. |
| `reserve_room` | `OrderData` | `AccommodationReservationData` | Uses date-range inventory. |
| `contact_business` | `LeadRequestData` | optional `OrderData` | Only creates order if treated as checkout. |

## Recommended Implementation Phases

Because this is a new app direction, design the full model now. Implementation can still be phased by vertical slice.

### Phase 1: Storefront Graph Foundation

- Add `StorefrontConfigData`.
- Add storefront node and edge types.
- Add checkout intent config with `requirements`, `creates`, and `paymentModes`.
- Add category-to-preset constants.
- Generate `SiteData` and `StorefrontConfigData` during onboarding.

### Phase 2: Product And Appointment Checkout

- Product catalog creates `OrderData`.
- Appointment booking creates `OrderData` and `BookingData`.
- Add `orderId` to `BookingData`.
- Add order source, checkout intent, payment mode, and related records.

### Phase 3: Logistics And Custom Work

- Logistics checkout creates `OrderData` and `DeliveryData`.
- Custom quote checkout creates `OrderData` and `LeadRequestData`.
- Keep fixed delivery offerings optional.

### Phase 4: Hospitality

- Add accommodation unit, availability, and reservation models.
- Hospitality checkout creates `OrderData` and `AccommodationReservationData`.
- Build room catalog and date-range availability nodes.

## Model Ownership

Server source of truth:

- `server/functions/src/shared/model/business.ts`
- `server/functions/src/shared/model/site.ts`
- `server/functions/src/shared/model/offering.ts`
- `server/functions/src/shared/model/order.ts`
- `server/functions/src/shared/model/booking.ts`
- `server/functions/src/shared/model/availability.ts`
- `server/functions/src/shared/model/delivery.ts`
- new `server/functions/src/shared/model/storefront.ts`
- new `server/functions/src/shared/model/accommodation.ts`

Web shared mirror:

- `web/packages/shared/src/models`
- `web/packages/shared/src/types`
- `web/packages/shared/src/services`
- `web/packages/shared/src/store/domain-api.ts`

Admin app owner:

- onboarding category selection
- setup checklist
- node/module toggles
- offering editor
- availability setup
- delivery pricing setup
- accommodation setup
- storefront publishing

Portal/public storefront owner:

- slug-based storefront rendering
- node-and-edge page composition
- public checkout flows

## Key Design Decisions

1. Do not create separate persisted business models per domain family.
2. Keep `BusinessData.category` as the category source.
3. Use `StorefrontConfigData` for storefront behavior instead of `BusinessDomainProfileData`.
4. Keep `SiteData` focused on the public site shell and publish state.
5. Use `nodeId` and edges instead of `displayOrder`.
6. Use `requirements: [{ id }]` and `creates: [{ id }]` instead of checkout booleans.
7. Use `paymentModes: CheckoutPaymentMode[]` instead of a single payment mode.
8. Every successful checkout creates `OrderData`.
9. Every booking checkout creates both `OrderData` and `BookingData`.
10. Logistics checkout creates an order; delivery offerings are optional, not required.
11. Hospitality is part of the new app model and gets proper date-range inventory.
12. Keep `OfferingData` shared across products, services, custom work, and optional fixed logistics packages.

## Resolved Questions

1. Public checkout should create `OrderData` directly. A separate `CheckoutSessionData` is not required as a persisted core model right now.
2. Booking checkout should always have related `OrderData`.
3. Logistics checkout should create `OrderData` and `DeliveryData`; `OfferingData` is optional for fixed delivery packages.
4. Hospitality should be designed now because this is a new app direction.
5. Module overrides belong in `StorefrontConfigData`; `BusinessData` and `SiteData` are not enough by themselves, but `BusinessDomainProfileData` is unnecessary.

