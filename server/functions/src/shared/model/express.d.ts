export {};

import { UserRecord } from "firebase-admin/auth";

declare global {
  namespace Express {
    interface Request {
      tenant?: { businessId: string; hostname: string };
      currentUser?: UserRecord;
    }
  }
}
