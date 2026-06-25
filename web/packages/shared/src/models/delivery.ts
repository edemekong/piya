import type { BaseModel } from "./base";
import type { LocationData } from "./location";
import type { MiniUserData } from "./user";

export type DeliveryStatusType =
  | "pending"
  | "assigned"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled"
  | "rejected"
  | "expired";

export type LogisticsData = {
  vehicleType: string;
  distanceInMeters: number;
  durationInMinutes: number;
  totalItemsPrice?: number;
  totalItems: number;
  deliveryTotalAmount: number;
  subdeliveryTotalAmount: number;
  estimatedDeliveryAt?: number;
  chargePerKm: number;
};

export type AssignedRider = {
  riderId: string;
  assignedAt: number;
};

export type DeliveryStatusTypeData = {
  current: DeliveryStatusType;
  updatedAt: number;
  history: Record<string, DeliveryStatusHistory>;
};

export type DeliveryStatusHistory = {
  status: DeliveryStatusType;
  timestamp: number;
};

export type DeliveryContactData = {
  userId?: string;
  name: string;
  phoneNumber: string;
  email: string;
  note?: string;
  status: DeliveryStatusTypeData;
  location?: LocationData;
};

export type DeliveryItem = {
  itemId: string;
  category: string;
  attachmentUrls: string[];
  quantity: number;
  amount: number;
  fragile: boolean;
};

export type DeliveryPackageData = {
  packageId: string;
  items: DeliveryItem[];
  contact?: DeliveryContactData;
};

export interface DeliveryData extends BaseModel {
  shareId?: string;
  createdBy: MiniUserData;
  contacts: string[];
  assignedRider?: AssignedRider | null;
  userLocation: LocationData;
  logistics: LogisticsData;
  lastDeliveryPackageId?: string;
  deliveryPackages?: Record<string, DeliveryPackageData>;
  metadata?: Record<string, unknown>;
}

export type DeliveryModel = DeliveryData;
