import type { BaseAPIServiceOptions } from "../types";
import { dummyOrders } from "../utils/dummy_data";
import { BaseAPIService } from "./base-api.service";

export type {
  OrderData,
  OrderFulfillmentDetails,
  OrderItem,
  OrderItemType,
  OrderPaymentStatus,
  OrderStatus,
} from "../models";

export class OrdersService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions = {}) {
    super(options);
  }

  getOrders() {
    return dummyOrders;
  }
}

export const ordersService = new OrdersService();
