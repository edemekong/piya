import type { DeliveryStatusType } from "../types/delivery.type";
import type { BaseModel } from "./base";
import type { LocationData } from "./location";
import type { MiniUserData } from "./user";

interface DeliveryData extends BaseModel {
  businessId: string;
  orderId: string;
  shareId?: string;
  createdBy: MiniUserData;
  contacts: string[];
  assignedRider?: AssignedRider | null;
  userLocation: LocationData;
  logistics: LogisticsData;
  lastDeliveryPackageId?: string;
  deliveryPackages?: Record<string, DeliveryPackageData>;
  metadata?: Record<string, any>;
}
interface LogisticsData {
  vehicleType: string;
  distanceInMeters: number;
  durationInMinutes: number;
  totalItemsPrice?: number;
  totalItems: number;
  deliveryTotalAmount: number;
  subdeliveryTotalAmount: number;
  estimatedDeliveryAt?: number;
  chargePerKm: number;
}
interface AssignedRider {
  riderId: string;
  assignedAt: number;
}
interface DeliveryContactData {
  userId?: string;
  name: string;
  phoneNumber: string;
  email: string;
  note?: string;
  status: DeliveryStatusTypeData;
  location?: LocationData;
}
interface DeliveryStatusTypeData {
  current: DeliveryStatusType;
  updatedAt: number;
  history: Record<string, DeliveryStatusHistory>;
}
interface DeliveryStatusHistory {
  status: DeliveryStatusType;
  timestamp: number;
}
interface DeliveryItem {
  itemId: string;
  category: string;
  attachmentUrls: string[];
  quantity: number;
  amount: number;
  fragile: boolean;
}
interface DeliveryPackageData {
  packageId: string;
  items: DeliveryItem[];
  contact?: DeliveryContactData;
}

export type { DeliveryData as DeliveryModel, LogisticsData };
