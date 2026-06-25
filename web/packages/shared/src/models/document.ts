export type IDType =
  | "national_identity_number"
  | "driver_license"
  | "passport"
  | "vehicle_registration"
  | "corporate_affairs_commission"
  | "proof_of_address";

export type DocumentStatusType = "processing" | "verified" | "failed";

export type NationalIDData = {
  fullName: string;
  dateOfBirth: string;
  number: string;
  nationality: string;
  frontImageUrl: string;
  backImageUrl?: string | null;
};

export type DriverLicenseData = {
  fullName: string;
  dateOfBirth: string;
  number: string;
  expiryDate: string;
  nationality: string;
  frontImageUrl: string;
  backImageUrl?: string | null;
};

export type PassportData = {
  fullName: string;
  dateOfBirth: string;
  number: string;
  nationality: string;
  expiryDate: string;
  frontImageUrl: string;
  backImageUrl?: string | null;
};

export type VehicleRegistrationData = {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  plateNumber: string;
  registrationNumber: string;
  ownerName: string;
  registrationDocument: string | null;
};

export type ProofOfAddressData = {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  municipality: string;
  state: string;
  postalCode: string;
  country: string;
  nationality: string;
  billUrl: string | null;
};

export type UserDocumentData = {
  id: string;
  type: IDType;
  createdBy: string;
  userId?: string;
  metaData?: Record<string, unknown>;
  documentData:
    | NationalIDData
    | DriverLicenseData
    | PassportData
    | VehicleRegistrationData
    | ProofOfAddressData;
  status: DocumentStatusType;
  verificationData: Record<string, unknown>;
  verifiedAt?: number;
  createdAt: number;
  updatedAt: number;
};
