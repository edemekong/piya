import {
  AsYouType,
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { phoneCountryOptions } from "./phone-country-options";

function getDefaultPhoneCountry() {
  return phoneCountryOptions[0];
}

function getPhoneCountryByCode(code: CountryCode) {
  return (
    phoneCountryOptions.find((option) => option.code === code) ??
    getDefaultPhoneCountry()
  );
}

function getPhoneCountryFromNumber(value: string | null | undefined) {
  if (!value) return getDefaultPhoneCountry();

  const parsedPhoneNumber = parsePhoneNumberFromString(value);
  if (parsedPhoneNumber?.country) {
    return getPhoneCountryByCode(parsedPhoneNumber.country);
  }

  return getDefaultPhoneCountry();
}

function getPhoneLocalNumber(
  value: string | null | undefined,
  country = getPhoneCountryFromNumber(value),
) {
  if (!value) return "";

  const parsedPhoneNumber = parsePhoneNumberFromString(value, country.code);
  if (parsedPhoneNumber?.country === country.code) {
    return parsedPhoneNumber.nationalNumber;
  }

  return value.replace(/\D/g, "");
}

function formatPhoneLocalNumber(
  value: string | null | undefined,
  country = getDefaultPhoneCountry(),
) {
  const localNumber = getPhoneLocalNumber(value, country);
  return localNumber ? new AsYouType(country.code).input(localNumber) : "";
}

function getPhoneCallingCode(countryCode: CountryCode) {
  return `+${getCountryCallingCode(countryCode)}`;
}

function normalizeSupportedPhoneNumber(
  countryCode: CountryCode,
  localNumber: string,
) {
  const localDigits = localNumber.replace(/\D/g, "").replace(/^0+/, "");
  if (!localDigits) return "";

  const callingCode = getPhoneCallingCode(countryCode);
  const parsedPhoneNumber = parsePhoneNumberFromString(
    `${callingCode}${localDigits}`,
    countryCode,
  );

  return parsedPhoneNumber?.number ?? `${callingCode}${localDigits}`;
}

function decodeSupportedPhoneNumber(value: string) {
  const parsedPhoneNumber = parsePhoneNumberFromString(value);
  const country = parsedPhoneNumber?.country
    ? getPhoneCountryByCode(parsedPhoneNumber.country)
    : getDefaultPhoneCountry();

  return {
    country,
    localNumber: parsedPhoneNumber?.nationalNumber ?? value.replace(/\D/g, ""),
  };
}

function isValidSupportedPhoneNumber(value: string | null | undefined) {
  if (!value) return false;

  const parsedPhoneNumber = parsePhoneNumberFromString(value);
  return Boolean(
    parsedPhoneNumber?.country &&
      phoneCountryOptions.some(
        (option) => option.code === parsedPhoneNumber.country,
      ) &&
      parsedPhoneNumber.isValid(),
  );
}

export {
  decodeSupportedPhoneNumber,
  formatPhoneLocalNumber,
  getDefaultPhoneCountry,
  getPhoneCallingCode,
  getPhoneCountryByCode,
  getPhoneCountryFromNumber,
  getPhoneLocalNumber,
  isValidSupportedPhoneNumber,
  normalizeSupportedPhoneNumber,
};
