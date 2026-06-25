import * as React from "react";
import {
  Gift,
  ListFilter,
  Package,
  Plus,
  Search,
  TicketPercent,
} from "lucide-react";
import { Button, SegmentedTabs } from "@piya/ui";
import { getDiscounts, type DiscountData } from "@/services/discounts.service";
import { getGifts, type GiftData } from "@/services/gifts.service";
import { getOfferings, type OfferingData } from "@/services/offerings.service";
import {
  DiscountEditorSheet,
  DiscountsTable,
  GiftEditorSheet,
  GiftsTable,
  OfferingEditorSheet,
  OfferingsTable,
} from "./components";

type MainTab = "offerings" | "discounts" | "gifts";
type EditorMode = "create" | "edit";

const initialOfferings = getOfferings();
const initialDiscounts = getDiscounts();
const initialGifts = getGifts();

const mainTabs = [
  {
    icon: <Package className="size-4" />,
    label: "Offerings",
    value: "offerings",
  },
  {
    icon: <TicketPercent className="size-4" />,
    label: "Discounts",
    value: "discounts",
  },
  {
    icon: <Gift className="size-4" />,
    label: "Gifts",
    value: "gifts",
  },
] satisfies { icon: React.ReactNode; label: string; value: MainTab }[];

export function OfferingPage() {
  const [activeTab, setActiveTab] = React.useState<MainTab>("offerings");
  const [offerings, setOfferings] =
    React.useState<OfferingData[]>(initialOfferings);
  const [discounts, setDiscounts] =
    React.useState<DiscountData[]>(initialDiscounts);
  const [gifts, setGifts] = React.useState<GiftData[]>(initialGifts);
  const [offeringEditorMode, setOfferingEditorMode] =
    React.useState<EditorMode>("create");
  const [discountEditorMode, setDiscountEditorMode] =
    React.useState<EditorMode>("create");
  const [giftEditorMode, setGiftEditorMode] =
    React.useState<EditorMode>("create");
  const [isOfferingEditorOpen, setIsOfferingEditorOpen] = React.useState(false);
  const [isDiscountEditorOpen, setIsDiscountEditorOpen] = React.useState(false);
  const [isGiftEditorOpen, setIsGiftEditorOpen] = React.useState(false);
  const [selectedOffering, setSelectedOffering] =
    React.useState<OfferingData | null>(null);
  const [selectedDiscount, setSelectedDiscount] =
    React.useState<DiscountData | null>(null);
  const [selectedGift, setSelectedGift] = React.useState<GiftData | null>(null);

  function openCreateSheet() {
    if (activeTab === "discounts") {
      setDiscountEditorMode("create");
      setSelectedDiscount(null);
      setIsDiscountEditorOpen(true);
      return;
    }

    if (activeTab === "gifts") {
      setGiftEditorMode("create");
      setSelectedGift(null);
      setIsGiftEditorOpen(true);
      return;
    }

    setOfferingEditorMode("create");
    setSelectedOffering(null);
    setIsOfferingEditorOpen(true);
  }

  function openEditSheet(offering: OfferingData) {
    setOfferingEditorMode("edit");
    setSelectedOffering(offering);
    setIsOfferingEditorOpen(true);
  }

  function openEditDiscountSheet(discount: DiscountData) {
    setDiscountEditorMode("edit");
    setSelectedDiscount(discount);
    setIsDiscountEditorOpen(true);
  }

  function openEditGiftSheet(gift: GiftData) {
    setGiftEditorMode("edit");
    setSelectedGift(gift);
    setIsGiftEditorOpen(true);
  }

  function handleSave(offering: OfferingData) {
    setOfferings((current) => {
      const exists = current.some((item) => item.id === offering.id);
      return exists
        ? current.map((item) => (item.id === offering.id ? offering : item))
        : [offering, ...current];
    });
  }

  function handleSaveDiscount(discount: DiscountData) {
    setDiscounts((current) => {
      const exists = current.some((item) => item.id === discount.id);
      return exists
        ? current.map((item) => (item.id === discount.id ? discount : item))
        : [discount, ...current];
    });
  }

  function handleSaveGift(gift: GiftData) {
    setGifts((current) => {
      const exists = current.some((item) => item.id === gift.id);
      return exists
        ? current.map((item) => (item.id === gift.id ? gift : item))
        : [gift, ...current];
    });
  }

  const isDiscountsTab = activeTab === "discounts";
  const isGiftsTab = activeTab === "gifts";
  const ctaLabel = isDiscountsTab
    ? "Create discount"
    : isGiftsTab
      ? "Create gift"
      : "Create offering";
  const searchPlaceholder = isDiscountsTab
    ? "Search discounts"
    : isGiftsTab
      ? "Search gifts"
      : "Search offerings";
  const filterLabel = isDiscountsTab
    ? "Filter discounts"
    : isGiftsTab
      ? "Filter gifts"
      : "Filter offerings";

  return (
    <>
      <div className="grid gap-6 bg-background">
        <header className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-title-1 font-semibold text-[#2F4B4F]">
              Offerings
            </h1>
            <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
              Create, view, and manage products and services from one catalog.
            </p>
          </div>
          <Button icon={<Plus />} onClick={openCreateSheet}>
            {ctaLabel}
          </Button>
        </header>

        <section className="rounded-md bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-lg">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/50" />
              <input
                className="h-11 w-full rounded-sm border border-border bg-fill pl-10 pr-3 text-callout text-[#2F4B4F] outline-none transition focus:border-primary focus:bg-white"
                placeholder={searchPlaceholder}
                type="search"
              />
            </div>
            <button
              aria-label={filterLabel}
              className="flex size-11 shrink-0 items-center justify-center rounded-sm border border-border bg-fill text-[#2F4B4F]/70 transition hover:bg-secondary/40 hover:text-[#2F4B4F]"
              type="button"
            >
              <ListFilter className="size-5" />
            </button>
          </div>

          <SegmentedTabs
            items={mainTabs}
            onValueChange={setActiveTab}
            value={activeTab}
          />

          <div className="mt-4 border-t border-border pt-4">
            {activeTab === "offerings" ? (
              <OfferingsTable
                offerings={offerings}
                onEdit={openEditSheet}
                onView={openEditSheet}
              />
            ) : activeTab === "discounts" ? (
              <DiscountsTable
                discounts={discounts}
                onEdit={openEditDiscountSheet}
                onView={openEditDiscountSheet}
              />
            ) : (
              <GiftsTable
                gifts={gifts}
                onEdit={openEditGiftSheet}
                onView={openEditGiftSheet}
              />
            )}
          </div>
        </section>
      </div>

      <OfferingEditorSheet
        mode={offeringEditorMode}
        offering={selectedOffering}
        onClose={() => setIsOfferingEditorOpen(false)}
        onSave={handleSave}
        open={isOfferingEditorOpen}
      />
      <DiscountEditorSheet
        discount={selectedDiscount}
        gifts={gifts}
        mode={discountEditorMode}
        onClose={() => setIsDiscountEditorOpen(false)}
        onCreateGift={handleSaveGift}
        onSave={handleSaveDiscount}
        open={isDiscountEditorOpen}
      />
      <GiftEditorSheet
        gift={selectedGift}
        mode={giftEditorMode}
        onClose={() => setIsGiftEditorOpen(false)}
        onSave={handleSaveGift}
        open={isGiftEditorOpen}
      />
    </>
  );
}
