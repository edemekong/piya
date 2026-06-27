import { Router } from "express";
import {
  accountSetupBrandDetailsSchema,
  accountSetupBusinessProfileSchema,
  accountSetupCompleteSchema,
  accountSetupIntegrationSchema,
  accountSetupPersonalInfoSchema,
  accountSetupStepSchema,
  AccountSetupStepQuery,
} from "../../shared/schema/account-setup.schema";
import { BusinessService } from "../../shared/services/business.service";
import { UserService } from "../../shared/services/user.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";
import { parseBody } from "../../shared/utils/zod";

const accountSetupRouter = Router();

accountSetupRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;

    if (!currentUser) {
      const error = API_RESPONSE.unauthorized;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const user = await UserService.getUser(currentUser.uid);

    if (!user) {
      const error = API_RESPONSE.userNotFound;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const businessId = user.business?.businessIds[0];

    const business = await BusinessService.getBusiness(businessId);
    const branding = await BusinessService.getBusinessBranding(businessId);
    const channelSettings =
      await BusinessService.getChannelSettings(businessId);

    const accountSetupBusiness = business
      ? { ...business, branding: branding ?? business.branding ?? null }
      : null;

    const response = API_RESPONSE.accountSetupFetched;

    return SuccessResult(
      res,
      response.message,
      { business: accountSetupBusiness, channelSettings, user },
      response.statusCode,
      response.code,
    );
  }),
);

accountSetupRouter.patch(
  "/",
  validateRequest({ query: accountSetupStepSchema }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;

    if (!currentUser) {
      const error = API_RESPONSE.unauthorized;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const { step } = req.query as AccountSetupStepQuery;
    const user = await UserService.getUser(currentUser.uid);

    if (!user) {
      const error = API_RESPONSE.userNotFound;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    if (step === "personal-info") {
      const body = parseBody(accountSetupPersonalInfoSchema, req.body);

      const updatedUser = await UserService.updateAccountSetupPersonalInfo(
        currentUser.uid,
        body,
      );

      const response = API_RESPONSE.accountSetupUpdated;
      return SuccessResult(
        res,
        response.message,
        { user: updatedUser },
        response.statusCode,
        response.code,
      );
    }

    if (step === "business-profile") {
      const body = parseBody(accountSetupBusinessProfileSchema, req.body);

      const result = await BusinessService.upsertBusinessProfileForUser(
        user,
        body,
      );

      const response = API_RESPONSE.accountSetupUpdated;
      return SuccessResult(
        res,
        response.message,
        result,
        response.statusCode,
        response.code,
      );
    }

    if (step === "brand-details") {
      const body = parseBody(accountSetupBrandDetailsSchema, req.body);

      const businessId = user.business?.businessIds[0];
      if (!businessId) {
        const error = API_RESPONSE.accountSetupIncomplete;
        return ErrorResult(res, error.statusCode, error.message, error.code);
      }

      const member = await BusinessService.getMember(
        businessId,
        currentUser.uid,
      );

      if (!member) {
        const error = API_RESPONSE.accountSetupIncomplete;
        return ErrorResult(res, error.statusCode, error.message, error.code);
      }

      const business = await BusinessService.updateBusinessBranding(
        businessId,
        body,
      );

      if (!business) {
        const error = API_RESPONSE.businessNotFound;
        return ErrorResult(res, error.statusCode, error.message, error.code);
      }

      const response = API_RESPONSE.accountSetupUpdated;
      return SuccessResult(
        res,
        response.message,
        { business, user },
        response.statusCode,
        response.code,
      );
    }

    if (step === "integration") {
      const body = parseBody(accountSetupIntegrationSchema, req.body);
      const businessId = user.business?.businessIds[0];

      if (!businessId) {
        const error = API_RESPONSE.accountSetupIncomplete;
        return ErrorResult(res, error.statusCode, error.message, error.code);
      }

      const result = await BusinessService.updateBusinessIntegrations(
        businessId,
        body,
      );

      if (!result) {
        const error = API_RESPONSE.businessNotFound;
        return ErrorResult(res, error.statusCode, error.message, error.code);
      }

      const response = API_RESPONSE.accountSetupUpdated;
      return SuccessResult(
        res,
        response.message,
        { ...result, user },
        response.statusCode,
        response.code,
      );
    }

    parseBody(accountSetupCompleteSchema, req.body);

    const completion = await UserService.getAccountSetupCompletion(
      currentUser.uid,
    );

    if (!completion.success) {
      const error = API_RESPONSE.accountSetupIncomplete;

      return ErrorResult(
        res,
        error.statusCode,
        completion.message ?? error.message,
        error.code,
      );
    }

    const completedUser = await UserService.completeAccountSetup(
      currentUser.uid,
    );
    const response = API_RESPONSE.accountSetupCompleted;
    return SuccessResult(
      res,
      response.message,
      { business: completion.business, user: completedUser },
      response.statusCode,
      response.code,
    );
  }),
);

export { accountSetupRouter };
