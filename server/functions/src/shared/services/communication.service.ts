import { db } from "../../configs/firebase";
import type {
  CommunicationData,
  CommunicationRecipient,
} from "../model/communication";
import type {
  CreateCommunicationBody,
  UpdateCommunicationBody,
} from "../schema/communication.schema";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

export class CommunicationService {
  static async getCommunications(
    businessId: string,
  ): Promise<CommunicationData[]> {
    const snapshot = await this.communicationsCollection(businessId)
      .orderBy("createdAt", "desc")
      .get();

    return snapshot.docs.map(
      (document) => document.data() as CommunicationData,
    );
  }

  static async createCommunication(params: {
    businessId: string;
    createdBy: string;
    input: CreateCommunicationBody;
  }): Promise<CommunicationData> {
    const { businessId, createdBy, input } = params;
    const communicationRef = this.communicationsCollection(businessId).doc();
    const now = getUTCTimeNow();
    const communication: CommunicationData = {
      ...input,
      businessId,
      createdAt: now,
      createdBy,
      hasPendingBatch: input.hasPendingBatch ?? false,
      id: communicationRef.id,
      lastCursor: input.lastCursor ?? null,
      lastExecutedAt: input.lastExecutedAt ?? null,
      stats: input.stats ?? {
        delivered: 0,
        failed: 0,
        pending: 0,
        recipients: 0,
      },
      updatedAt: now,
    };

    await communicationRef.create(communication);
    return communication;
  }

  static async updateCommunication(params: {
    businessId: string;
    communicationId: string;
    input: UpdateCommunicationBody;
  }): Promise<CommunicationData | null> {
    const { businessId, communicationId, input } = params;
    const communicationRef =
      this.communicationsCollection(businessId).doc(communicationId);
    const snapshot = await communicationRef.get();
    if (!snapshot.exists) return null;

    const existingCommunication = snapshot.data() as CommunicationData;
    const communication: CommunicationData = {
      ...existingCommunication,
      ...input,
      businessId,
      createdAt: existingCommunication.createdAt,
      createdBy: existingCommunication.createdBy,
      hasPendingBatch:
        input.hasPendingBatch ?? existingCommunication.hasPendingBatch,
      id: communicationId,
      lastCursor: input.lastCursor ?? existingCommunication.lastCursor ?? null,
      lastExecutedAt:
        input.lastExecutedAt ?? existingCommunication.lastExecutedAt ?? null,
      stats: input.stats ?? existingCommunication.stats,
      updatedAt: getUTCTimeNow(),
    };

    await communicationRef.set(communication);
    return communication;
  }

  static async deleteCommunication(params: {
    businessId: string;
    communicationId: string;
  }): Promise<"deleted" | "not-found"> {
    const { businessId, communicationId } = params;
    const communicationRef =
      this.communicationsCollection(businessId).doc(communicationId);
    const snapshot = await communicationRef.get();
    if (!snapshot.exists) return "not-found";

    await communicationRef.delete();
    return "deleted";
  }

  static async getCommunicationRecipients(params: {
    businessId: string;
    communicationId: string;
  }): Promise<CommunicationRecipient[]> {
    const snapshot = await this.communicationRecipientsCollection(
      params.businessId,
      params.communicationId,
    )
      .orderBy("lastActivityAt", "desc")
      .get();

    return snapshot.docs.map(
      (document) => document.data() as CommunicationRecipient,
    );
  }

  private static communicationsCollection(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.communications);
  }

  private static communicationRecipientsCollection(
    businessId: string,
    communicationId: string,
  ) {
    return this.communicationsCollection(businessId)
      .doc(communicationId)
      .collection(BUSINESS_SUBCOLLECTIONS.communicationRecipients);
  }
}
