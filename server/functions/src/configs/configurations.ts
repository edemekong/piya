import { defineString } from "firebase-functions/params";
import { onInit } from "firebase-functions/v2/core";
import { algoliasearch, SearchClient } from "algoliasearch";

import service_account_dev = require("../../1bee-dev-adminsdk.json");
import service_account_prod = require("../../1bee-prod-adminsdk.json");

const ENV = defineString("ENV");
const STORAGE_BUCKET = defineString("STORAGE_BUCKET");
const RESEND_API_KEY = defineString("RESEND_API_KEY");
const APP_LOGO_URL = defineString("APP_LOGO_URL");
const DOMAIN = defineString("DOMAIN");
const JWT_SECRET = defineString("JWT_SECRET");
const GOOGLE_MAP_API_KEY = defineString("GOOGLE_MAP_API_KEY");
const ALGOLIA_APP_ID = defineString("ALGOLIA_APP_ID");
const ALGOLIA_ADMIN_KEY = defineString("ALGOLIA_ADMIN_KEY");
const PREMBLY_API_KEY = defineString("PREMBLY_API_KEY");
const PAYSTACK_SECRET_KEY = defineString("PAYSTACK_SECRET_KEY");
const PAYSTACK_PUBLIC_KEY = defineString("PAYSTACK_PUBLIC_KEY");
const WEB_APP_BASE_URL = defineString("WEB_APP_BASE_URL");
const TERMII_API_KEY = defineString("TERMII_API_KEY");
const TERMII_SENDER_ID = defineString("TERMII_SENDER_ID");

const defaultAppBranding = {
  name: "1Bee Online",
  logos: {
    primary: "https://1bee.online.com/logo.png",
  },
  socials: {
    website: "https://1bee.online.com",
  },
};

const finalConfig = {
  ENV: undefined as string | undefined,
  STORAGE_BUCKET: undefined as string | undefined,
  RESEND_API_KEY: undefined as string | undefined,
  SERVICE_ACCOUNT: undefined as object | undefined,
  APP_LOGO_URL: undefined as string | undefined,
  DOMAIN: undefined as string | undefined,
  JWT_SECRET: undefined as string | undefined,
  IS_PROD: undefined as boolean | undefined,
  GOOGLE_MAP_API_KEY: undefined as string | undefined,
  ALGOLIA_APP_ID: undefined as string | undefined,
  ALGOLIA_ADMIN_KEY: undefined as string | undefined,
  algoliaSearchClient: undefined as SearchClient | undefined,
  PREMBLY_API_KEY: undefined as string | undefined,
  PAYSTACK_SECRET_KEY: undefined as string | undefined,
  PAYSTACK_PUBLIC_KEY: undefined as string | undefined,
  PAYSTACK_BASE_URL: "https://api.paystack.co" as string,
  WEB_APP_BASE_URL: undefined as string | undefined,
  TERMII_API_KEY: undefined as string | undefined,
  TERMII_SENDER_ID: undefined as string | undefined,
  TERMII_BASE_URL: "https://v3.api.termii.com/api" as string,
  appBranding: defaultAppBranding,
};

onInit(() => {
  finalConfig.ENV = ENV.value();

  const isProd = finalConfig.ENV === "prod";
  finalConfig.IS_PROD = isProd;

  finalConfig.STORAGE_BUCKET = STORAGE_BUCKET.value();
  finalConfig.RESEND_API_KEY = RESEND_API_KEY.value();
  finalConfig.APP_LOGO_URL = APP_LOGO_URL.value();
  finalConfig.appBranding = {
    ...defaultAppBranding,
    logos: {
      ...defaultAppBranding.logos,
      primary: finalConfig.APP_LOGO_URL || defaultAppBranding.logos.primary,
    },
  };
  finalConfig.DOMAIN = DOMAIN.value();
  finalConfig.JWT_SECRET = JWT_SECRET.value();
  finalConfig.GOOGLE_MAP_API_KEY = GOOGLE_MAP_API_KEY.value();
  finalConfig.ALGOLIA_APP_ID = ALGOLIA_APP_ID.value();
  finalConfig.ALGOLIA_ADMIN_KEY = ALGOLIA_ADMIN_KEY.value();
  finalConfig.PREMBLY_API_KEY = PREMBLY_API_KEY.value();
  finalConfig.PAYSTACK_SECRET_KEY = PAYSTACK_SECRET_KEY.value();
  finalConfig.PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY.value();
  finalConfig.WEB_APP_BASE_URL = WEB_APP_BASE_URL.value();
  finalConfig.TERMII_API_KEY = TERMII_API_KEY.value();
  finalConfig.TERMII_SENDER_ID = TERMII_SENDER_ID.value();

  finalConfig.algoliaSearchClient = algoliasearch(
    finalConfig.ALGOLIA_APP_ID!,
    finalConfig.ALGOLIA_ADMIN_KEY!
  );

  finalConfig.SERVICE_ACCOUNT = isProd
    ? service_account_prod
    : service_account_dev;
});

export const finalConfiguration = () => {
  return finalConfig;
};
