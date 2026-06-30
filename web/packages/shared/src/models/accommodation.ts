import type {
  AccommodationReservationStatusType,
  AccommodationUnitStatusType,
} from "../types/accommodation.type";
import type { BaseModel } from "./base";
import type { LocationData } from "./location";

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
  status: AccommodationUnitStatusType;
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
  status: AccommodationReservationStatusType;
  metadata?: Record<string, any> | null;
}

export type {
  AccommodationAvailabilityData,
  AccommodationReservationData,
  AccommodationUnitData,
};
