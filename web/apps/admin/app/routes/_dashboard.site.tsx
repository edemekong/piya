import type { MetaFunction } from "@remix-run/node";
import { SitePage } from "@/pages/site";

export const meta: MetaFunction = () => [{ title: "Site | Piya" }];

export default SitePage;
