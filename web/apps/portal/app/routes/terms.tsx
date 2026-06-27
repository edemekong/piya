import type { MetaFunction } from "@remix-run/node";
import { TermsPage } from "@/pages/marketing";

export const meta: MetaFunction = () => [
  { title: "Terms of Service | Piya" },
  {
    name: "description",
    content:
      "Terms of Service for Piya, a product operated by F&P Yina Stores LTD.",
  },
];

export default function TermsRoute() {
  return <TermsPage />;
}
