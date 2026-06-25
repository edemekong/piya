import type { MetaFunction } from "@remix-run/node";
import { OfferingPage } from "@/pages/offerings";

export const meta: MetaFunction = () => [{ title: "Offerings | Piya Admin" }];

export default OfferingPage;
