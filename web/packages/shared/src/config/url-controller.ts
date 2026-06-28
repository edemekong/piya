import { appConfig } from "./app-config";
import { requireConfigValue } from "./env-config";

export class URLController {
  private readonly urlPrefix: string;

  constructor(baseUrl = appConfig.apiBaseUrl) {
    this.urlPrefix = baseUrl.replace(/\/$/, "");
  }

  get baseUrl() {
    return this.urlPrefix;
  }

  get health() {
    return this.path("/v1/health");
  }

  get requestAuthOTP() {
    return this.path("/v1/auth/request-otp");
  }

  get verifyAuthOTP() {
    return this.path("/v1/auth/verify-otp");
  }

  get createUser() {
    return this.path("/v1/users/create");
  }

  get updateUser() {
    return this.path("/v1/users/update");
  }

  accountSetup(step?: string) {
    const query = step ? `?step=${encodeURIComponent(step)}` : "";
    return this.path(`/v1/users/account-setup${query}`);
  }

  get team() {
    return this.path("/v1/businesses/team");
  }

  get businessSlugAvailability() {
    return this.path("/v1/businesses/slug-availability");
  }

  get leadRequests() {
    return this.path("/v1/lead-requests");
  }

  get primaryAvailability() {
    return this.path("/v1/availability/primary");
  }

  get primaryDeliveryPricing() {
    return this.path("/v1/delivery-pricing/primary");
  }

  get whatsappConnection() {
    return this.path("/v1/whatsapp/connection");
  }

  get completeWhatsAppConnection() {
    return this.path("/v1/whatsapp/connection/complete");
  }

  get disconnectWhatsAppConnection() {
    return this.path("/v1/whatsapp/connection/disconnect");
  }

  get whatsappMessages() {
    return this.path("/v1/whatsapp/messages");
  }

  get memberInvitations() {
    return this.path("/v1/businesses/member-invitations");
  }

  acceptMemberInvitation(businessId: string) {
    return this.path(
      `/v1/businesses/${encodeURIComponent(
        businessId
      )}/member-invitations/accept`
    );
  }

  memberInvitation(invitationId: string) {
    return this.path(
      `/v1/businesses/member-invitations/${encodeURIComponent(invitationId)}`
    );
  }

  teamMember(memberId: string) {
    return this.path(`/v1/businesses/members/${encodeURIComponent(memberId)}`);
  }

  user(id: string) {
    return this.path(`/v1/users/fetch/${encodeURIComponent(id)}`);
  }

  private path(pathname: string) {
    return `${requireConfigValue(
      this.urlPrefix,
      "VITE_API_BASE_URL"
    )}${pathname}`;
  }
}
