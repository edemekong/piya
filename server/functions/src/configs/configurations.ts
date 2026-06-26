import { defineString } from "firebase-functions/params";
import { onInit } from "firebase-functions/v2/core";

import SERVICE_ACCOUNT = require("../../getpiyaapp-adminsdk.json");

const STORAGE_BUCKET = defineString("STORAGE_BUCKET");
const RESEND_API_KEY = defineString("RESEND_API_KEY");
const APP_LOGO_URL = defineString("APP_LOGO_URL");
const DOMAIN = defineString("DOMAIN");
const JWT_SECRET = defineString("JWT_SECRET");
const GOOGLE_MAP_API_KEY = defineString("GOOGLE_MAP_API_KEY");
const PREMBLY_API_KEY = defineString("PREMBLY_API_KEY");
const PAYSTACK_SECRET_KEY = defineString("PAYSTACK_SECRET_KEY");
const PAYSTACK_PUBLIC_KEY = defineString("PAYSTACK_PUBLIC_KEY");
const PORTAL_URL = defineString("PORTAL_URL");
const DASHBOARD_URL = defineString("DASHBOARD_URL");

const defaultAppBranding = {
  name: "Piya",
  description:
    "Piya helps growing businesses manage customers, orders, offerings, and campaigns from one connected workspace.",
  logos: {
    primary: "https://piya.store/logo.png",
    textDark: "https://piya.store/assets/logo-text-dark.png",
  },
  socials: {
    website: "https://piya.store",
    instagram: "https://instagram.com/piya",
    x: "https://x.com/piya",
    facebook: "https://facebook.com/piya",
    linkedin: "https://linkedin.com/company/piya",
  },
};

const finalConfig = {
  STORAGE_BUCKET: undefined as string | undefined,
  RESEND_API_KEY: undefined as string | undefined,
  SERVICE_ACCOUNT: undefined as object | undefined,
  APP_LOGO_URL: undefined as string | undefined,
  DOMAIN: undefined as string | undefined,
  JWT_SECRET: undefined as string | undefined,
  GOOGLE_MAP_API_KEY: undefined as string | undefined,
  PREMBLY_API_KEY: undefined as string | undefined,
  PAYSTACK_SECRET_KEY: undefined as string | undefined,
  PAYSTACK_PUBLIC_KEY: undefined as string | undefined,
  PAYSTACK_BASE_URL: "https://api.paystack.co" as string,
  PORTAL_URL: undefined as string | undefined,
  DASHBOARD_URL: undefined as string | undefined,
  appBranding: defaultAppBranding,
};

onInit(() => {
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
  finalConfig.PREMBLY_API_KEY = PREMBLY_API_KEY.value();
  finalConfig.PAYSTACK_SECRET_KEY = PAYSTACK_SECRET_KEY.value();
  finalConfig.PAYSTACK_PUBLIC_KEY = PAYSTACK_PUBLIC_KEY.value();
  finalConfig.PORTAL_URL = PORTAL_URL.value();
  finalConfig.DASHBOARD_URL = DASHBOARD_URL.value();

  finalConfig.SERVICE_ACCOUNT = SERVICE_ACCOUNT;
});

export const finalConfiguration = () => {
  return finalConfig;
};
