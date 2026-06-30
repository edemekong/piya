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
import { getOfferingDisplayConfig } from "@/utils/offering-display";
import {
  useGetAccountSetupQuery,
  useGetDiscountsQuery,
  useGetGiftsQuery,
  useGetOfferingsQuery,
  useCreateOfferingMutation,
  useUpdateOfferingMutation,
  useCreateDiscountMutation,
  useCreateGiftMutation,
  useDeleteDiscountMutation,
  useDeleteGiftMutation,
  useDeleteOfferingMutation,
  useUpdateDiscountMutation,
  useUpdateGiftMutation,
  showToast,
  type AppDispatch,
} from "@piya/shared";
import type { DiscountData, GiftData, OfferingData } from "@piya/shared/models";
import type { DiscountInput, GiftInput } from "@piya/shared/types";
import { useDispatch } from "react-redux";
import {
  CatalogDeleteDialog,
  DiscountEditorSheet,
  DiscountsTable,
  GiftEditorSheet,
  GiftsTable,
  OfferingEditorSheet,
  OfferingsTable,
} from "./components";

type MainTab = "offerings" | "discounts" | "gifts";
type EditorMode = "create" | "edit";
type CatalogDeleteTarget =
  | { item: OfferingData; type: "offering" }
  | { item: DiscountData; type: "discount" }
  | { item: GiftData; type: "gift" };

