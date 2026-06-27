import type { MetaFunction } from "@remix-run/node";
import { PrivacyPage } from "@/pages/marketing";

export const meta: MetaFunction = () => [
  { title: "Privacy Policy | Piya" },
  {
    name: "description",
    content:
      "Privacy Policy for Piya, a product operated by Yina Store Ltd.",
  },
];

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
