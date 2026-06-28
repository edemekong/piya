import { createHmac, timingSafeEqual } from "crypto";
import { finalConfiguration } from "../../configs/configurations";
import { db } from "../../configs/firebase";
import type { WhatsAppChannelSettings } from "../model/channel-settings";
import type { CompleteWhatsAppConnectionBody } from "../schema/whatsapp.schema";
import type {
  SendWhatsAppMessageBody,
  SendWhatsAppMessageResult,
  WhatsAppConnectionPayload,
  WhatsAppWebhookProcessResult,
} from "../types/whatsapp.type";
import { BUSINESS_SUBCOLLECTIONS, COLLECTIONS } from "../utils/collections";
import { getUTCTimeNow } from "../utils/helpers/helper-functions";

type MetaWebhookEntry = {
  changes?: Array<{
    value?: {
      metadata?: {
        phone_number_id?: string;
        display_phone_number?: string;
      };
      messages?: Array<{ id?: string }>;
      statuses?: Array<{ id?: string; status?: string; errors?: unknown[] }>;
    };
  }>;
};

type MetaWebhookPayload = {
  object?: string;
  entry?: MetaWebhookEntry[];
};

type MetaSendMessageResponse = {
  messages?: Array<{ id?: string }>;
};

export class WhatsAppService {
  static verifyWebhookToken(mode?: string, token?: string) {
    const expectedToken = finalConfiguration().WHATSAPP_WEBHOOK_VERIFY_TOKEN;
    return Boolean(
      expectedToken && mode === "subscribe" && token === expectedToken,
    );
  }

  static verifyWebhookSignature(
    signatureHeader: string | undefined,
    rawBody: Buffer | undefined,
  ) {
    const appSecret = finalConfiguration().META_APP_SECRET;
    if (!appSecret || !signatureHeader || !rawBody) return false;

    const [algorithm, signature] = signatureHeader.split("=");
    if (algorithm !== "sha256" || !signature) return false;

    const expectedSignature = createHmac("sha256", appSecret)
      .update(rawBody)
      .digest("hex");
    const signatureBuffer = Buffer.from(signature, "hex");
    const expectedSignatureBuffer = Buffer.from(expectedSignature, "hex");

    return (
      signatureBuffer.length === expectedSignatureBuffer.length &&
      timingSafeEqual(signatureBuffer, expectedSignatureBuffer)
    );
  }

  static async getConnection(
    businessId: string,
  ): Promise<WhatsAppConnectionPayload> {
    return {
      businessId,
      connection: await this.getConnectionSettings(businessId),
    };
  }

