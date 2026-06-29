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
  CreateContactBody,
  GetContactsQuery,
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
    if (await this.hasDuplicateContact(businessId, input)) {
      return { status: "duplicate" };
    }

    const contactRef = this.contactsCollection(businessId).doc();
    const now = getUTCTimeNow();
    const parsedPhoneNumber = input.phoneNumber
      ? parsePhoneNumberFromString(input.phoneNumber)
      : null;
    const contactTags = this.getContactTagEntries(input.tags);
    const contact: ContactData = {
      id: contactRef.id,
      userId: null,
      code: contactRef.id,
      createdBy,
      businessId,
      name: input.name,
      profileImageUrl: null,
      email: input.email,
      phoneNumber: input.phoneNumber,
      countryCode: parsedPhoneNumber?.country ?? null,
      address: input.address ?? null,
      badge: {
        badgeId: "regular",
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
        code: contactRef.id,
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

  private static async hasDuplicateContact(
    businessId: string,
    input: CreateContactBody
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

    return snapshots.some((snapshot) => !snapshot.empty);
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
