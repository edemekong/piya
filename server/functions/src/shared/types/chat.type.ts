type ChatProfileRoleType = "owner" | "manager" | "contact";
type ChatChannelType = "whatsapp" | "email" | "sms" | "native_app";
type MessageDirectionType = "inbound" | "outbound";
type MessageDeliveryStatusType =
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "opened"
  | "clicked"
  | "failed";
export {
  ChatProfileRoleType,
  ChatChannelType,
  MessageDirectionType,
  MessageDeliveryStatusType,
};
