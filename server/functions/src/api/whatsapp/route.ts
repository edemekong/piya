import { Router, type Response } from "express";
import {
  completeWhatsAppConnectionSchema,
  CompleteWhatsAppConnectionBody,
  metaWebhookVerificationQuerySchema,
  MetaWebhookVerificationQuery,
  sendWhatsAppMessageSchema,
  SendWhatsAppMessageBody,
} from "../../shared/schema/whatsapp.schema";
import { BusinessTeamService } from "../../shared/services/team.service";
import { WhatsAppService } from "../../shared/services/whatsapp.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE, STATUS_CODES } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const PublicWhatsAppRouter = Router();
const ProtectedWhatsAppRouter = Router();

PublicWhatsAppRouter.get(
  "/webhook",
  validateRequest({ query: metaWebhookVerificationQuerySchema }),
  (req, res) => {
    const query = req.query as MetaWebhookVerificationQuery;
    const isVerified = WhatsAppService.verifyWebhookToken(
      query["hub.mode"],
      query["hub.verify_token"],
    );

    if (!isVerified || !query["hub.challenge"]) {
      return sendError(res, API_RESPONSE.whatsappWebhookRejected);
    }

    return res.status(STATUS_CODES.ok).send(query["hub.challenge"]);
  },
);

PublicWhatsAppRouter.post(
  "/webhook",
  asyncHandler(async (req, res) => {
    const isVerified = WhatsAppService.verifyWebhookSignature(
      req.headers["x-hub-signature-256"] as string | undefined,
      req.rawBody,
    );
    if (!isVerified) return sendError(res, API_RESPONSE.whatsappWebhookRejected);

    const result = await WhatsAppService.processWebhook(req.body);
    const response = API_RESPONSE.whatsappWebhookReceived;
    return SuccessResult(
      res,
      response.message,
      result,
      response.statusCode,
      response.code,
    );
  }),
);

ProtectedWhatsAppRouter.get(
  "/connection",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const connection = await WhatsAppService.getConnection(
      membership.businessId,
    );
    const response = API_RESPONSE.whatsappConnectionFetched;
    return SuccessResult(
      res,
      response.message,
      connection,
      response.statusCode,
      response.code,
    );
  }),
);

ProtectedWhatsAppRouter.post(
  "/connection/complete",
  validateRequest({ body: completeWhatsAppConnectionSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const body = req.body as CompleteWhatsAppConnectionBody;
    const connection = await WhatsAppService.completeConnection(
      membership.businessId,
      body,
    );
    const response = API_RESPONSE.whatsappConnectionCompleted;
    return SuccessResult(
      res,
      response.message,
      connection,
      response.statusCode,
      response.code,
    );
  }),
);

ProtectedWhatsAppRouter.post(
  "/connection/disconnect",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const connection = await WhatsAppService.disconnectConnection(
      membership.businessId,
    );
    const response = API_RESPONSE.whatsappConnectionDisconnected;
    return SuccessResult(
      res,
      response.message,
      connection,
      response.statusCode,
      response.code,
    );
  }),
);

ProtectedWhatsAppRouter.post(
  "/messages",
  validateRequest({ body: sendWhatsAppMessageSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const body = req.body as SendWhatsAppMessageBody;
    const result = await WhatsAppService.sendTextMessage(
      membership.businessId,
      body,
    );
    if (!result) return sendError(res, API_RESPONSE.whatsappConnectionNotFound);

    const response = API_RESPONSE.whatsappMessageSent;
    return SuccessResult(
      res,
      response.message,
      result,
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

export { ProtectedWhatsAppRouter, PublicWhatsAppRouter };
