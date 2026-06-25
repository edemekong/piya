import { Button } from "@piya/ui";
import { profileMenuItems } from "../profileSections";
import {
  FieldGrid,
  ProfileField,
  ProfileSelect,
  ProfileTextarea,
} from "../components/ProfileFields";
import { SettingsCard, SettingsSection as ProfileSectionShell } from "@piya/ui";

const section = profileMenuItems.find((item) => item.value === "business")!;

const businessCategories = [
  { label: "Laundry", value: "laundry" },
  { label: "Fashion tailoring", value: "fashion_tailoring" },
  { label: "Salon", value: "salon" },
  { label: "Barbershop", value: "barbershop" },
  { label: "Spa", value: "spa" },
  { label: "Beauty studio", value: "beauty_studio" },
  { label: "Car wash", value: "car_wash" },
  { label: "Logistics delivery", value: "logistics_delivery" },
  { label: "Restaurant", value: "restaurant" },
  { label: "Food vendor", value: "food_vendor" },
  { label: "Supermarket", value: "supermarket" },
  { label: "Farm produce", value: "farm_produce" },
  { label: "Fashion store", value: "fashion_store" },
  { label: "Electronics store", value: "electronics_store" },
  { label: "Photography", value: "photography" },
  { label: "Consulting", value: "consulting" },
  { label: "Real estate agent", value: "real_estate_agent" },
  { label: "Hotel guesthouse", value: "hotel_guesthouse" },
  { label: "Shortlet apartment", value: "shortlet_apartment" },
];

export function BusinessProfilePage() {
  return (
    <ProfileSectionShell
      actions={<Button size="sm">Save changes</Button>}
      description={section.description}
      icon={section.icon}
      title={section.label}
    >
      <SettingsCard title="Business identity">
        <FieldGrid>
          <ProfileField label="Business name" value="Piya Store" />
          <ProfileSelect
            label="Business category"
            options={businessCategories}
            value="fashion_store"
          />
          <div className="md:col-span-2">
            <ProfileField label="Public domain" value="piya.store" />
          </div>
        </FieldGrid>
        <ProfileTextarea
          label="Business description"
          value="Customer commerce, ordering, and messaging in one admin workspace."
        />
      </SettingsCard>

      <SettingsCard title="Business contact">
        <FieldGrid>
          <ProfileField
            label="Business email"
            type="email"
            value="hello@piya.store"
          />
          <ProfileField
            label="Business phone"
            type="tel"
            value="+234 802 000 0000"
          />
        </FieldGrid>
      </SettingsCard>

      <SettingsCard title="Service locations">
        <button
          className="flex h-12 w-full items-center justify-center rounded-sm border border-dashed border-[#2F4B4F]/25 bg-fill text-callout font-semibold text-[#2F4B4F]/65 transition hover:border-primary hover:bg-white hover:text-primary"
          type="button"
        >
          Add locations you operate
        </button>
      </SettingsCard>
    </ProfileSectionShell>
  );
}
