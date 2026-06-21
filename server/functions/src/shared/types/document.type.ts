type IDType =
  | "national_identity_number"
  | "driver_license"
  | "passport"
  | "vehicle_registration"
  | "corporate_affairs_commission"
  | "proof_of_address";
type DocumentStatusType = "processing" | "verified" | "failed";
export { IDType, DocumentStatusType };
