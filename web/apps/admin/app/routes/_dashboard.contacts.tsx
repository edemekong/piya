import type { MetaFunction } from "@remix-run/node";
import { ContactsPage } from "@/pages/contacts";

export const meta: MetaFunction = () => [{ title: "Contacts | Piya" }];

export default ContactsPage;