  static async completeConnection(
    businessId: string,
    data: CompleteWhatsAppConnectionBody,
  ): Promise<WhatsAppConnectionPayload> {
    const now = getUTCTimeNow();
    const existing = await this.getConnectionSettings(businessId);
    const connection: WhatsAppChannelSettings = {
      provider: "whatsapp_cloud",
      status: "active",
      businessAccountId: data.wabaId,
      wabaId: data.wabaId,
      phoneNumberId: data.phoneNumberId,
      phoneNumber: data.phoneNumber ?? existing?.phoneNumber ?? null,
      displayPhoneNumber: data.displayPhoneNumber,
      displayName: data.displayName ?? existing?.displayName ?? null,
      qualityRating: data.qualityRating ?? existing?.qualityRating ?? null,
      credentialReference:
        existing?.credentialReference ?? "meta_system_user_access_token",
      connectedAt: existing?.connectedAt ?? now,
      disconnectedAt: null,
      lastSyncedAt: now,
      lastError: null,
    };

    await this.channelSettingsDocument(businessId).set(
      {
        id: "config",
        businessId,
        whatsapp: connection,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );

    return { businessId, connection };
  }

  static async disconnectConnection(
    businessId: string,
  ): Promise<WhatsAppConnectionPayload> {
    const now = getUTCTimeNow();
    const existing = await this.getConnectionSettings(businessId);
    const connection: WhatsAppChannelSettings = {
      provider: "whatsapp_cloud",
      status: "disabled",
      businessAccountId: existing?.businessAccountId ?? null,
      wabaId: existing?.wabaId ?? existing?.businessAccountId ?? null,
      phoneNumberId: existing?.phoneNumberId ?? null,
      phoneNumber: existing?.phoneNumber ?? null,
      displayPhoneNumber: existing?.displayPhoneNumber ?? null,
      displayName: existing?.displayName ?? null,
      qualityRating: existing?.qualityRating ?? null,
      credentialReference: existing?.credentialReference ?? null,
      connectedAt: existing?.connectedAt ?? null,
      disconnectedAt: now,
      lastSyncedAt: now,
      lastError: null,
    };

    await this.channelSettingsDocument(businessId).set(
      {
        id: "config",
        businessId,
        whatsapp: connection,
        updatedAt: now,
      },
      { merge: true },
    );

    return { businessId, connection };
  }

  static async sendTextMessage(
    businessId: string,
    body: SendWhatsAppMessageBody,
  ): Promise<SendWhatsAppMessageResult | null> {
    const connection = await this.getConnectionSettings(businessId);
    const accessToken = finalConfiguration().META_SYSTEM_USER_ACCESS_TOKEN;
    if (!connection?.phoneNumberId || connection.status !== "active") {
      return null;
    }
    if (!accessToken) {
      throw new Error("Missing Meta system user access token");
    }

    const response = await fetch(
      `${finalConfiguration().META_GRAPH_API_BASE_URL}/${connection.phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: body.to,
          type: "text",
          text: { body: body.text, preview_url: false },
        }),
      },
    );

    if (!response.ok) {
      await this.markConnectionFailed(businessId, "Meta message send failed");
      throw new Error("Meta message send failed");
    }

    const data = (await response.json()) as MetaSendMessageResponse;
    return {
      messageId: data.messages?.[0]?.id ?? null,
      provider: "whatsapp_cloud",
      status: "accepted",
    };
  }

  static async processWebhook(
    payload: MetaWebhookPayload,
  ): Promise<WhatsAppWebhookProcessResult> {
    const change = payload.entry?.flatMap((entry) => entry.changes ?? [])[0];
    const value = change?.value;
    const phoneNumberId = value?.metadata?.phone_number_id ?? null;
    const messageCount = value?.messages?.length ?? 0;
    const statusCount = value?.statuses?.length ?? 0;

    if (!phoneNumberId) {
      return {
        processed: false,
        businessId: null,
        phoneNumberId,
        messageCount,
        statusCount,
      };
    }

    const businessId = await this.getBusinessIdForPhoneNumber(phoneNumberId);
    if (!businessId) {
      return {
        processed: false,
        businessId: null,
        phoneNumberId,
        messageCount,
        statusCount,
      };
    }

    await this.channelSettingsDocument(businessId).set(
      {
        "whatsapp.lastSyncedAt": getUTCTimeNow(),
        updatedAt: getUTCTimeNow(),
      },
      { merge: true },
    );

    return {
      processed: true,
      businessId,
      phoneNumberId,
      messageCount,
      statusCount,
    };
  }

  private static async getConnectionSettings(
    businessId: string,
  ): Promise<WhatsAppChannelSettings | null> {
    const snapshot = await this.channelSettingsDocument(businessId).get();
    if (!snapshot.exists) return null;

    return (
      (snapshot.data()?.whatsapp as WhatsAppChannelSettings | null | undefined) ??
      null
    );
  }

  private static async getBusinessIdForPhoneNumber(
    phoneNumberId: string,
  ): Promise<string | null> {
    const snapshot = await db()
      .collectionGroup(BUSINESS_SUBCOLLECTIONS.channelSettings)
      .where("whatsapp.phoneNumberId", "==", phoneNumberId)
      .limit(1)
      .get();
    if (snapshot.empty) return null;

    const data = snapshot.docs[0].data() as { businessId?: string };
    return data.businessId ?? null;
  }

  private static async markConnectionFailed(
    businessId: string,
    reason: string,
  ) {
    await this.channelSettingsDocument(businessId).set(
      {
        "whatsapp.status": "failed",
        "whatsapp.lastError": reason,
        "whatsapp.lastSyncedAt": getUTCTimeNow(),
        updatedAt: getUTCTimeNow(),
      },
      { merge: true },
    );
  }

  private static channelSettingsDocument(businessId: string) {
    return db()
      .collection(COLLECTIONS.business)
      .doc(businessId)
      .collection(BUSINESS_SUBCOLLECTIONS.channelSettings)
      .doc("config");
  }
}
