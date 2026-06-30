import {
  FieldPath,
  type DocumentData,
  type Query,
  type QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { db } from "../../configs/firebase";
import type { ContactTagData } from "../model/contact-tag";
import type { ContactData } from "../model/contact";
import type {
  BulkCreateContactsBody,
  CreateContactBody,
  GetContactsQuery,
  UpdateContactBody,
} from "../schema/contact.schema";
import { ApiError } from "../utils/api-response";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { API_RESPONSE } from "../utils/constants";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

const CONTACT_SCAN_BATCH_SIZE = 100;

type ContactCursor = {
  createdAt: number;
  id: string;
};

type ContactPage = {
  contacts: ContactData[];
  nextCursor: string | null;
  hasNextPage: boolean;
};

type CreateContactResult =
  | { status: "created"; contact: ContactData }
  | { status: "duplicate" };

type BulkCreateContactResult = {
  contactId?: string;
  index: number;
  message?: string;
  status: "created" | "duplicate" | "failed";
};

type BulkCreateContactsResult = {
  created: ContactData[];
  createdCount: number;
  duplicateCount: number;
  failedCount: number;
  results: BulkCreateContactResult[];
  total: number;
};

export class ContactService {
  static async getContacts(
    businessId: string,
    input: GetContactsQuery
  ): Promise<ContactPage> {
    const searchToken = input.query
      ? this.getContactSearchToken(input.query)
      : null;
    let baseQuery: Query<DocumentData> = this.contactsCollection(businessId)
      .orderBy("createdAt", "desc")
      .orderBy(FieldPath.documentId(), "desc");

    if (searchToken) {
      baseQuery = baseQuery.where(
        "searchTokens",
        "array-contains",
        searchToken
      );
    }

    let scanCursor = input.cursor
      ? this.decodeContactCursor(input.cursor)
      : null;
    const matchedContacts: ContactData[] = [];

    while (matchedContacts.length <= input.limit) {
      let batchQuery = baseQuery;
      if (scanCursor) {
        batchQuery = batchQuery.startAfter(scanCursor.createdAt, scanCursor.id);
      }

      const snapshot = await batchQuery.limit(CONTACT_SCAN_BATCH_SIZE).get();
      if (snapshot.empty) break;

      for (const document of snapshot.docs) {
        const contact = document.data() as ContactData;
        if (this.matchesContactFilters(contact, input)) {
          matchedContacts.push(contact);
          if (matchedContacts.length > input.limit) break;
        }
      }

      if (matchedContacts.length > input.limit) break;
      const lastDocument = snapshot.docs[snapshot.docs.length - 1];
      if (!lastDocument || snapshot.size < CONTACT_SCAN_BATCH_SIZE) break;
      scanCursor = this.getDocumentCursor(lastDocument);
    }

    const contacts = matchedContacts.slice(0, input.limit);
    const hasNextPage = matchedContacts.length > input.limit;
    const lastContact = contacts[contacts.length - 1];

    return {
      contacts,
      hasNextPage,
      nextCursor:
        hasNextPage && lastContact
          ? this.encodeContactCursor({
              createdAt: lastContact.createdAt,
              id: lastContact.id,
            })
          : null,
    };
  }

  static async getContactTags(businessId: string): Promise<ContactTagData[]> {
    const snapshot = await this.tagsCollection(businessId)
      .orderBy("name", "asc")
      .get();

    return snapshot.docs
      .map((document) => document.data() as ContactTagData)
      .filter((tag) => tag.referenceType === "contact");
  }

  static async createContact(params: {
    businessId: string;
    createdBy: string;
    input: CreateContactBody;
  }): Promise<CreateContactResult> {
    const { businessId, createdBy, input } = params;
    if (await this.getDuplicateContact(businessId, input)) {
      return { status: "duplicate" };
    }

    const contactRef = this.contactsCollection(businessId).doc();
    const now = getUTCTimeNow();
    const { contact, contactTags } = this.createContactRecord({
      businessId,
      contactId: contactRef.id,
      createdBy,
      input,
      now,
    });

    await db().runTransaction(async (transaction) => {
      const tagReferences = contactTags.map((tag) =>
        this.tagsCollection(businessId).doc(tag.id)
      );
      const tagSnapshots = await Promise.all(
        tagReferences.map((reference) => transaction.get(reference))
      );

      tagSnapshots.forEach((snapshot, index) => {
        if (snapshot.exists) return;

        const tag = contactTags[index];
        transaction.create(snapshot.ref, {
          id: tag.id,
          name: tag.name,
          referenceType: "contact",
          createdAt: now,
        } satisfies ContactTagData);
      });
      transaction.create(contactRef, contact);
    });

    return { status: "created", contact };
  }

  static async bulkCreateContacts(params: {
    businessId: string;
    createdBy: string;
    input: BulkCreateContactsBody;
  }): Promise<BulkCreateContactsResult> {
    const { businessId, createdBy, input } = params;
    const contactsCollection = this.contactsCollection(businessId);
    const existingEmails = await this.getExistingContactValues(
      businessId,
      "email",
      input.contacts.map((contact) => contact.email).filter(Boolean)
    );
    const existingPhoneNumbers = await this.getExistingContactValues(
      businessId,
      "phoneNumber",
      input.contacts.map((contact) => contact.phoneNumber).filter(Boolean)
    );
    const seenEmails = new Set<string>();
    const seenPhoneNumbers = new Set<string>();
    const tagEntriesById = new Map<string, { id: string; name: string }>();
    const contactsToCreate: ContactData[] = [];
    const results: BulkCreateContactResult[] = [];
    const now = getUTCTimeNow();

    input.contacts.forEach((contactInput, index) => {
      const email = contactInput.email ?? "";
      const phoneNumber = contactInput.phoneNumber ?? "";
      const isDuplicate =
        (email && (existingEmails.has(email) || seenEmails.has(email))) ||
        (phoneNumber &&
          (existingPhoneNumbers.has(phoneNumber) ||
            seenPhoneNumbers.has(phoneNumber)));

      if (isDuplicate) {
        results.push({
          index,
          message: "A contact with this email or phone number already exists",
          status: "duplicate",
        });
        return;
      }

      if (email) seenEmails.add(email);
      if (phoneNumber) seenPhoneNumbers.add(phoneNumber);

      const contactRef = contactsCollection.doc();
      const { contact, contactTags } = this.createContactRecord({
        businessId,
        contactId: contactRef.id,
        createdBy,
        input: contactInput,
        now,
      });

      contactTags.forEach((tag) => tagEntriesById.set(tag.id, tag));
      contactsToCreate.push(contact);
      results.push({
        contactId: contact.id,
        index,
        status: "created",
      });
    });

    await this.createMissingContactTags(
      businessId,
      Array.from(tagEntriesById.values()),
      now
    );
    await this.createContactsInBatches(businessId, contactsToCreate);

    return {
      created: contactsToCreate,
      createdCount: contactsToCreate.length,
      duplicateCount: results.filter((result) => result.status === "duplicate")
        .length,
      failedCount: results.filter((result) => result.status === "failed")
        .length,
      results,
      total: input.contacts.length,
    };
  }

  static async updateContact(params: {
    businessId: string;
    contactId: string;
    input: UpdateContactBody;
  }) {
    const { businessId, contactId, input } = params;
    const contactRef = this.contactsCollection(businessId).doc(contactId);
    const snapshot = await contactRef.get();
    if (!snapshot.exists) return null;

    const currentContact = snapshot.data() as ContactData;
    const hasEmailUpdate = Object.prototype.hasOwnProperty.call(input, "email");
    const hasPhoneUpdate = Object.prototype.hasOwnProperty.call(
      input,
      "phoneNumber"
    );
    const hasNameUpdate = Object.prototype.hasOwnProperty.call(input, "name");
    const hasDobUpdate = Object.prototype.hasOwnProperty.call(input, "dob");
    const hasAnniversaryUpdate = Object.prototype.hasOwnProperty.call(
      input,
      "anniversary"
    );
    const hasCountryCodeUpdate = Object.prototype.hasOwnProperty.call(
      input,
      "countryCode"
    );
    const hasAddressUpdate = Object.prototype.hasOwnProperty.call(input, "address");
    const hasTagsUpdate = Object.prototype.hasOwnProperty.call(input, "tags");
    const nextEmail =
      hasEmailUpdate ? input.email ?? null : currentContact.email ?? null;
    const nextPhoneNumber =
      hasPhoneUpdate
        ? input.phoneNumber ?? null
        : currentContact.phoneNumber ?? null;

    if (
      ((hasEmailUpdate && nextEmail && nextEmail !== currentContact.email) ||
        (hasPhoneUpdate &&
          nextPhoneNumber &&
          nextPhoneNumber !== currentContact.phoneNumber)) &&
      (await this.getDuplicateContact(
        businessId,
        {
          email: hasEmailUpdate ? nextEmail : null,
          phoneNumber: hasPhoneUpdate ? nextPhoneNumber : null,
        },
        contactId
      ))
    ) {
      return "duplicate" as const;
    }

    const now = getUTCTimeNow();
    const nextName = hasNameUpdate ? input.name ?? currentContact.name : currentContact.name;
    const nextDob = hasDobUpdate ? input.dob ?? null : currentContact.dob ?? null;
    const nextAnniversary = hasAnniversaryUpdate
      ? input.anniversary ?? null
      : currentContact.anniversary ?? null;
    const parsedPhoneNumber = nextPhoneNumber
      ? parsePhoneNumberFromString(nextPhoneNumber)
      : null;
    const nextCountryCode = hasCountryCodeUpdate
      ? input.countryCode ?? null
      : parsedPhoneNumber?.country ?? currentContact.countryCode ?? null;

    const updatePayload: Partial<ContactData> = {
      updatedAt: now,
    };

    if (hasNameUpdate) updatePayload.name = nextName;
    if (hasEmailUpdate) updatePayload.email = nextEmail;
    if (hasPhoneUpdate) updatePayload.phoneNumber = nextPhoneNumber;
    if (hasCountryCodeUpdate || hasPhoneUpdate) {
      updatePayload.countryCode = nextCountryCode;
    }
    if (hasDobUpdate) {
      updatePayload.dob = nextDob;
      updatePayload.bmd = nextDob?.slice(5) ?? null;
    }
    if (hasAnniversaryUpdate) {
      updatePayload.anniversary = nextAnniversary;
    }
    if (hasAddressUpdate) {
      updatePayload.address = input.address ?? null;
    }
    if (hasEmailUpdate || hasPhoneUpdate) {
      updatePayload.preference = {
        ...currentContact.preference,
        emailEnabled: Boolean(nextEmail),
        smsEnabled: Boolean(nextPhoneNumber),
        whatsappEnabled: Boolean(nextPhoneNumber),
      };
    }
    if (hasTagsUpdate) {
      const contactTags = this.getContactTagEntries(input.tags ?? []);
      await this.createMissingContactTags(businessId, contactTags, now);
      updatePayload.tags = contactTags.map((tag) => tag.id);
    }
    if (hasNameUpdate || hasEmailUpdate || hasPhoneUpdate) {
      updatePayload.searchTokens = this.getContactSearchTokens({
        code: currentContact.code,
        email: nextEmail,
        name: nextName,
        phoneNumber: nextPhoneNumber,
      });
    }

    await contactRef.update(updatePayload);
    const contact = { ...currentContact, ...updatePayload };
    return contact;
  }

  private static matchesContactFilters(
    contact: ContactData,
    input: GetContactsQuery
  ) {
    if (input.status && contact.status !== input.status) return false;
    if (
      input.bmdFrom &&
      input.bmdTo &&
      (!contact.bmd ||
        !this.isBirthdayWithinRange(contact.bmd, input.bmdFrom, input.bmdTo))
    ) {
      return false;
    }
    if (input.tagId && !contact.tags.includes(input.tagId)) return false;
    return true;
  }

  private static isBirthdayWithinRange(
    birthday: string,
    rangeStart: string,
    rangeEnd: string
  ) {
    if (rangeStart <= rangeEnd) {
      return birthday >= rangeStart && birthday <= rangeEnd;
    }

    return birthday >= rangeStart || birthday <= rangeEnd;
  }

  private static getContactSearchToken(query: string) {
    const normalizedQuery = this.normalizeSearchValue(query);
    const isPhoneQuery = /^[+\d\s()-]+$/.test(query);

    return isPhoneQuery ? query.replace(/\D/g, "") : normalizedQuery;
  }

  private static getContactSearchTokens(input: {
    code: string;
    email?: string | null;
    name: string;
    phoneNumber?: string | null;
  }) {
    const tokens = new Set<string>();
    const normalizedName = this.normalizeSearchValue(input.name);

    this.addPrefixes(tokens, normalizedName);
    normalizedName
      .split(" ")
      .filter(Boolean)
      .forEach((word) => this.addPrefixes(tokens, word));

    tokens.add(this.normalizeSearchValue(input.code));
    if (input.email) tokens.add(this.normalizeSearchValue(input.email));
    if (input.phoneNumber) {
      tokens.add(this.normalizeSearchValue(input.phoneNumber));
      tokens.add(input.phoneNumber.replace(/\D/g, ""));
    }

    return Array.from(tokens).filter(Boolean);
  }

  private static addPrefixes(tokens: Set<string>, value: string) {
    for (let index = 1; index <= value.length; index += 1) {
      tokens.add(value.slice(0, index));
    }
  }

  private static normalizeSearchValue(value: string) {
    return value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
  }

  private static getContactTagEntries(tags: string[]) {
    const tagsById = new Map<string, { id: string; name: string }>();

    tags.forEach((tagName) => {
      const name = tagName.trim().replace(/\s+/g, " ");
      const id = name
        .toLocaleLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      if (id) tagsById.set(id, { id, name });
    });

    return Array.from(tagsById.values());
  }

  private static createContactRecord(params: {
    businessId: string;
    contactId: string;
    createdBy: string;
    input: CreateContactBody;
    now: number;
  }) {
    const { businessId, contactId, createdBy, input, now } = params;
    const parsedPhoneNumber = input.phoneNumber
      ? parsePhoneNumberFromString(input.phoneNumber)
      : null;
    const contactTags = this.getContactTagEntries(input.tags);
    const contact: ContactData = {
      id: contactId,
      userId: null,
      code: contactId,
      createdBy,
      businessId,
      name: input.name,
      profileImageUrl: null,
      email: input.email,
      phoneNumber: input.phoneNumber,
      countryCode: parsedPhoneNumber?.country ?? null,
      address: input.address ?? null,
      badge: {
        badgeId: "new",
        points: 0,
        updatedAt: now,
      },
      dob: input.dob ?? null,
      bmd: input.dob?.slice(5) ?? null,
      gender: input.gender ?? null,
      preference: {
        unsubscribedEmailTypes: [],
        smsEnabled: Boolean(input.phoneNumber),
        emailEnabled: Boolean(input.email),
        whatsappEnabled: Boolean(input.phoneNumber),
      },
      status: "active",
      lastInteractionAt: now,
      anniversary: null,
      tags: contactTags.map((tag) => tag.id),
      searchTokens: this.getContactSearchTokens({
        code: contactId,
        email: input.email,
        name: input.name,
        phoneNumber: input.phoneNumber,
      }),
      counts: {
        lifetimeValue: 0,
        totalOrders: 0,
        messagesSentCount: 0,
        messagesRepliedCount: 0,
      },
      metadata: null,
      createdAt: now,
      updatedAt: now,
    };

    return { contact, contactTags };
  }

  private static async getExistingContactValues(
    businessId: string,
    field: "email" | "phoneNumber",
    values: Array<string | null | undefined>
  ) {
    const uniqueValues = Array.from(
      new Set(values.filter((value): value is string => Boolean(value)))
    );
    const existingValues = new Set<string>();

    for (const chunk of this.chunk(uniqueValues, 30)) {
      const snapshot = await this.contactsCollection(businessId)
        .where(field, "in", chunk)
        .get();

      snapshot.docs.forEach((document) => {
        const value = (document.data() as ContactData)[field];
        if (value) existingValues.add(value);
      });
    }

    return existingValues;
  }

  private static async createMissingContactTags(
    businessId: string,
    tags: { id: string; name: string }[],
    now: number
  ) {
    if (tags.length === 0) return;

    const tagsCollection = this.tagsCollection(businessId);
    const tagReferences = tags.map((tag) => tagsCollection.doc(tag.id));
    const existingTagIds = new Set<string>();

    for (const references of this.chunk(tagReferences, 300)) {
      const snapshots = await db().getAll(...references);
      snapshots.forEach((snapshot) => {
        if (snapshot.exists) existingTagIds.add(snapshot.id);
      });
    }

    const missingTags = tags.filter((tag) => !existingTagIds.has(tag.id));

    for (const chunk of this.chunk(missingTags, 450)) {
      const batch = db().batch();

      chunk.forEach((tag) => {
        batch.create(tagsCollection.doc(tag.id), {
          id: tag.id,
          name: tag.name,
          referenceType: "contact",
          createdAt: now,
        } satisfies ContactTagData);
      });
      await batch.commit();
    }
  }

  private static async createContactsInBatches(
    businessId: string,
    contacts: ContactData[]
  ) {
    const contactsCollection = this.contactsCollection(businessId);

    for (const chunk of this.chunk(contacts, 450)) {
      const batch = db().batch();

      chunk.forEach((contact) => {
        batch.create(contactsCollection.doc(contact.id), contact);
      });
      await batch.commit();
    }
  }

  private static chunk<T>(items: T[], size: number) {
    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size));
    }

    return chunks;
  }

  private static encodeContactCursor(cursor: ContactCursor) {
    return Buffer.from(JSON.stringify(cursor)).toString("base64url");
  }

  private static decodeContactCursor(cursor: string): ContactCursor {
    try {
      const value = JSON.parse(
        Buffer.from(cursor, "base64url").toString("utf8")
      ) as Partial<ContactCursor>;
      if (
        typeof value.createdAt === "number" &&
        Number.isFinite(value.createdAt) &&
        typeof value.id === "string" &&
        value.id.length > 0
      ) {
        return { createdAt: value.createdAt, id: value.id };
      }
    } catch {
      // Return the standardized invalid request response below.
    }

    const response = API_RESPONSE.invalidRequest;
    throw new ApiError(response.statusCode, response.message, response.code);
  }

  private static getDocumentCursor(
    document: QueryDocumentSnapshot<DocumentData>
  ): ContactCursor {
    const contact = document.data() as ContactData;
    return { createdAt: contact.createdAt, id: document.id };
  }

  private static async getDuplicateContact(
    businessId: string,
    input: Pick<CreateContactBody, "email" | "phoneNumber">,
    excludedContactId?: string
  ) {
    const contacts = this.contactsCollection(businessId);
    const duplicateQueries = [
      ...(input.email
        ? [contacts.where("email", "==", input.email).limit(1).get()]
        : []),
      ...(input.phoneNumber
        ? [
            contacts
              .where("phoneNumber", "==", input.phoneNumber)
              .limit(1)
              .get(),
          ]
        : []),
    ];
    const snapshots = await Promise.all(duplicateQueries);

    return snapshots.some((snapshot) =>
      snapshot.docs.some((document) => document.id !== excludedContactId)
    );
  }

  private static contactsCollection(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.contacts);
  }

  private static tagsCollection(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.tags);
  }
}
