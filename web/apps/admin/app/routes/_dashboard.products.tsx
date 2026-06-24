import type { MetaFunction } from "@remix-run/node";
import { ProductsPage } from "@/pages/products";

export const meta: MetaFunction = () => [{ title: "Products | Yinapp Admin" }];

export default ProductsPage;
