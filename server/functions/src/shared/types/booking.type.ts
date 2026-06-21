type BookingStatusType =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show";
type BookingParticipantType = "contact" | "team_member" | "guest";
type BookingParticipantRoleType = "host" | "attendee";
type BookingParticipantStatusType =
  | "pending"
  | "accepted"
  | "declined"
  | "cancelled";
export {
  BookingStatusType,
  BookingParticipantType,
  BookingParticipantRoleType,
  BookingParticipantStatusType,
};
