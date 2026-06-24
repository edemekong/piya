import type { LinksFunction, MetaFunction } from "@remix-run/node";
import type * as React from "react";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ThemeScript } from "@yinapp/ui";
import stylesheet from "./styles.css?url";
import { ReduxProvider } from "./providers/redux-provider";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const meta: MetaFunction = () => [
  { title: "Yinapp Portal" },
  {
    name: "description",
    content: "Small business workspace for contacts, orders, services, and teams.",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <ThemeScript />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <ReduxProvider>
      <Outlet />
    </ReduxProvider>
  );
}
