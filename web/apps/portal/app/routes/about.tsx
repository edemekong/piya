import type { MetaFunction } from "@remix-run/node";
import { AboutPage } from "@/pages/marketing";

export const meta: MetaFunction = () => [
  { title: "About Piya" },
  {
    name: "description",
    content:
      "Learn about Piya, a customer relationship, campaign, and communication platform operated by Yina Store Ltd.",
  },
];

export default function AboutRoute() {
  return <AboutPage />;
}
