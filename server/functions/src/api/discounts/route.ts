import { Router, type Response } from "express";
import {
  createDiscountSchema,
  discountParamsSchema,
  type CreateDiscountBody,
  type DiscountParams,
  type UpdateDiscountBody,
  updateDiscountSchema,
} from "../../shared/schema/discount.schema";
import { DiscountService } from "../../shared/services/discount.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const DiscountRouter = Router();

DiscountRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const discounts = await DiscountService.getDiscounts(
      membership.businessId,
    );
    const response = API_RESPONSE.discountsFetched;
    return SuccessResult(
      res,
      response.message,
      { discounts },
      response.statusCode,
      response.code,
    );
  }),
);

DiscountRouter.post(
  "/",
  validateRequest({ body: createDiscountSchema }),
  asyncHandler(async (req, res) => {
    const userId = req.currentUser?.uid;
    const membership = await getMembership(userId);
    if (!membership || !userId) {
      return sendError(res, API_RESPONSE.unauthorized);
    }

    const discount = await DiscountService.createDiscount({
      businessId: membership.businessId,
      createdBy: userId,
      input: req.body as CreateDiscountBody,
    });
    const response = API_RESPONSE.discountCreated;
    return SuccessResult(
      res,
      response.message,
      { discount },
      response.statusCode,
      response.code,
    );
  }),
);

DiscountRouter.patch(
  "/:discountId",
  validateRequest({ body: updateDiscountSchema, params: discountParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as DiscountParams;
    const discount = await DiscountService.updateDiscount({
      businessId: membership.businessId,
      discountId: params.discountId,
      input: req.body as UpdateDiscountBody,
    });
    if (!discount) return sendError(res, API_RESPONSE.discountNotFound);

    const response = API_RESPONSE.discountUpdated;
    return SuccessResult(
      res,
      response.message,
      { discount },
      response.statusCode,
      response.code,
    );
  }),
);

DiscountRouter.delete(
  "/:discountId",
  validateRequest({ params: discountParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as DiscountParams;
    const result = await DiscountService.deleteDiscount({
      businessId: membership.businessId,
      discountId: params.discountId,
    });
    if (result === "not-found") {
      return sendError(res, API_RESPONSE.discountNotFound);
    }
    if (result === "in-use") {
      return sendError(res, API_RESPONSE.discountInUse);
    }

    const response = API_RESPONSE.discountDeleted;
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

export { DiscountRouter };
