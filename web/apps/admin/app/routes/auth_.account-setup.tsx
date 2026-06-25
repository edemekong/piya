import type { MetaFunction } from "@remix-run/node";
import { AccountSetupPage } from "@/pages/auth";

export const meta: MetaFunction = () => [
  { title: "Account setup | Piya Admin" },
];

export default AccountSetupPage;
