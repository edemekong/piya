import { Router, type Response } from "express";
import {
  bulkCreateContactsSchema,
  createContactSchema,
  getContactsQuerySchema,
  type BulkCreateContactsBody,
  type CreateContactBody,
  type GetContactsQuery,
} from "../../shared/schema/contact.schema";
import { ContactService } from "../../shared/services/contact.service";
import { BusinessTeamService } from "../../shared/services/team.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const ContactRouter = Router();

ContactRouter.get(
  "/tags",
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const tags = await ContactService.getContactTags(membership.businessId);
    const response = API_RESPONSE.contactTagsFetched;
    return SuccessResult(
      res,
      response.message,
      { tags },
      response.statusCode,
      response.code
    );
  })
);

ContactRouter.get(
  "/",
  validateRequest({ query: getContactsQuerySchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const page = await ContactService.getContacts(
      membership.businessId,
      req.query as unknown as GetContactsQuery
    );
    const response = API_RESPONSE.contactsFetched;
    return SuccessResult(
      res,
      response.message,
      page,
      response.statusCode,
      response.code
    );
  })
);

ContactRouter.post(
  "/",
  validateRequest({ body: createContactSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const result = await ContactService.createContact({
      businessId: membership.businessId,
      createdBy: membership.user.id,
      input: req.body as CreateContactBody,
    });
    if (result.status === "duplicate") {
      return sendError(res, API_RESPONSE.contactAlreadyExists);
    }

    const response = API_RESPONSE.contactCreated;
    return SuccessResult(
      res,
      response.message,
      { contact: result.contact },
      response.statusCode,
      response.code
    );
  })
);

ContactRouter.post(
  "/bulk",
  validateRequest({ body: bulkCreateContactsSchema }),
  asyncHandler(async (req, res) => {
    const membership = await getMembership(req.currentUser?.uid);
    if (!membership) return sendError(res, API_RESPONSE.unauthorized);

    const result = await ContactService.bulkCreateContacts({
      businessId: membership.businessId,
      createdBy: membership.user.id,
      input: req.body as BulkCreateContactsBody,
    });
    const response = API_RESPONSE.contactsBulkCreated;

    return SuccessResult(
      res,
      response.message,
      result,
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

export { ContactRouter };
