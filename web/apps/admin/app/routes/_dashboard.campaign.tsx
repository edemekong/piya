import type { MetaFunction } from "@remix-run/node";
import { CampaignPage } from "@/pages/campaign";

export const meta: MetaFunction = () => [{ title: "Campaign | Yinapp Admin" }];

export default CampaignPage;
