type CommunicationEventType =
  | "onboarding"
  | "birthday_congrats"
  | "anniversary_milestone"
  | "badge_upgraded"
  | "win_back_inactive"
  | "marketing_broadcast"
  | "discount_alert";
type CommunicationFrequency = "once" | "daily" | "weekly" | "monthly" | "cron";
export { CommunicationEventType, CommunicationFrequency };
