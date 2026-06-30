import type { CommunicationData } from "../models";
import type {
  CommunicationAdminData,
  CommunicationChannel,
  CommunicationEventType,
  CommunicationFrequency,
  CommunicationStatus,
} from "../types";

export const CHANNEL_OPTIONS: CommunicationChannel[] = [
  "email",
  "sms",
  "whatsapp",
];

export const TRIGGER_OPTIONS: CommunicationEventType[] = [
  "onboarding",
  "birthday_congrats",
  "anniversary_milestone",
  "badge_upgraded",
  "win_back_inactive",
  "marketing_broadcast",
  "discount_alert",
];

export const SCHEDULED_TRIGGER_TYPES: CommunicationEventType[] = [
  "marketing_broadcast",
  "discount_alert",
  "win_back_inactive",
];

export const FREQUENCY_OPTIONS: CommunicationFrequency[] = [
  "once",
  "daily",
  "weekly",
  "monthly",
];

export const DEFAULT_TAG_OPTIONS = [
  "new lead",
  "first order",
  "vip",
  "high value",
  "at risk",
  "email only",
  "inactive",
];

export const DEFAULT_BADGE_OPTIONS = [
  "new",
  "bronze",
  "silver",
  "gold",
  "platinum",
];

export const COMMUNICATION_VARIABLES = [
  "{{contact.firstName}}",
  "{{contact.name}}",
  "{{contact.email}}",
  "{{contact.phoneNumber}}",
  "{{contact.code}}",
  "{{contact.badgeType}}",
  "{{contact.points}}",
  "{{contact.totalOrders}}",
  "{{contact.lifetimeValue}}",
  "{{business.name}}",
  "{{business.email}}",
  "{{business.phoneNumber}}",
  "{{business.portalUrl}}",
  "{{communication.title}}",
  "{{communication.code}}",
  "{{communication.rewardType}}",
  "{{communication.rewardValue}}",
  "{{booking.serviceName}}",
  "{{booking.startAt}}",
  "{{booking.endAt}}",
  "{{offering.name}}",
  "{{offering.type}}",
  "{{offering.price}}",
  "{{offering.currency}}",
  "{{offering.duration}}",
  "{{offering.inventoryQuantity}}",
  "{{app.name}}",
];

export function formatDelay(minutes: number) {
  if (minutes <= 0) return "Send immediately";
  if (minutes <= 60) return `Delay ${minutes} ${minutes === 1 ? "min" : "mins"}`;

  const hours = minutes / 60;
  if (hours <= 24) {
    const formattedHours = Number.isInteger(hours) ? hours : Number(hours.toFixed(1));
    return `Delay ${formattedHours} ${formattedHours === 1 ? "hour" : "hours"}`;
  }

  const days = hours / 24;
  const formattedDays = Number.isInteger(days) ? days : Number(days.toFixed(1));
  return `Delay ${formattedDays} ${formattedDays === 1 ? "day" : "days"}`;
}

export function communicationStatusClassName(status: CommunicationStatus) {
  if (status === "active") {
    return "border-success/20 bg-success/10 text-success";
  }

  if (status === "paused") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-border bg-fill text-[#2F4B4F]/65";
}

export const statusClassName = communicationStatusClassName;

export function getPrimaryStep(
  communication: CommunicationAdminData | CommunicationData,
) {
  return communication.steps[communication.stepsOrder[0]];
}

export function getCommunicationChannels(communication: CommunicationAdminData) {
  return communication.stepsOrder.map((stepId) => communication.steps[stepId].channel);
}
