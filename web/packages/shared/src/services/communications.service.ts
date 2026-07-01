import type {
  BaseAPIServiceOptions,
  CommunicationInput,
  CommunicationPayload,
  CommunicationRecipientsPayload,
  CommunicationsPayload,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class CommunicationsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getCommunications(): Promise<CommunicationsPayload> {
    return this.get<CommunicationsPayload>(this.urlController.communications, {
      withToken: true,
    });
  }

  createCommunication(
    input: CommunicationInput,
  ): Promise<CommunicationPayload> {
    return this.post<CommunicationPayload, CommunicationInput>(
      this.urlController.communications,
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      },
    );
  }

  updateCommunication(
    communicationId: string,
    input: CommunicationInput,
  ): Promise<CommunicationPayload> {
    return this.patch<CommunicationPayload, CommunicationInput>(
      this.urlController.communication(communicationId),
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      },
    );
  }

  deleteCommunication(communicationId: string): Promise<void> {
    return this.delete<void>(
      this.urlController.communication(communicationId),
      {
        maxRetries: 0,
        withToken: true,
      },
    );
  }

  getCommunicationRecipients(
    communicationId: string,
  ): Promise<CommunicationRecipientsPayload> {
    return this.get<CommunicationRecipientsPayload>(
      this.urlController.communicationRecipients(communicationId),
      {
        withToken: true,
      },
    );
  }
}

export const communicationsService = new CommunicationsService();
