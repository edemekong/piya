import type {
  BaseAPIServiceOptions,
} from "../types";
import {
  dummyCommunicationRecipientsByCommunicationId,
  dummyCommunications,
} from "../utils/dummy_data";
import { BaseAPIService } from "./base-api.service";

export class CommunicationsService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions = {}) {
    super(options);
  }

  getCommunications() {
    return dummyCommunications;
  }

  getCommunicationRecipients(communicationId: string) {
    return dummyCommunicationRecipientsByCommunicationId[communicationId] ?? [];
  }
}

export const communicationsService = new CommunicationsService();
