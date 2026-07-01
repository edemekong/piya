import { Router, type Response } from "express";
import {
  communicationParamsSchema,
  createCommunicationSchema,
  type CommunicationParams,
  type CreateCommunicationBody,
  type UpdateCommunicationBody,
  updateCommunicationSchema,
} from "../../shared/schema/communication.schema";
import { CommunicationService } from "../../shared/services/communication.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const CommunicationRouter = Router();

CommunicationRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const communications = await CommunicationService.getCommunications(
      membership.businessId,
    );
    const response = API_RESPONSE.communicationsFetched;
    return SuccessResult(
      res,
      response.message,
      { communications },
      response.statusCode,
      response.code,
    );
  }),
);

CommunicationRouter.post(
  "/",
  validateRequest({ body: createCommunicationSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const communication = await CommunicationService.createCommunication({
      businessId: membership.businessId,
      createdBy: membership.user.id,
      input: req.body as CreateCommunicationBody,
    });
    const response = API_RESPONSE.communicationCreated;
    return SuccessResult(
      res,
      response.message,
      { communication },
      response.statusCode,
      response.code,
    );
  }),
);

CommunicationRouter.patch(
  "/:communicationId",
  validateRequest({
    body: updateCommunicationSchema,
    params: communicationParamsSchema,
  }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as CommunicationParams;
    const communication = await CommunicationService.updateCommunication({
      businessId: membership.businessId,
      communicationId: params.communicationId,
      input: req.body as UpdateCommunicationBody,
    });
    if (!communication)
      return sendError(res, API_RESPONSE.communicationNotFound);

    const response = API_RESPONSE.communicationUpdated;
    return SuccessResult(
      res,
      response.message,
      { communication },
      response.statusCode,
      response.code,
    );
  }),
);

CommunicationRouter.delete(
  "/:communicationId",
  validateRequest({ params: communicationParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as CommunicationParams;
    const result = await CommunicationService.deleteCommunication({
      businessId: membership.businessId,
      communicationId: params.communicationId,
    });
    if (result === "not-found") {
      return sendError(res, API_RESPONSE.communicationNotFound);
    }

    const response = API_RESPONSE.communicationDeleted;
    return SuccessResult(
      res,
      response.message,
      null,
      response.statusCode,
      response.code,
    );
  }),
);

CommunicationRouter.get(
  "/:communicationId/recipients",
  validateRequest({ params: communicationParamsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const params = req.params as unknown as CommunicationParams;
    const recipients = await CommunicationService.getCommunicationRecipients({
      businessId: membership.businessId,
      communicationId: params.communicationId,
    });

    const response = API_RESPONSE.communicationRecipientsFetched;
    return SuccessResult(
      res,
      response.message,
      { recipients },
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

export { CommunicationRouter };
