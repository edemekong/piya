import { Router, type Response } from "express";
import {
  updateAvailabilityScheduleSchema,
  UpdateAvailabilityScheduleBody,
} from "../../shared/schema/availability.schema";
import { AvailabilityService } from "../../shared/services/availability.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const AvailabilityRouter = Router();

AvailabilityRouter.get(
  "/primary",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const availability = await AvailabilityService.getPrimaryAvailability(
      membership.businessId,
    );
    const response = API_RESPONSE.availabilityFetched;
    return SuccessResult(
      res,
      response.message,
      { availability },
      response.statusCode,
      response.code,
    );
  }),
);

AvailabilityRouter.patch(
  "/primary",
  validateRequest({ body: updateAvailabilityScheduleSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const schedule = req.body as UpdateAvailabilityScheduleBody;
    const availability = await AvailabilityService.upsertPrimaryAvailability({
      businessId: membership.businessId,
      createdBy: membership.user.id,
      schedule,
    });
    const response = API_RESPONSE.availabilityUpdated;
    return SuccessResult(
      res,
      response.message,
      { availability },
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
  return ErrorResult(
    res,
    response.statusCode,
    response.message,
    response.code,
  );
}

export { AvailabilityRouter };
