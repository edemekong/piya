import type {
  BaseAPIServiceOptions,
  InviteMemberInput,
  MemberInvitationPayload,
  MemberPayload,
  TeamPayload,
  UpdateTeamEntryRoleInput,
} from "../types";
import { BaseAPIService } from "./base-api.service";
import { authService, type AuthService } from "./auth.service";

export class BusinessTeamService extends BaseAPIService {
  constructor(
    options: BaseAPIServiceOptions & { auth?: AuthService } = {},
  ) {
    const auth = options.auth ?? authService;
    super({
      ...options,
      tokenProvider: options.tokenProvider ?? (() => auth.getIdToken()),
    });
  }

  getTeam(): Promise<TeamPayload> {
    return this.get<TeamPayload>(this.urlController.team, {
      withToken: true,
    });
  }

  inviteMember(input: InviteMemberInput): Promise<MemberInvitationPayload> {
    return this.post<MemberInvitationPayload, InviteMemberInput>(
      this.urlController.memberInvitations,
      { body: input, withToken: true },
    );
  }

  acceptInvitation(businessId: string): Promise<MemberPayload> {
    return this.post<MemberPayload>(
      this.urlController.acceptMemberInvitation(businessId),
      { withToken: true },
    );
  }

  updateMemberRole(
    memberId: string,
    input: UpdateTeamEntryRoleInput,
  ): Promise<MemberPayload> {
    return this.patch<MemberPayload, UpdateTeamEntryRoleInput>(
      this.urlController.teamMember(memberId),
      { body: input, withToken: true },
    );
  }

  updateInvitationRole(
    invitationId: string,
    input: UpdateTeamEntryRoleInput,
  ): Promise<MemberInvitationPayload> {
    return this.patch<MemberInvitationPayload, UpdateTeamEntryRoleInput>(
      this.urlController.memberInvitation(invitationId),
      { body: input, withToken: true },
    );
  }

  deleteMember(memberId: string): Promise<void> {
    return this.delete<void>(this.urlController.teamMember(memberId), {
      withToken: true,
    });
  }

  deleteInvitation(invitationId: string): Promise<void> {
    return this.delete<void>(
      this.urlController.memberInvitation(invitationId),
      { withToken: true },
    );
  }
}

export const teamService = new BusinessTeamService();
