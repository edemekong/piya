import type { MetaFunction } from "@remix-run/node";
import { SignInPage } from "@/pages/auth";

export const meta: MetaFunction = () => [{ title: "Sign in | Piya Admin" }];

export default SignInPage;
