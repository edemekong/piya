import type { MetaFunction } from "@remix-run/node";
import { OrdersPage } from "@/pages/orders";

export const meta: MetaFunction = () => [{ title: "Orders | Yinapp Admin" }];

export default OrdersPage;
