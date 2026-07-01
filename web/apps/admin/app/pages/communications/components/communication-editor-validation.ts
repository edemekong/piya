import type {
  CommunicationAdminData,
  CommunicationAdminStep,
} from "@piya/shared/types";
import { FREQUENCY_OPTIONS, SCHEDULED_TRIGGER_TYPES } from "@piya/shared/utils";

export type CommunicationStepErrors = {
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  delay?: string;
  subject?: string;
};

export function getCommunicationStepErrors(
  step: CommunicationAdminStep,
): CommunicationStepErrors {
  const errors: CommunicationStepErrors = {};
  const subject = step.message.subject?.trim() ?? "";
  const body = step.message.body.trim();
  const ctaLabel = step.ctas[0]?.label.trim() ?? "";
  const ctaUrl = step.ctas[0]?.url.trim() ?? "";
  const hasCta = Boolean(ctaLabel || ctaUrl);

  if (!Number.isInteger(step.delay) || step.delay < 0) {
    errors.delay = "Enter a whole number of zero or more minutes.";
  }

  if (step.channel === "email" && !subject) {
    errors.subject = "Email subject is required.";
  } else if (subject.length > 200) {
    errors.subject = "Email subject must be 200 characters or fewer.";
  }

  if (!body) {
    errors.body = "Message is required.";
  } else if (body.length > 5000) {
    errors.body = "Message must be 5,000 characters or fewer.";
  }

  if (hasCta && !ctaLabel) {
    errors.ctaLabel = "Button label is required when a CTA is added.";
  } else if (ctaLabel.length > 80) {
    errors.ctaLabel = "Button label must be 80 characters or fewer.";
  }

  if (hasCta && !ctaUrl) {
    errors.ctaUrl = "Button URL is required when a CTA is added.";
  } else if (ctaUrl.length > 2048) {
    errors.ctaUrl = "Button URL must be 2,048 characters or fewer.";
  } else if (ctaUrl && !isValidHttpUrl(ctaUrl)) {
    errors.ctaUrl = "Enter a valid HTTP or HTTPS URL.";
  }

  return errors;
}

export function isCommunicationStepValid(step: CommunicationAdminStep) {
  return Object.keys(getCommunicationStepErrors(step)).length === 0;
}

export function isCommunicationSetupValid(
  communication: CommunicationAdminData,
) {
  const name = communication.name.trim();
  if (!name || name.length > 100) return false;

  if (!SCHEDULED_TRIGGER_TYPES.includes(communication.trigger.type)) {
    return true;
  }

  const schedule = communication.trigger.schedule;
  if (!schedule || !FREQUENCY_OPTIONS.includes(schedule.frequency)) {
    return false;
  }

  if (
    !Number.isInteger(schedule.hour) ||
    schedule.hour < 0 ||
    schedule.hour > 23 ||
    !Number.isInteger(schedule.minute) ||
    schedule.minute < 0 ||
    schedule.minute > 59 ||
    !Number.isFinite(schedule.startDate) ||
    schedule.startDate <= 0
  ) {
    return false;
  }

  return (
    schedule.frequency !== "weekly" ||
    (Number.isInteger(schedule.dayOfWeek) &&
      schedule.dayOfWeek >= 0 &&
      schedule.dayOfWeek <= 6)
  );
}

function isValidHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
