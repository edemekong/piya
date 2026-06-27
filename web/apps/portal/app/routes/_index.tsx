import type { MetaFunction } from "@remix-run/node";
import { LandingPage } from "@/pages/marketing";

export const meta: MetaFunction = () => [
  { title: "Piya | Customer relationships, campaigns, and conversations" },
  {
    name: "description",
    content:
      "Piya helps growing businesses manage contacts, campaigns, loyalty, discounts, and customer conversations across email, SMS, WhatsApp, and the customer app.",
  },
];

export default function IndexRoute() {
  return <LandingPage />;
}
