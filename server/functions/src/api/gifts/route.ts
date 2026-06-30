import { Router, type Response } from "express";
import {
  createGiftSchema,
  giftParamsSchema,
  type CreateGiftBody,
  type GiftParams,
  type UpdateGiftBody,
  updateGiftSchema,
} from "../../shared/schema/gift.schema";
import { GiftService } from "../../shared/services/gift.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const GiftRouter = Router();

GiftRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const gifts = await GiftService.getGifts(membership.businessId);
    const response = API_RESPONSE.giftsFetched;
    return SuccessResult(
      res,
      response.message,
      { gifts },
      response.statusCode,
      response.code,
    );
  }),
);

GiftRouter.post(
  "/",
  validateRequest({ body: createGiftSchema }),
  asyncHandler(async (req, res) => {
    const userId = req.currentUser?.uid;
    const membership = await getMembership(userId);
    if (!membership || !userId) {
      return sendError(res, API_RESPONSE.unauthorized);
    }

    const gift = await GiftService.createGift({
      businessId: membership.businessId,
      createdBy: userId,
      input: req.body as CreateGiftBody,
    });
    const response = API_RESPONSE.giftCreated;
    return SuccessResult(
      res,
      response.message,
      { gift },
      response.statusCode,
      response.code,
    );
  }),
);

GiftRouter.patch(
  "/:giftId",
  validateRequest({ body: updateGiftSchema, params: giftParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as GiftParams;
    const gift = await GiftService.updateGift({
      businessId: membership.businessId,
      giftId: params.giftId,
      input: req.body as UpdateGiftBody,
    });
    if (!gift) return sendError(res, API_RESPONSE.giftNotFound);

    const response = API_RESPONSE.giftUpdated;
    return SuccessResult(
      res,
      response.message,
      { gift },
      response.statusCode,
      response.code,
    );
  }),
);

GiftRouter.delete(
  "/:giftId",
  validateRequest({ params: giftParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as GiftParams;
    const result = await GiftService.deleteGift({
      businessId: membership.businessId,
      giftId: params.giftId,
    });
    if (result === "not-found") {
      return sendError(res, API_RESPONSE.giftNotFound);
    }
    if (result === "in-use") {
      return sendError(res, API_RESPONSE.giftInUse);
    }

    const response = API_RESPONSE.giftDeleted;
    return SuccessResult(
      res,
      response.message,
      null,
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

export { GiftRouter };