export function OfferingPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: accountSetup } = useGetAccountSetupQuery();
  const offeringDisplay = getOfferingDisplayConfig(
    accountSetup?.business?.category ?? null,
  );
  const mainTabs = [
    {
      icon: <Package className="size-4" />,
      label: offeringDisplay.plural,
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
  const { data: queriedDiscounts = [], isLoading: isLoadingDiscounts } =
    useGetDiscountsQuery();
  const { data: queriedGifts = [], isLoading: isLoadingGifts } =
    useGetGiftsQuery();
  const { data: offerings = [], isLoading: isLoadingOfferings } =
    useGetOfferingsQuery();
  const [createOffering, { isLoading: isCreatingOffering }] =
    useCreateOfferingMutation();
  const [updateOffering, { isLoading: isUpdatingOffering }] =
    useUpdateOfferingMutation();
  const [createDiscount, { isLoading: isCreatingDiscount }] =
    useCreateDiscountMutation();
  const [updateDiscount, { isLoading: isUpdatingDiscount }] =
    useUpdateDiscountMutation();
  const [createGift, { isLoading: isCreatingGift }] =
    useCreateGiftMutation();
  const [updateGift, { isLoading: isUpdatingGift }] =
    useUpdateGiftMutation();
  const [deleteOffering, { isLoading: isDeletingOffering }] =
    useDeleteOfferingMutation();
  const [deleteDiscount, { isLoading: isDeletingDiscount }] =
    useDeleteDiscountMutation();
  const [deleteGift, { isLoading: isDeletingGift }] =
    useDeleteGiftMutation();
  const [activeTab, setActiveTab] = React.useState<MainTab>("offerings");
  const [discounts, setDiscounts] =
    React.useState<DiscountData[]>([]);
  const [gifts, setGifts] = React.useState<GiftData[]>([]);
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
  const [deleteTarget, setDeleteTarget] =
    React.useState<CatalogDeleteTarget | null>(null);

  React.useEffect(() => {
    setDiscounts(queriedDiscounts);
  }, [queriedDiscounts]);

  React.useEffect(() => {
    setGifts(queriedGifts);
  }, [queriedGifts]);

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

  async function handleSave(offering: OfferingData) {
    const isEditing = offeringEditorMode === "edit" && selectedOffering;
    const itemName = offeringDisplay.singular;

    try {
      if (isEditing) {
        await updateOffering({
          input: offering,
          offeringId: selectedOffering.id,
        }).unwrap();
      } else {
        await createOffering(offering).unwrap();
      }

      showToast(dispatch, {
        message: `${itemName} ${isEditing ? "updated" : "created"}.`,
        variant: "success",
      });
    } catch (error) {
      const message = getCatalogMutationErrorMessage(
        error,
        `Unable to ${isEditing ? "update" : "create"} this ${itemName.toLowerCase()}.`,
      );

      showToast(dispatch, { message, variant: "error" });
      throw new Error(message);
    }
  }

  async function handleSaveDiscount(discount: DiscountInput) {
    const isEditing = discountEditorMode === "edit" && selectedDiscount;

    try {
      if (isEditing) {
        await updateDiscount({
          discountId: selectedDiscount.id,
          input: discount,
        }).unwrap();
      } else {
        await createDiscount(discount).unwrap();
      }

      showToast(dispatch, {
        message: `Discount ${isEditing ? "updated" : "created"}.`,
        variant: "success",
      });
    } catch (error) {
      const message = getCatalogMutationErrorMessage(
        error,
        `Unable to ${isEditing ? "update" : "create"} this discount.`,
      );

      showToast(dispatch, { message, variant: "error" });
      throw new Error(message);
    }
  }

  async function handleCreateGift(input: GiftInput) {
    try {
      const gift = await createGift(input).unwrap();
      showToast(dispatch, {
        message: "Gift created.",
        variant: "success",
      });
      return gift;
    } catch (error) {
      const message = getCatalogMutationErrorMessage(
        error,
        "Unable to create this gift.",
      );

      showToast(dispatch, { message, variant: "error" });
      throw new Error(message);
    }
  }

  async function handleSaveGift(input: GiftInput) {
    const isEditing = giftEditorMode === "edit" && selectedGift;

    try {
      if (isEditing) {
        await updateGift({
          giftId: selectedGift.id,
          input,
        }).unwrap();
      } else {
        await createGift(input).unwrap();
      }

      showToast(dispatch, {
        message: `Gift ${isEditing ? "updated" : "created"}.`,
        variant: "success",
      });
    } catch (error) {
      const message = getCatalogMutationErrorMessage(
        error,
        `Unable to ${isEditing ? "update" : "create"} this gift.`,
      );

      showToast(dispatch, { message, variant: "error" });
      throw new Error(message);
    }
  }

  async function deleteSelectedCatalogItem() {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === "offering") {
        await deleteOffering(deleteTarget.item.id).unwrap();
      } else if (deleteTarget.type === "discount") {
        await deleteDiscount(deleteTarget.item.id).unwrap();
      } else {
        await deleteGift(deleteTarget.item.id).unwrap();
      }

      showToast(dispatch, {
        message: `${capitalize(deleteTarget.type)} deleted.`,
        variant: "success",
      });
      setDeleteTarget(null);
    } catch (error) {
      showToast(dispatch, {
        message: getCatalogDeleteErrorMessage(error),
        variant: "error",
      });
    }
  }

  const isDiscountsTab = activeTab === "discounts";
  const isGiftsTab = activeTab === "gifts";
  const ctaLabel = isDiscountsTab
    ? "Create discount"
    : isGiftsTab
      ? "Create gift"
      : offeringDisplay.createLabel;
  const searchPlaceholder = isDiscountsTab
    ? "Search discounts"
    : isGiftsTab
      ? "Search gifts"
      : offeringDisplay.searchPlaceholder;
  const filterLabel = isDiscountsTab
    ? "Filter discounts"
    : isGiftsTab
      ? "Filter gifts"
      : offeringDisplay.filterLabel;
  const isSavingOffering = isCreatingOffering || isUpdatingOffering;
  const isSavingDiscount = isCreatingDiscount || isUpdatingDiscount;
  const isSavingGift = isCreatingGift || isUpdatingGift;
  const isDeletingCatalogItem =
    isDeletingOffering || isDeletingDiscount || isDeletingGift;

  return (
    <>
      <div className="grid gap-6 bg-background">
        <header className="flex flex-col gap-4 rounded-md bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-title-1 font-semibold text-[#2F4B4F]">
              {offeringDisplay.plural}
            </h1>
            <p className="mt-2 max-w-2xl text-callout text-[#2F4B4F]/75">
              {offeringDisplay.description}
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
                display={offeringDisplay}
                isLoading={isLoadingOfferings}
                offerings={offerings}
                onDelete={(offering) =>
                  setDeleteTarget({ item: offering, type: "offering" })
                }
                onEdit={openEditSheet}
                onView={openEditSheet}
              />
            ) : activeTab === "discounts" ? (
              <DiscountsTable
                discounts={discounts}
                isLoading={isLoadingDiscounts}
                onDelete={(discount) =>
                  setDeleteTarget({ item: discount, type: "discount" })
                }
                onEdit={openEditDiscountSheet}
                onView={openEditDiscountSheet}
              />
            ) : (
              <GiftsTable
                gifts={gifts}
                isLoading={isLoadingGifts}
                onDelete={(gift) =>
                  setDeleteTarget({ item: gift, type: "gift" })
                }
                onEdit={openEditGiftSheet}
                onView={openEditGiftSheet}
              />
            )}
          </div>
        </section>
      </div>

      <OfferingEditorSheet
        businessCategory={accountSetup?.business?.category ?? null}
        display={offeringDisplay}
        mode={offeringEditorMode}
        offering={selectedOffering}
        onClose={() => setIsOfferingEditorOpen(false)}
        onSave={handleSave}
        saving={isSavingOffering}
        open={isOfferingEditorOpen}
      />
      <DiscountEditorSheet
        discount={selectedDiscount}
        gifts={gifts}
        mode={discountEditorMode}
        onClose={() => setIsDiscountEditorOpen(false)}
        onCreateGift={handleCreateGift}
        onSave={handleSaveDiscount}
        open={isDiscountEditorOpen}
        saving={isSavingDiscount}
      />
      <GiftEditorSheet
        gift={selectedGift}
        mode={giftEditorMode}
        onClose={() => setIsGiftEditorOpen(false)}
        onSave={handleSaveGift}
        open={isGiftEditorOpen}
        saving={isSavingGift}
      />
      <CatalogDeleteDialog
        deleting={isDeletingCatalogItem}
        itemName={
          deleteTarget
            ? deleteTarget.type === "discount"
              ? deleteTarget.item.title
              : deleteTarget.item.name
            : ""
        }
        itemType={deleteTarget?.type ?? "offering"}
        onClose={() => setDeleteTarget(null)}
        onConfirm={deleteSelectedCatalogItem}
        open={Boolean(deleteTarget)}
      />
    </>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function getCatalogDeleteErrorMessage(error: unknown) {
  return getCatalogMutationErrorMessage(error, "Unable to delete this item.");
}

function getCatalogMutationErrorMessage(error: unknown, fallback: string) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}
