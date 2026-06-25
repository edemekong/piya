import type { MetaFunction } from "@remix-run/node";
import { OfferingPage } from "@/pages/offerings";

export const meta: MetaFunction = () => [{ title: "Offerings | Yinapp Admin" }];

export default OfferingPage;
