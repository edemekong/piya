import { Router } from "express";
import {
  createLeadRequestSchema,
  type CreateLeadRequestBody,
} from "../../shared/schema/lead-request.schema";
import { LeadRequestService } from "../../shared/services/lead-request.service";
import { asyncHandler, SuccessResult } from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const LeadRequestRouter = Router();

LeadRequestRouter.post(
  "/",
  validateRequest({ body: createLeadRequestSchema }),
  asyncHandler(async (req, res) => {
    const input = req.body as CreateLeadRequestBody;
    const leadRequest = await LeadRequestService.createLeadRequest(input);
    const response = API_RESPONSE.leadRequestCreated;

    return SuccessResult(
      res,
      response.message,
      leadRequest,
      response.statusCode,
      response.code,
    );
  }),
);

export { LeadRequestRouter };
