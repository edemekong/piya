import type {
  BaseAPIServiceOptions,
  CompleteWhatsAppConnectionInput,
  SendWhatsAppMessageInput,
  SendWhatsAppMessagePayload,
  WhatsAppConnectionPayload,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class WhatsAppService extends BaseAPIService {
  constructor(
    options: BaseAPIServiceOptions & { auth?: AuthService } = {},
  ) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getConnection(): Promise<WhatsAppConnectionPayload> {
    return this.get<WhatsAppConnectionPayload>(
      this.urlController.whatsappConnection,
      { withToken: true },
    );
  }

  completeConnection(
    input: CompleteWhatsAppConnectionInput,
  ): Promise<WhatsAppConnectionPayload> {
    return this.post<
      WhatsAppConnectionPayload,
      CompleteWhatsAppConnectionInput
    >(this.urlController.completeWhatsAppConnection, {
      body: input,
      withToken: true,
    });
  }

  disconnectConnection(): Promise<WhatsAppConnectionPayload> {
    return this.post<WhatsAppConnectionPayload>(
      this.urlController.disconnectWhatsAppConnection,
      { withToken: true },
    );
  }

  sendMessage(
    input: SendWhatsAppMessageInput,
  ): Promise<SendWhatsAppMessagePayload> {
    return this.post<SendWhatsAppMessagePayload, SendWhatsAppMessageInput>(
      this.urlController.whatsappMessages,
      { body: input, withToken: true },
    );
  }
}

export const whatsappService = new WhatsAppService();
