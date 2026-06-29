import { Router, type Response } from "express";
import {
  badgeParamsSchema,
  createBadgeSchema,
  type BadgeParams,
  type CreateBadgeBody,
  type UpdateBadgeBody,
  updateBadgeSchema,
} from "../../shared/schema/badge.schema";
import { BadgeService } from "../../shared/services/badge.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const BadgeRouter = Router();

BadgeRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const badges = await BadgeService.getBadges(membership.businessId);
    const response = API_RESPONSE.badgesFetched;
    return SuccessResult(
      res,
      response.message,
      { badges },
      response.statusCode,
      response.code
    );
  })
);

BadgeRouter.post(
  "/",
  validateRequest({ body: createBadgeSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const badge = await BadgeService.createBadge({
      businessId: membership.businessId,
      createdBy: membership.user.id,
      input: req.body as CreateBadgeBody,
    });
    const response = API_RESPONSE.badgeCreated;
    return SuccessResult(
      res,
      response.message,
      { badge },
      response.statusCode,
      response.code
    );
  })
);

BadgeRouter.patch(
  "/:id",
  validateRequest({ body: updateBadgeSchema, params: badgeParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as BadgeParams;
    if (BadgeService.isDefaultBadge(params.id)) {
      return sendError(res, API_RESPONSE.defaultBadgeImmutable);
    }

    const badge = await BadgeService.updateBadge({
      badgeId: params.id,
      businessId: membership.businessId,
      input: req.body as UpdateBadgeBody,
    });
    if (!badge) return sendError(res, API_RESPONSE.badgeNotFound);

    const response = API_RESPONSE.badgeUpdated;
    return SuccessResult(
      res,
      response.message,
      { badge },
      response.statusCode,
      response.code
    );
  })
);

BadgeRouter.delete(
  "/:id",
  validateRequest({ params: badgeParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as BadgeParams;
    const result = await BadgeService.deleteBadge({
      badgeId: params.id,
      businessId: membership.businessId,
    });
    if (result === "default") {
      return sendError(res, API_RESPONSE.defaultBadgeImmutable);
    }
    if (result === "not-found") return sendError(res, API_RESPONSE.badgeNotFound);

    const response = API_RESPONSE.badgeDeleted;
    return SuccessResult(
      res,
      response.message,
      null,
      response.statusCode,
      response.code
    );
  })
);

async function getMembership(userId?: string) {
  return userId ? BusinessTeamService.getMembership(userId) : null;
}

function sendError(
  res: Response,
  response: (typeof API_RESPONSE)[keyof typeof API_RESPONSE]
) {
  return ErrorResult(res, response.statusCode, response.message, response.code);
}

export { BadgeRouter };
