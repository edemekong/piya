import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { phoneCountryOptions } from "./phone-country-options";
import {
  decodeSupportedPhoneNumber,
  formatPhoneLocalNumber,
  getPhoneCallingCode,
  getPhoneCountryByCode,
  getPhoneCountryFromNumber,
  isValidSupportedPhoneNumber,
  normalizeSupportedPhoneNumber,
} from "./phone-utils";

type PhoneNumberFieldProps = {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  value: string;
};

function PhoneNumberField({
  label,
  onChange,
  placeholder,
  required,
  value,
}: PhoneNumberFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(
    getPhoneCountryFromNumber(value),
  );
  const [displayLocalNumber, setDisplayLocalNumber] = useState(
    formatPhoneLocalNumber(value, selectedCountry),
  );
  const hasValue = value.trim().length > 0;
  const showRequiredError = required && isTouched && !hasValue;
  const showInvalidError =
    isTouched && hasValue && !isValidSupportedPhoneNumber(value);
  const errorText = showRequiredError
    ? "Enter phone number."
    : showInvalidError
      ? "Enter a valid phone number."
      : "";

  useEffect(() => {
    if (value) {
      setSelectedCountry(getPhoneCountryFromNumber(value));
    }

    if (isFocused) return;
    setDisplayLocalNumber(formatPhoneLocalNumber(value, selectedCountry));
  }, [isFocused, selectedCountry, value]);

  function selectCountry(countryCode: typeof selectedCountry.code) {
    setSelectedCountry(getPhoneCountryByCode(countryCode));
    onChange(normalizeSupportedPhoneNumber(countryCode, displayLocalNumber));
    setIsOpen(false);
  }

  function updatePhoneNumber(nextValue: string) {
    setDisplayLocalNumber(formatPhoneLocalNumber(nextValue, selectedCountry));

    if (nextValue.startsWith("+")) {
      const decoded = decodeSupportedPhoneNumber(nextValue);
      setSelectedCountry(decoded.country);
      setDisplayLocalNumber(
        formatPhoneLocalNumber(decoded.localNumber, decoded.country),
      );
      onChange(
        normalizeSupportedPhoneNumber(
          decoded.country.code,
          decoded.localNumber,
        ),
      );
      return;
    }

    onChange(normalizeSupportedPhoneNumber(selectedCountry.code, nextValue));
  }

  return (
    <label className="grid gap-2">
      <span className="text-footnote font-normal text-[#2F4B4F]">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </span>
      <span
        className={cn(
          "flex h-12 overflow-visible rounded-sm border border-border bg-fill transition focus-within:border-primary focus-within:bg-white",
          errorText && "border-error focus-within:border-error",
        )}
      >
        <span className="relative flex shrink-0">
          <button
            className="inline-flex h-full items-center gap-2 border-r border-border px-3 text-callout font-semibold text-[#2F4B4F] transition hover:bg-secondary/30"
            onClick={() => setIsOpen((current) => !current)}
            type="button"
          >
            <span>{selectedCountry.flag}</span>
            <span>{getPhoneCallingCode(selectedCountry.code)}</span>
            <ChevronDown
              className={cn(
                "size-4 text-[#2F4B4F]/65 transition",
                isOpen && "rotate-180",
              )}
            />
          </button>

          {isOpen ? (
            <div className="absolute left-0 top-full z-30 mt-2 w-56 rounded-md border border-border bg-white py-2 text-callout text-[#2F4B4F] shadow-lg">
              {phoneCountryOptions.map((option) => {
                const isSelected = option.code === selectedCountry.code;

                return (
                  <button
                    className={cn(
                      "flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left transition last:border-b-0 hover:bg-fill",
                      isSelected && "bg-secondary/30 text-primary",
                    )}
                    key={option.code}
                    onClick={() => selectCountry(option.code)}
                    type="button"
                  >
                    <span className="inline-flex items-center gap-3">
                      <span>{option.flag}</span>
                      <span>{option.country}</span>
                    </span>
                    <span className="font-semibold">
                      {getPhoneCallingCode(option.code)}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}
        </span>
        <input
          autoComplete="tel"
          className="min-w-0 flex-1 bg-transparent px-3 text-callout text-[#2F4B4F] outline-none placeholder:text-[#2F4B4F]/40"
          inputMode="tel"
          onBlur={() => {
            setIsFocused(false);
            setIsTouched(true);
          }}
          onChange={(event) => updatePhoneNumber(event.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          required={required}
          type="tel"
          value={displayLocalNumber}
        />
      </span>
      {errorText ? (
        <span className="text-footnote leading-relaxed text-error">
          {errorText}
        </span>
      ) : null}
    </label>
  );
}

export { PhoneNumberField, type PhoneNumberFieldProps };
