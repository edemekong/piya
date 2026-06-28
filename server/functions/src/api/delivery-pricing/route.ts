import { Router, type Response } from "express";
import {
  updateDeliveryPricingSchema,
  UpdateDeliveryPricingBody,
} from "../../shared/schema/delivery-pricing.schema";
import { DeliveryPricingService } from "../../shared/services/delivery-pricing.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const DeliveryPricingRouter = Router();

DeliveryPricingRouter.get(
  "/primary",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const deliveryPricing =
      await DeliveryPricingService.getPrimaryDeliveryPricing(
        membership.businessId
      );
    const response = API_RESPONSE.deliveryPricingFetched;
    return SuccessResult(
      res,
      response.message,
      { deliveryPricing },
      response.statusCode,
      response.code
    );
  })
);

DeliveryPricingRouter.patch(
  "/primary",
  validateRequest({ body: updateDeliveryPricingSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);
    if (
      membership.member.role !== "owner" &&
      membership.member.role !== "admin"
    ) {
      return sendError(
        res,
        API_RESPONSE.deliveryPricingUpdatePermissionRequired
      );
    }

    const pricing = req.body as UpdateDeliveryPricingBody;
    const deliveryPricing =
      await DeliveryPricingService.upsertPrimaryDeliveryPricing({
        businessId: membership.businessId,
        createdBy: membership.user.id,
        pricing,
      });
    const response = API_RESPONSE.deliveryPricingUpdated;
    return SuccessResult(
      res,
      response.message,
      { deliveryPricing },
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

export { DeliveryPricingRouter };
