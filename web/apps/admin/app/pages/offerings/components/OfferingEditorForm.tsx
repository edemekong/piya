import * as React from "react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { AppCheckbox, AppSelectField, AppTextField } from "@piya/ui";
import type {
  BusinessCategoryTypes,
  OfferingAttributeValueType,
  OfferingFormDraft,
  OfferingSubType,
  OfferingType,
} from "@piya/shared/types";
import { OfferingCountryPicker } from "./OfferingCountryPicker";
import { OfferingEditorStepper } from "./OfferingEditorStepper";
import { OfferingImageUploadBoxes } from "./OfferingImageUploadBoxes";
import { OfferingPriceField } from "./OfferingPriceField";
import { OfferingTagPicker } from "./OfferingTagPicker";
import { RichDescriptionField } from "./RichDescriptionField";
import {
  getDefaultOfferingFeatures,
  getOfferingCategoryOptions,
  getProductCategoryOptions,
  getProductAttributePresets,
  getProductAttributeUnitOptions,
  getProductOptionPresets,
  getProductVariantPresets,
  paymentModeOptions,
  shouldShowProductStock,
  shouldShowServiceLocationFields,
  offeringEditorSteps,
  type OfferingEditorStep,
  type OfferingTypeOption,
  type OfferingAttributePreset,
  type OfferingOptionPreset,
} from "./offering-editor-options";

