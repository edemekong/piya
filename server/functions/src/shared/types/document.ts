const IDType = {
  nin: "national_identity_number",
  driver_license: "driver_license",
  passport: "passport",
  vehicle: "vehicle_registration",
  cac: "corporate_affairs_commission",
  address: "proof_of_address",
} as const;

type IDType = (typeof IDType)[keyof typeof IDType];

type DocumentStatusType = "processing" | "verified" | "failed";

interface UserDocumentData {
  id: string;
  type: IDType;
  createdBy: string;
  userId?: string;
  metaData?: {
    [key: string]: any;
  };
  documentData:
    | NationalIDData
    | DriverLicenseData
    | PassportData
    | VehicleRegistrationData
    | ProofOfAddressData;
  status: DocumentStatusType;
  verificationData: {
    [key: string]: any;
  };
  verifiedAt?: number;
  createdAt: number;
  updatedAt: number;
}

interface NationalIDData {
  fullName: string;
  dateOfBirth: string;
  number: string;
  nationality: string;
  frontImageUrl: string;
  backImageUrl?: string | null;
}

interface DriverLicenseData {
  fullName: string;
  dateOfBirth: string;
  number: string;
  expiryDate: string;
  nationality: string;
  frontImageUrl: string;
  backImageUrl?: string | null;
}

interface PassportData {
  fullName: string;
  dateOfBirth: string;
  number: string;
  nationality: string;
  expiryDate: string;
  frontImageUrl: string;
  backImageUrl?: string | null;
}

interface VehicleRegistrationData {
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  plateNumber: string;
  registrationNumber: string;
  ownerName: string;
  registrationDocument: string | null;
}

interface ProofOfAddressData {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  municipality: string;
  state: string;
  postalCode: string;
  country: string;
  nationality: string;
  billUrl: string | null;
}

export {
  UserDocumentData,
  IDType,
  NationalIDData,
  DriverLicenseData,
  PassportData,
  VehicleRegistrationData,
  ProofOfAddressData,
};
