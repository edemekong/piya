import { Router, type Response } from "express";
import {
  createOfferingSchema,
  offeringParamsSchema,
  type CreateOfferingBody,
  type OfferingParams,
  type UpdateOfferingBody,
  updateOfferingSchema,
} from "../../shared/schema/offering.schema";
import { OfferingService } from "../../shared/services/offering.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const OfferingRouter = Router();

OfferingRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const offerings = await OfferingService.getOfferings(membership.businessId);
    const response = API_RESPONSE.offeringsFetched;
    return SuccessResult(
      res,
      response.message,
      { offerings },
      response.statusCode,
      response.code,
    );
  }),
);

OfferingRouter.post(
  "/",
  validateRequest({ body: createOfferingSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const offering = await OfferingService.createOffering({
      businessId: membership.businessId,
      input: req.body as CreateOfferingBody,
    });
    const response = API_RESPONSE.offeringCreated;
    return SuccessResult(
      res,
      response.message,
      { offering },
      response.statusCode,
      response.code,
    );
  }),
);

OfferingRouter.patch(
  "/:offeringId",
  validateRequest({ body: updateOfferingSchema, params: offeringParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as OfferingParams;
    const offering = await OfferingService.updateOffering({
      businessId: membership.businessId,
      input: req.body as UpdateOfferingBody,
      offeringId: params.offeringId,
    });
    if (!offering) return sendError(res, API_RESPONSE.offeringNotFound);

    const response = API_RESPONSE.offeringUpdated;
    return SuccessResult(
      res,
      response.message,
      { offering },
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

export { OfferingRouter };