function OfferingEditorForm({
  activeStep,
  businessCategory,
  draft,
  namePlaceholder,
  onChange,
  steps,
  onTypeChange,
  typeOptions,
}: {
  activeStep: OfferingEditorStep;
  businessCategory: BusinessCategoryTypes | null;
  draft: OfferingFormDraft;
  namePlaceholder: string;
  onChange: (updates: Partial<OfferingFormDraft>) => void;
  steps: typeof offeringEditorSteps;
  onTypeChange: (type: OfferingType | "") => void;
  typeOptions: OfferingTypeOption[];
}) {
  const showServiceLocation =
    draft.type === "service" &&
    shouldShowServiceLocationFields(draft.subType);
  const showMeetingLink =
    draft.type === "service" && draft.subType === "online_appointment";
  const categoryOptions = draft.type
    ? getOfferingCategoryOptions(draft.type, businessCategory)
    : [];
  const productCategoryOptions =
    draft.type === "product" ? getProductCategoryOptions(businessCategory) : [];
  const productPresetContext = React.useMemo(
    () => ({
      businessCategory,
      categoryId: draft.categoryId,
      subType: draft.subType,
      type: draft.type,
    }),
    [businessCategory, draft.categoryId, draft.subType, draft.type],
  );
  const defaultFeatures = React.useMemo(() => {
    const features = getDefaultOfferingFeatures(draft.type, businessCategory);

    if (
      draft.type === "product" &&
      !shouldShowProductStock(productPresetContext)
    ) {
      return features.filter((feature) => feature !== "inventory");
    }

    return features;
  }, [businessCategory, draft.type, productPresetContext]);
  const productAttributePresets = React.useMemo(
    () => getProductAttributePresets(productPresetContext),
    [productPresetContext],
  );
  const productAttributeUnitOptions = React.useMemo(
    () => getProductAttributeUnitOptions(productPresetContext),
    [productPresetContext],
  );
  const productOptionPresets = React.useMemo(
    () => getProductOptionPresets(productPresetContext),
    [productPresetContext],
  );
  const productVariantPresets = React.useMemo(
    () => getProductVariantPresets(productPresetContext),
    [productPresetContext],
  );
  const showTypeSelector = typeOptions.length > 1;
  const showCategorySelector = categoryOptions.length > 1;
  const showProductCategorySelector = productCategoryOptions.length > 1;
  const subTypeLabel = draft.type === "product" ? "Product type" : "Category";
  const subTypePlaceholder =
    draft.type === "product" ? "Select product type" : "Select category";
  const showInventoryFields =
    draft.features.includes("inventory") &&
    shouldShowProductStock(productPresetContext);

  React.useEffect(() => {
    if (draft.type && categoryOptions.length === 1) {
      const defaultSubType = categoryOptions[0].value;

      if (draft.subType !== defaultSubType) {
        onChange({ subType: defaultSubType });
      }
    }
  }, [categoryOptions, draft.subType, draft.type, onChange]);

  React.useEffect(() => {
    if (draft.type !== "product") return;

    const selectedCategory = productCategoryOptions.find(
      (option) => option.id === draft.categoryId,
    );

    if (productCategoryOptions.length === 1) {
      const defaultCategory = productCategoryOptions[0];

      if (
        draft.categoryId !== defaultCategory.id ||
        draft.categoryName !== defaultCategory.label
      ) {
        onChange({
          categoryId: defaultCategory.id,
          categoryName: defaultCategory.label,
        });
      }

      return;
    }

    if (draft.categoryId && !selectedCategory) {
      onChange({ categoryId: "", categoryName: "" });
    }
  }, [
    draft.categoryId,
    draft.categoryName,
    draft.type,
    onChange,
    productCategoryOptions,
  ]);

  React.useEffect(() => {
    if (!draft.type) return;

    if (!areStringArraysEqual(draft.features, defaultFeatures)) {
      onChange({ features: defaultFeatures });
    }
  }, [defaultFeatures, draft.features, draft.type, onChange]);

  React.useEffect(() => {
    if (draft.type !== "product") return;

    const nextAttributes = getValidProductAttributes(
      draft.attributes,
      productAttributePresets,
      productAttributeUnitOptions,
    );
    const nextOptions = getValidProductOptions(
      draft.options,
      productOptionPresets,
    );
    const updates: Partial<OfferingFormDraft> = {};

    if (nextAttributes !== draft.attributes) {
      updates.attributes = nextAttributes;
    }

    if (nextOptions !== draft.options) {
      updates.options = nextOptions;
    }

    if (
      !showInventoryFields &&
      (draft.inventoryAllowBackorders ||
        draft.inventoryQuantity ||
        draft.inventorySku ||
        draft.inventoryTrackQuantity)
    ) {
      updates.inventoryAllowBackorders = false;
      updates.inventoryQuantity = "";
      updates.inventorySku = "";
      updates.inventoryTrackQuantity = false;
    }

    if (Object.keys(updates).length) {
      onChange(updates);
    }
  }, [
    draft.attributes,
    draft.inventoryAllowBackorders,
    draft.inventoryQuantity,
    draft.inventorySku,
    draft.inventoryTrackQuantity,
    draft.options,
    draft.type,
    onChange,
    productAttributePresets,
    productAttributeUnitOptions,
    productOptionPresets,
    showInventoryFields,
  ]);

  React.useEffect(() => {
    if (
      !showServiceLocation &&
      (draft.locationAddress ||
        draft.locationCity ||
        draft.locationState ||
        draft.locationCountry ||
        draft.locationPostalCode)
    ) {
      onChange({
        locationAddress: "",
        locationCity: "",
        locationCountry: "",
        locationPostalCode: "",
        locationState: "",
      });
    }
  }, [
    draft.locationAddress,
    draft.locationCity,
    draft.locationCountry,
    draft.locationPostalCode,
    draft.locationState,
    onChange,
    showServiceLocation,
  ]);

  React.useEffect(() => {
    const paymentModes = draft.paymentModes.filter(
      (mode) => mode === "pay_now" || mode === "pay_later",
    );
    const updates: Partial<OfferingFormDraft> = {};

    if (!areStringArraysEqual(draft.paymentModes, paymentModes)) {
      updates.paymentModes = paymentModes;
    }

    if (
      draft.depositAmount ||
      draft.depositPercent ||
      draft.maxQuantity ||
      draft.minQuantity ||
      draft.requiresBusinessConfirmation
    ) {
      updates.depositAmount = "";
      updates.depositPercent = "";
      updates.maxQuantity = "";
      updates.minQuantity = "";
      updates.requiresBusinessConfirmation = false;
    }

    if (Object.keys(updates).length) {
      onChange(updates);
    }
  }, [
    draft.depositAmount,
    draft.depositPercent,
    draft.maxQuantity,
    draft.minQuantity,
    draft.paymentModes,
    draft.requiresBusinessConfirmation,
    onChange,
  ]);

  function addAttribute() {
    onChange({
      attributes: [...draft.attributes, createAttributeDraft()],
    });
  }

  function updateAttribute(
    index: number,
    updates: Partial<OfferingFormDraft["attributes"][number]>,
  ) {
    onChange({
      attributes: draft.attributes.map((attribute, attributeIndex) =>
        attributeIndex === index ? { ...attribute, ...updates } : attribute,
      ),
    });
  }

  function removeAttribute(index: number) {
    onChange({
      attributes: draft.attributes.filter((_, attributeIndex) =>
        attributeIndex !== index
      ),
    });
  }

  function addOption() {
    onChange({
      options: [...draft.options, createOptionDraft()],
    });
  }

  function updateOption(
    index: number,
    updates: Partial<OfferingFormDraft["options"][number]>,
  ) {
    onChange({
      options: draft.options.map((option, optionIndex) =>
        optionIndex === index ? { ...option, ...updates } : option,
      ),
    });
  }

  function removeOption(index: number) {
    onChange({
      options: draft.options.filter((_, optionIndex) => optionIndex !== index),
    });
  }

  function addVariant() {
    onChange({
      variants: [...draft.variants, createVariantDraft()],
    });
  }

  function updateVariant(
    index: number,
    updates: Partial<OfferingFormDraft["variants"][number]>,
  ) {
    onChange({
      variants: draft.variants.map((variant, variantIndex) =>
        variantIndex === index ? { ...variant, ...updates } : variant,
      ),
    });
  }

  function removeVariant(index: number) {
    onChange({
      variants: draft.variants.filter((_, variantIndex) =>
        variantIndex !== index
      ),
    });
  }

  return (
    <form className="grid gap-5">
      <OfferingEditorStepper activeStep={activeStep} steps={steps} />

      {activeStep === "basics" ? (
        <div className="grid gap-4">
          <AppTextField
            label="Name"
            onChange={(event) => onChange({ name: event.target.value })}
            placeholder={namePlaceholder}
            value={draft.name}
          />
          <RichDescriptionField
            label="Description"
            onChange={(description) => onChange({ description })}
            value={draft.description}
          />
          {showTypeSelector ? (
            <AppSelectField
              label="Type"
              onChange={(event) =>
                onTypeChange(event.target.value as OfferingType | "")
              }
              options={[
                { label: "Select type", value: "" },
                ...typeOptions,
              ]}
              value={draft.type}
            />
          ) : null}
          {showProductCategorySelector ? (
            <AppSelectField
              label="Product category"
              onChange={(event) => {
                const categoryId = event.target.value;
                const category = productCategoryOptions.find(
                  (option) => option.id === categoryId,
                );

                onChange({
                  categoryId,
                  categoryName: category?.label ?? "",
                });
              }}
              options={[
                { label: "Select product category", value: "" },
                ...productCategoryOptions.map((option) => ({
                  label: option.label,
                  value: option.id,
                })),
              ]}
              value={draft.categoryId}
            />
          ) : null}
          {draft.type && showCategorySelector ? (
            <AppSelectField
              label={subTypeLabel}
              onChange={(event) =>
                onChange({
                  subType: event.target.value as OfferingSubType,
                })
              }
              options={[
                { label: subTypePlaceholder, value: "" },
                ...categoryOptions,
              ]}
              value={draft.subType}
            />
          ) : null}
        </div>
      ) : null}

      {activeStep === "details" && draft.type === "product" ? (
        <div className="grid gap-4">
          <OfferingPriceField
            currency={draft.currency}
            label="Price"
            onCurrencyChange={(currency) => onChange({ currency })}
            onChange={(price) => onChange({ price })}
            placeholder="Enter price"
            value={draft.price}
          />
          <OfferingTagPicker
            onChange={(tags) => onChange({ tags })}
            selected={draft.tags}
            type="product"
          />
        </div>
      ) : null}

      {activeStep === "details" && draft.type === "service" ? (
        <div className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <OfferingPriceField
              currency={draft.currency}
              label="Price"
              onCurrencyChange={(currency) => onChange({ currency })}
              onChange={(price) => onChange({ price })}
              placeholder="Enter price"
              value={draft.price}
            />
            <AppTextField
              label="Duration"
              onChange={(event) =>
                onChange({ duration: event.target.value })
              }
              placeholder="Enter duration in minutes"
              type="number"
              value={draft.duration}
            />
          </div>
          <OfferingTagPicker
            onChange={(tags) => onChange({ tags })}
            selected={draft.tags}
            type="service"
          />
          {showMeetingLink ? (
            <AppTextField
              label="Meeting link"
              onChange={(event) =>
                onChange({ meetingLink: event.target.value })
              }
              placeholder="Enter meeting link"
              type="url"
              value={draft.meetingLink}
            />
          ) : null}
          {showServiceLocation ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <AppTextField
                label="Address"
                onChange={(event) =>
                  onChange({ locationAddress: event.target.value })
                }
                placeholder="Enter address"
                value={draft.locationAddress}
              />
              <AppTextField
                label="City"
                onChange={(event) =>
                  onChange({ locationCity: event.target.value })
                }
                placeholder="Enter city"
                value={draft.locationCity}
              />
              <AppTextField
                label="State"
                onChange={(event) =>
                  onChange({ locationState: event.target.value })
                }
                placeholder="Enter state"
                value={draft.locationState}
              />
              <OfferingCountryPicker
                label="Country"
                onChange={(locationCountry) => onChange({ locationCountry })}
                value={draft.locationCountry}
              />
              <AppTextField
                label="Postal code"
                onChange={(event) =>
                  onChange({ locationPostalCode: event.target.value })
                }
                placeholder="Enter postal code"
                value={draft.locationPostalCode}
              />
            </div>
          ) : null}
        </div>
      ) : null}

      {activeStep === "configuration" && draft.type === "product" ? (
        <div className="grid gap-5">
          <EditorFieldGroup
            actionLabel="Add attribute"
            onAction={addAttribute}
            title="Product details"
          >
            <EditableTable
              columnWidths={["30%", "34%", "28%", "48px"]}
              headers={["Type", "Value", "Unit", ""]}
            >
              {draft.attributes.map((attribute, index) => (
                <tr className="border-b border-border last:border-0" key={index}>
                  <td className="p-1.5">
                    <RowSelect
                      ariaLabel="Attribute type"
                      onChange={(value) => {
                        const preset = productAttributePresets.find(
                          (item) => item.name === value,
                        );

                        updateAttribute(index, {
                          name: value,
                          unit: preset?.unit ?? "",
                          value: preset?.values?.[0] ?? "",
                          valueType: preset?.valueType ?? "text",
                        });
                      }}
                      options={productAttributePresets.map((preset) => ({
                        label: preset.label,
                        value: preset.name,
                      }))}
                      placeholder="Choose type"
                      value={attribute.name}
                    />
                  </td>
                  <td className="p-1.5">
                    {getAttributePreset(
                      attribute.name,
                      productAttributePresets,
                    )?.values?.length ||
                    attribute.valueType === "yes_no" ? (
                      <RowSelect
                        ariaLabel="Attribute value"
                        onChange={(value) => updateAttribute(index, { value })}
                        options={getAttributeValueOptions(
                          attribute,
                          productAttributePresets,
                        ).map((value) => ({ label: value, value }))}
                        placeholder="Choose value"
                        value={attribute.value}
                      />
                    ) : (
                      <RowTextInput
                        ariaLabel="Attribute value"
                        onChange={(value) => updateAttribute(index, { value })}
                        placeholder={getValuePlaceholder(attribute.valueType)}
                        type={getValueInputType(attribute.valueType)}
                        value={attribute.value}
                      />
                    )}
                  </td>
                  <td className="p-1.5">
                    <RowSelect
                      ariaLabel="Unit"
                      onChange={(unit) => updateAttribute(index, { unit })}
                      options={productAttributeUnitOptions}
                      placeholder="No unit"
                      value={attribute.unit}
                    />
                  </td>
                  <td className="p-1.5">
                    <RemoveRowButton
                      onRemove={() => removeAttribute(index)}
                      removeLabel="Remove attribute"
                    />
                  </td>
                </tr>
              ))}
            </EditableTable>
          </EditorFieldGroup>

          <EditorFieldGroup
            actionLabel="Add option"
            onAction={addOption}
            title="Customer choices"
          >
            <EditableTable
              columnWidths={["34%", "58%", "48px"]}
              headers={["Option", "Values customers choose", ""]}
            >
              {draft.options.map((option, index) => (
                <tr className="border-b border-border last:border-0" key={index}>
                  <td className="p-1.5">
                    <RowSelect
                      ariaLabel="Option type"
                      onChange={(value) => {
                        const preset = productOptionPresets.find(
                          (item) => item.name === value,
                        );

                        updateOption(index, {
                          name: value,
                          values: preset?.values.join(", ") ?? "",
                        });
                      }}
                      options={productOptionPresets.map((preset) => ({
                        label: preset.label,
                        value: preset.name,
                      }))}
                      placeholder="Choose option"
                      value={option.name}
                    />
                  </td>
                  <td className="p-1.5">
                    <RowTextInput
                      ariaLabel="Option values"
                      onChange={(values) => updateOption(index, { values })}
                      placeholder="Small, Medium, Large"
                      value={option.values}
                    />
                  </td>
                  <td className="p-1.5">
                    <RemoveRowButton
                      onRemove={() => removeOption(index)}
                      removeLabel="Remove option"
                    />
                  </td>
                </tr>
              ))}
            </EditableTable>
          </EditorFieldGroup>

          <EditorFieldGroup
            actionLabel="Add variant"
            onAction={addVariant}
            title="Versions"
          >
            <EditableTable
              columnWidths={["22%", "25%", "17%", "14%", "14%", "48px"]}
              headers={["Variant type", "Title", "SKU", "Price", "Stock", ""]}
            >
              {draft.variants.map((variant, index) => (
                <tr className="border-b border-border last:border-0" key={index}>
                  <td className="p-1.5">
                    <RowSelect
                      ariaLabel="Variant type"
                      onChange={(title) => updateVariant(index, { title })}
                      options={productVariantPresets.map((preset) => ({
                        label: preset.label,
                        value: preset.title,
                      }))}
                      placeholder="Choose type"
                      value={variant.title}
                    />
                  </td>
                  <td className="p-1.5">
                    <RowTextInput
                      ariaLabel="Variant title"
                      onChange={(title) => updateVariant(index, { title })}
                      placeholder="Black / Medium"
                      value={variant.title}
                    />
                  </td>
                  <td className="p-1.5">
                    <RowTextInput
                      ariaLabel="Variant SKU"
                      onChange={(sku) => updateVariant(index, { sku })}
                      placeholder="SKU"
                      value={variant.sku}
                    />
                  </td>
                  <td className="p-1.5">
                    <RowTextInput
                      ariaLabel="Variant price"
                      onChange={(price) => updateVariant(index, { price })}
                      placeholder="0"
                      type="number"
                      value={variant.price}
                    />
                  </td>
                  <td className="p-1.5">
                    <RowTextInput
                      ariaLabel="Variant stock"
                      onChange={(quantity) => updateVariant(index, { quantity })}
                      placeholder="0"
                      type="number"
                      value={variant.quantity}
                    />
                  </td>
                  <td className="p-1.5">
                    <RemoveRowButton
                      onRemove={() => removeVariant(index)}
                      removeLabel="Remove variant"
                    />
                  </td>
                </tr>
              ))}
            </EditableTable>
          </EditorFieldGroup>

          {showInventoryFields ? (
            <EditorFieldGroup title="Stock">
              <div className="grid gap-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                  <InlineCheckbox
                    checked={draft.inventoryTrackQuantity}
                    label="Track quantity"
                    onCheckedChange={(inventoryTrackQuantity) =>
                      onChange({ inventoryTrackQuantity })
                    }
                  />
                  <InlineCheckbox
                    checked={draft.inventoryAllowBackorders}
                    label="Allow orders when out of stock"
                    onCheckedChange={(inventoryAllowBackorders) =>
                      onChange({ inventoryAllowBackorders })
                    }
                  />
                </div>
                {draft.inventoryTrackQuantity ? (
                  <AppTextField
                    label="Stock quantity"
                    onChange={(event) =>
                      onChange({ inventoryQuantity: event.target.value })
                    }
                    placeholder="Enter stock quantity"
                    type="number"
                    value={draft.inventoryQuantity}
                  />
                ) : null}
                <AppTextField
                  label="SKU / item code"
                  onChange={(event) =>
                    onChange({ inventorySku: event.target.value })
                  }
                  placeholder="Example: TSHIRT-BLK-L"
                  value={draft.inventorySku}
                />
              </div>
            </EditorFieldGroup>
          ) : null}
        </div>
      ) : null}

      {activeStep === "checkout" && draft.type ? (
        <div className="grid gap-5">
          <EditorFieldGroup title="Checkout">
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                {paymentModeOptions.map((option) => (
                  <CheckboxRow
                    checked={draft.paymentModes.includes(option.value)}
                    key={option.value}
                    label={option.label}
                    onCheckedChange={(checked) =>
                      onChange({
                        paymentModes: toggleValue(
                          draft.paymentModes,
                          option.value,
                          checked,
                        ),
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </EditorFieldGroup>
        </div>
      ) : null}

      {activeStep === "media" && draft.type === "product" ? (
        <OfferingImageUploadBoxes
          images={splitImageUrls(draft.imageUrls)}
          label="Images"
          multiple
        />
      ) : null}

      {activeStep === "media" && draft.type === "service" ? (
        <OfferingImageUploadBoxes
          images={draft.imageUrl ? [draft.imageUrl] : []}
          label="Image"
        />
      ) : null}

      {activeStep !== "basics" && !draft.type ? (
        <p className="rounded-md border border-border bg-fill p-4 text-callout text-[#2F4B4F]/70">
          Choose an offering type in Basics before setting up this section.
        </p>
      ) : null}
    </form>
  );
}

export { OfferingEditorForm };

function CheckboxRow({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-sm border border-border bg-fill px-3 py-2.5">
      <AppCheckbox
        checked={checked}
        label={label}
        onCheckedChange={onCheckedChange}
      />
      <span className="text-callout font-medium text-[#2F4B4F]">{label}</span>
    </div>
  );
}

function InlineCheckbox({
  checked,
  label,
  onCheckedChange,
}: {
  checked: boolean;
  label: string;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <AppCheckbox
        checked={checked}
        label={label}
        onCheckedChange={onCheckedChange}
      />
      <span className="text-callout font-medium text-[#2F4B4F]">{label}</span>
    </div>
  );
}

function EditorFieldGroup({
  actionLabel,
  children,
  onAction,
  title,
}: {
  actionLabel?: string;
  children: React.ReactNode;
  onAction?: () => void;
  title: string;
}) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-callout font-semibold text-[#2F4B4F]">{title}</h3>
        {onAction && actionLabel ? (
          <button
            className="inline-flex w-36 items-center justify-center gap-2 rounded-sm border border-border bg-white px-3 py-2 text-caption-1 font-semibold text-[#2F4B4F] transition hover:bg-fill"
            onClick={onAction}
            type="button"
          >
            <Plus className="size-3.5" />
            {actionLabel}
          </button>
        ) : null}
      </div>
      {children}
    </section>
  );
}


function EditableTable({
  children,
  columnWidths,
  headers,
}: {
  children: React.ReactNode[];
  columnWidths: string[];
  headers: string[];
}) {
  if (!children.length) return null;

  return (
    <div className="rounded-md border border-border">
      <table className="w-full table-fixed border-collapse bg-white text-left">
        <colgroup>
          {columnWidths.map((width, index) => (
            <col key={`${width}-${index}`} style={{ width }} />
          ))}
        </colgroup>
        <thead>
          <tr className="border-b border-border bg-fill text-caption-1 text-[#2F4B4F]/60">
            {headers.map((header) => (
              <th className="px-2 py-1.5 font-semibold" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function RowSelect({
  ariaLabel,
  onChange,
  options,
  placeholder,
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
  value: string;
}) {
  return (
    <span className="relative block">
      <select
        aria-label={ariaLabel}
        className="h-10 w-full appearance-none truncate rounded-sm border border-border bg-white py-0 pl-2 pr-10 text-callout text-[#2F4B4F] outline-none transition focus:border-primary"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-[#2F4B4F]/55"
      />
    </span>
  );
}

function RowTextInput({
  ariaLabel,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  ariaLabel: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
}) {
  return (
    <input
      aria-label={ariaLabel}
      className="h-10 w-full rounded-sm border border-border bg-white px-2 text-callout text-[#2F4B4F] outline-none transition placeholder:text-[#2F4B4F]/40 focus:border-primary"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      type={type}
      value={value}
    />
  );
}

function RemoveRowButton({
  onRemove,
  removeLabel,
}: {
  onRemove: () => void;
  removeLabel: string;
}) {
  return (
    <button
      aria-label={removeLabel}
      className="inline-flex size-8 items-center justify-center rounded-sm text-error transition hover:bg-fill"
      onClick={onRemove}
      type="button"
    >
      <Trash2 className="size-3.5" />
    </button>
  );
}

function toggleValue<T>(values: T[], value: T, checked: boolean) {
  if (checked) {
    return values.includes(value) ? values : [...values, value];
  }

  return values.filter((item) => item !== value);
}

function splitImageUrls(value: string) {
  return value
    .split(",")
    .map((imageUrl) => imageUrl.trim())
    .filter(Boolean);
}

function createAttributeDraft(): OfferingFormDraft["attributes"][number] {
  return {
    id: "",
    name: "",
    unit: "",
    value: "",
    valueType: "text",
  };
}

function createOptionDraft(): OfferingFormDraft["options"][number] {
  return { id: "", name: "", values: "" };
}

function createVariantDraft(): OfferingFormDraft["variants"][number] {
  return {
    id: "",
    imageUrl: "",
    price: "",
    quantity: "",
    sku: "",
    status: "active",
    title: "",
  };
}

function getValidProductAttributes(
  attributes: OfferingFormDraft["attributes"],
  presets: OfferingAttributePreset[],
  unitOptions: { label: string; value: string }[],
) {
  const presetNames = new Set(presets.map((preset) => preset.name));
  const unitValues = new Set(unitOptions.map((option) => option.value));
  let changed = false;

  const nextAttributes = attributes.map((attribute) => {
    if (attribute.name && !presetNames.has(attribute.name)) {
      changed = true;

      return {
        ...attribute,
        name: "",
        unit: "",
        value: "",
        valueType: "text" as const,
      };
    }

    const preset = getAttributePreset(attribute.name, presets);
    const presetValues = preset?.values ?? [];
    let nextAttribute = attribute;

    if (
      presetValues.length &&
      attribute.value &&
      !presetValues.includes(attribute.value)
    ) {
      changed = true;
      nextAttribute = { ...nextAttribute, value: presetValues[0] ?? "" };
    }

    if (nextAttribute.unit && !unitValues.has(nextAttribute.unit)) {
      changed = true;
      nextAttribute = { ...nextAttribute, unit: "" };
    }

    return nextAttribute;
  });

  return changed ? nextAttributes : attributes;
}

function getValidProductOptions(
  options: OfferingFormDraft["options"],
  presets: OfferingOptionPreset[],
) {
  const presetNames = new Set(presets.map((preset) => preset.name));
  let changed = false;

  const nextOptions = options.map((option) => {
    if (!option.name || presetNames.has(option.name)) return option;

    changed = true;

    return {
      ...option,
      name: "",
      values: "",
    };
  });

  return changed ? nextOptions : options;
}

function getAttributePreset(
  name: string,
  presets: OfferingAttributePreset[],
) {
  return presets.find((preset) => preset.name === name);
}

function getAttributeValueOptions(
  attribute: OfferingFormDraft["attributes"][number],
  presets: OfferingAttributePreset[],
) {
  const presetValues = getAttributePreset(attribute.name, presets)?.values;
  if (presetValues?.length) return presetValues;
  if (attribute.valueType === "yes_no") return ["Yes", "No"];

  return [];
}

function getValueInputType(valueType: OfferingAttributeValueType) {
  if (valueType === "number") return "number";
  if (valueType === "date") return "date";

  return "text";
}

function getValuePlaceholder(valueType: OfferingAttributeValueType) {
  if (valueType === "number") return "Enter a number";
  if (valueType === "date") return "Select date";
  if (valueType === "yes_no") return "Yes or No";

  return "Enter value";
}

function areStringArraysEqual(first: string[], second: string[]) {
  if (first.length !== second.length) return false;

  return first.every((value, index) => value === second[index]);
}
