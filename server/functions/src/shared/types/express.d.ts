export {};

import { UserRecord } from "firebase-admin/auth";

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        businessId: string;
        domain: string;
      };
      currentUser?: UserRecord;
    }
  }
}
