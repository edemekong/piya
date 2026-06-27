import type {
  BaseAPIServiceOptions,
  CreateLeadRequestInput,
} from "../types";
import type { LeadRequestData } from "../models";
import { BaseAPIService } from "./base-api.service";

export class LeadRequestService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions = {}) {
    super(options);
  }

  createLeadRequest(
    input: CreateLeadRequestInput,
    signal?: AbortSignal,
  ): Promise<LeadRequestData> {
    return this.post<LeadRequestData, CreateLeadRequestInput>(
      this.urlController.leadRequests,
      {
        body: input,
        maxRetries: 0,
        signal,
      },
    );
  }
}

export const leadRequestService = new LeadRequestService();
