import type { CountryCode } from "libphonenumber-js";

type PhoneCountryOption = {
  code: CountryCode;
  country: string;
  flag: string;
};

const phoneCountryOptions: PhoneCountryOption[] = [
  { code: "NG", country: "Nigeria", flag: "🇳🇬" },
  { code: "US", country: "United States", flag: "🇺🇸" },
  { code: "GH", country: "Ghana", flag: "🇬🇭" },
  { code: "KE", country: "Kenya", flag: "🇰🇪" },
  { code: "ZA", country: "South Africa", flag: "🇿🇦" },
];

export { phoneCountryOptions, type PhoneCountryOption };
