import { Router, type Response } from "express";
import {
  businessSlugAvailabilityQuerySchema,
  BusinessSlugAvailabilityQuery,
} from "../../shared/schema/business.schema";
import { BusinessService } from "../../shared/services/business.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const slugRouter = Router();

slugRouter.get(
  "/slug-availability",
  validateRequest({ query: businessSlugAvailabilityQuerySchema }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;
    if (!currentUser) return sendError(res, API_RESPONSE.unauthorized);

    const membership = await BusinessTeamService.getMembership(currentUser.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const { slug } = req.query as BusinessSlugAvailabilityQuery;
    const availableSlug = await BusinessService.getAvailableBusinessSlug(
      membership.businessId,
      slug,
    );
    const response = API_RESPONSE.businessSlugAvailabilityChecked;

    return SuccessResult(
      res,
      response.message,
      {
        available: availableSlug !== null,
        slug: availableSlug ?? slug,
      },
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

export { slugRouter };
