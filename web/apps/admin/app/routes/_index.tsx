import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

export function loader(_args: LoaderFunctionArgs) {
  return redirect("/overview");
}

export default function IndexRoute() {
  return null;
}
