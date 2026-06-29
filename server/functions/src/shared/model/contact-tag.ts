type ContactTagReferenceType = "contact";

interface ContactTagData {
  id: string;
  name: string;
  referenceType: ContactTagReferenceType;
  createdAt: number;
}

export { ContactTagData, ContactTagReferenceType };
