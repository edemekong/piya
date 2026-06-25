import type { MetaFunction } from "@remix-run/node";
import { CommunicationsPage } from "@/pages/communications";

export const meta: MetaFunction = () => [
  { title: "Communications | Yinapp Admin" },
];

export default CommunicationsPage;
