import { Router, type Response } from "express";
import {
  invitationAcceptanceParamsSchema,
  memberInvitationSchema,
  memberRoleSchema,
  teamEntryParamsSchema,
  InvitationAcceptanceParams,
  MemberInvitationBody,
  MemberRoleBody,
  TeamEntryParams,
} from "../../shared/schema/team.schema";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const teamRouter = Router();

teamRouter.get(
  "/team",
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;
    if (!currentUser) return sendError(res, API_RESPONSE.unauthorized);

    const membership = await BusinessTeamService.getMembership(currentUser.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const team = await BusinessTeamService.getTeam(membership.businessId);
    const response = API_RESPONSE.teamFetched;
    return SuccessResult(
      res,
      response.message,
      { ...team, currentUserRole: membership.member.role },
      response.statusCode,
      response.code,
    );
  }),
);

teamRouter.post(
  "/member-invitations",
  validateRequest({ body: memberInvitationSchema }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;
    if (!currentUser) return sendError(res, API_RESPONSE.unauthorized);

    const membership = await BusinessTeamService.getMembership(currentUser.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);
    if (
      membership.member.role !== "owner" &&
      membership.member.role !== "admin"
    ) {
      return sendError(res, API_RESPONSE.teamInvitePermissionRequired);
    }

    const body = req.body as MemberInvitationBody;
    const existingMember = await BusinessTeamService.getMemberByEmail(
      membership.businessId,
      body.email,
    );
    if (existingMember) {
      return sendError(res, API_RESPONSE.memberAlreadyExists);
    }

    const { emailSent, invitation } = await BusinessTeamService.inviteMember(
      membership.business,
      currentUser.uid,
      body,
    );
    if (!emailSent) {
      return sendError(res, API_RESPONSE.memberInvitationEmailFailed);
    }

    const response = API_RESPONSE.memberInvitationSent;
    return SuccessResult(
      res,
      response.message,
      { invitation },
      response.statusCode,
      response.code,
    );
  }),
);

teamRouter.post(
  "/:businessId/member-invitations/accept",
  validateRequest({ params: invitationAcceptanceParamsSchema }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;
    if (
      !currentUser?.email ||
      !currentUser.emailVerified
    ) {
      return sendError(res, API_RESPONSE.unauthorized);
    }

    const { businessId } = req.params as InvitationAcceptanceParams;
    const result = await BusinessTeamService.acceptInvitation({
      businessId,
      email: currentUser.email,
      userId: currentUser.uid,
    });

    if (result.status === "invitation-not-found") {
      return sendError(res, API_RESPONSE.memberInvitationNotFound);
    }
    if (result.status === "expired") {
      return sendError(res, API_RESPONSE.memberInvitationExpired);
    }
    if (result.status === "user-not-found") {
      return sendError(res, API_RESPONSE.userNotFound);
    }
    if (result.status === "business-not-found") {
      return sendError(res, API_RESPONSE.businessNotFound);
    }
    if (result.status !== "accepted") {
      return sendError(res, API_RESPONSE.serverError);
    }

    const response = API_RESPONSE.memberInvitationAccepted;
    return SuccessResult(
      res,
      response.message,
      { member: result.member },
      response.statusCode,
      response.code,
    );
  }),
);

teamRouter.patch(
  "/member-invitations/:entryId",
  validateRequest({
    body: memberRoleSchema,
    params: teamEntryParamsSchema,
  }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;
    if (!currentUser) return sendError(res, API_RESPONSE.unauthorized);

    const owner = await BusinessTeamService.checkBusinessOwner(currentUser.uid);
    if (!owner) return sendError(res, API_RESPONSE.teamOwnerRequired);

    const { entryId } = req.params as TeamEntryParams;
    const invitation = await BusinessTeamService.updateInvitationRole(
      owner.businessId,
      entryId,
      req.body as MemberRoleBody,
    );
    if (!invitation) {
      return sendError(res, API_RESPONSE.memberInvitationNotFound);
    }

    const response = API_RESPONSE.memberUpdated;
    return SuccessResult(
      res,
      response.message,
      { invitation },
      response.statusCode,
      response.code,
    );
  }),
);

teamRouter.delete(
  "/member-invitations/:entryId",
  validateRequest({ params: teamEntryParamsSchema }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;
    if (!currentUser) return sendError(res, API_RESPONSE.unauthorized);

    const owner = await BusinessTeamService.checkBusinessOwner(currentUser.uid);
    if (!owner) return sendError(res, API_RESPONSE.teamOwnerRequired);

    const { entryId } = req.params as TeamEntryParams;
    const deleted = await BusinessTeamService.deleteInvitation(
      owner.businessId,
      entryId,
    );
    if (!deleted) {
      return sendError(res, API_RESPONSE.memberInvitationNotFound);
    }

    const response = API_RESPONSE.memberInvitationDeleted;
    return SuccessResult(
      res,
      response.message,
      undefined,
      response.statusCode,
      response.code,
    );
  }),
);

teamRouter.patch(
  "/members/:entryId",
  validateRequest({
    body: memberRoleSchema,
    params: teamEntryParamsSchema,
  }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;
    if (!currentUser) return sendError(res, API_RESPONSE.unauthorized);

    const owner = await BusinessTeamService.checkBusinessOwner(currentUser.uid);
    if (!owner) return sendError(res, API_RESPONSE.teamOwnerRequired);

    const { entryId } = req.params as TeamEntryParams;
    const member = await BusinessTeamService.getMember(owner.businessId, entryId);
    if (!member) return sendError(res, API_RESPONSE.userNotFound);
    if (member.role === "owner") {
      return sendError(res, API_RESPONSE.teamOwnerRequired);
    }

    const updatedMember = await BusinessTeamService.updateMemberRole(
      member,
      req.body as MemberRoleBody,
    );

    const response = API_RESPONSE.memberUpdated;
    return SuccessResult(
      res,
      response.message,
      { member: updatedMember },
      response.statusCode,
      response.code,
    );
  }),
);

teamRouter.delete(
  "/members/:entryId",
  validateRequest({ params: teamEntryParamsSchema }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;
    if (!currentUser) return sendError(res, API_RESPONSE.unauthorized);

    const owner = await BusinessTeamService.checkBusinessOwner(currentUser.uid);
    if (!owner) return sendError(res, API_RESPONSE.teamOwnerRequired);

    const { entryId } = req.params as TeamEntryParams;
    const member = await BusinessTeamService.getMember(owner.businessId, entryId);
    if (!member) return sendError(res, API_RESPONSE.userNotFound);
    if (member.role === "owner") {
      return sendError(res, API_RESPONSE.teamOwnerRequired);
    }

    await BusinessTeamService.deleteMember(member);

    const response = API_RESPONSE.memberDeleted;
    return SuccessResult(
      res,
      response.message,
      undefined,
      response.statusCode,
      response.code,
    );
  }),
);

function sendError(
  res: Response,
  error: { code: string; message: string; statusCode: number },
) {
  return ErrorResult(res, error.statusCode, error.message, error.code);
}

export { teamRouter };
