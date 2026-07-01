import { Router, type Response } from "express";
import {
  updateSiteFlowSchema,
  type UpdateSiteFlowBody,
} from "../../shared/schema/site-flow.schema";
import { SiteFlowService } from "../../shared/services/site-flow.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const SiteFlowRouter = Router();

SiteFlowRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const flow = await SiteFlowService.getSiteFlow(membership.businessId);
    const response = API_RESPONSE.siteFlowFetched;
    return SuccessResult(
      res,
      response.message,
      { flow },
      response.statusCode,
      response.code,
    );
  }),
);

SiteFlowRouter.put(
  "/",
  validateRequest({ body: updateSiteFlowSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const flow = await SiteFlowService.updateSiteFlow(
      membership.businessId,
      req.body as UpdateSiteFlowBody,
    );
    const response = API_RESPONSE.siteFlowUpdated;
    return SuccessResult(
      res,
      response.message,
      { flow },
      response.statusCode,
      response.code,
    );
  }),
);

async function getMembership(userId?: string) {
  return userId ? BusinessTeamService.getMembership(userId) : null;
}

function sendError(
  res: Response,
  response: (typeof API_RESPONSE)[keyof typeof API_RESPONSE],
) {
  return ErrorResult(res, response.statusCode, response.message, response.code);
}

export { SiteFlowRouter };
