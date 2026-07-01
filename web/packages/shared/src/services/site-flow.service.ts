import type {
  BaseAPIServiceOptions,
  SiteFlowPayload,
  UpdateSiteFlowInput,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class SiteFlowService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getSiteFlow(): Promise<SiteFlowPayload> {
    return this.get<SiteFlowPayload>(this.urlController.siteFlow, {
      withToken: true,
    });
  }

  updateSiteFlow(input: UpdateSiteFlowInput): Promise<SiteFlowPayload> {
    return this.put<SiteFlowPayload, UpdateSiteFlowInput>(
      this.urlController.siteFlow,
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      },
    );
  }
}

export const siteFlowService = new SiteFlowService();
