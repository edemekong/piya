import type {
  BadgeInput,
  BadgePayload,
  BadgesPayload,
  BaseAPIServiceOptions,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class BadgesService extends BaseAPIService {
  constructor(options: BaseAPIServiceOptions & { auth?: AuthService } = {}) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getBadges(): Promise<BadgesPayload> {
    return this.get<BadgesPayload>(this.urlController.badges, {
      withToken: true,
    });
  }

  createBadge(input: BadgeInput): Promise<BadgePayload> {
    return this.post<BadgePayload, BadgeInput>(this.urlController.badges, {
      body: input,
      maxRetries: 0,
      withToken: true,
    });
  }

  updateBadge(badgeId: string, input: BadgeInput): Promise<BadgePayload> {
    return this.patch<BadgePayload, BadgeInput>(
      this.urlController.badge(badgeId),
      {
        body: input,
        maxRetries: 0,
        withToken: true,
      }
    );
  }

  deleteBadge(badgeId: string): Promise<void> {
    return this.delete<void>(this.urlController.badge(badgeId), {
      maxRetries: 0,
      withToken: true,
    });
  }
}

export const badgesService = new BadgesService();
