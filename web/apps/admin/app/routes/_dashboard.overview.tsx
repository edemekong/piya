import type { MetaFunction } from "@remix-run/node";
import { OverviewPage } from "@/pages/overview";

export const meta: MetaFunction = () => [{ title: "Overview | Piya" }];

export default OverviewPage;
