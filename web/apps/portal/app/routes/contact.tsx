import type { MetaFunction } from "@remix-run/node";
import { ContactPage } from "@/pages/marketing";

export const meta: MetaFunction = () => [
  { title: "Piya Support" },
  {
    name: "description",
    content: "Email Piya support at support@piya.store.",
  },
];

export default function ContactRoute() {
  return <ContactPage />;
}
