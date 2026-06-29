import type {
  BaseAPIServiceOptions,
  BulkCreateContactsInput,
  BulkCreateContactsPayload,
  ContactListQuery,
  ContactPayload,
  ContactTagsPayload,
  ContactsPayload,
  CreateContactInput,
  UpdateContactInput,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class ContactsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getContacts(input: ContactListQuery = {}) {
    return this.get<ContactsPayload>(this.urlController.contacts, {
      queryParameters: input,
      withToken: true,
    });
  }

  async getContactTags() {
    const data = await this.get<ContactTagsPayload>(
      this.urlController.contactTags,
      {
        withToken: true,
      }
    );

    return data.tags;
  }

  async createContact(input: CreateContactInput) {
    const data = await this.post<ContactPayload, CreateContactInput>(
      this.urlController.contacts,
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      }
    );

    return data.contact;
  }

  async updateContact(contactId: string, input: UpdateContactInput) {
    const data = await this.patch<ContactPayload, UpdateContactInput>(
      this.urlController.contact(contactId),
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      }
    );

    return data.contact;
  }

  bulkCreateContacts(input: BulkCreateContactsInput) {
    return this.post<BulkCreateContactsPayload, BulkCreateContactsInput>(
      this.urlController.bulkContacts,
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      }
    );
  }
}

export const contactsService = new ContactsService();
