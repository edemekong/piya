const MANUAL_CONTACT_FORM_ID = "manual-contact-form";
const MAX_CONTACT_TAGS = 5;
const DEFAULT_CONTACT_TAGS = [
  "VIP",
  "New lead",
  "High value",
  "Email only",
] as const;
const CONTACT_GENDER_OPTIONS = [
  { label: "Select gender", value: "" },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
] as const;

export {
  CONTACT_GENDER_OPTIONS,
  DEFAULT_CONTACT_TAGS,
  MANUAL_CONTACT_FORM_ID,
  MAX_CONTACT_TAGS,
};
