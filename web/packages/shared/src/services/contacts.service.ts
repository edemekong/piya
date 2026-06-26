import type { BaseAPIServiceOptions } from "../types";
import { dummyContacts } from "../utils/dummy_data";
import { BaseAPIService } from "./base-api.service";

export class ContactsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions = {}) {
    super(options);
  }

  getContacts() {
    return dummyContacts;
  }
}

export const contactsService = new ContactsService();
