import { Router } from "express";
import type { UserData } from "../../shared/model/user";
import { createUserSchema, CreateUserBody } from "../../shared/schema/user.schema";
import { UserService } from "../../shared/services/user.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";
import { getUTCTimeNow } from "../../shared/utils/helpers/helper-functions";

const createUserRouter = Router();

createUserRouter.post(
  "/",
  validateRequest({ body: createUserSchema }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;

    if (!currentUser) {
      const error = API_RESPONSE.unauthorized;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const now = getUTCTimeNow();

    const existingUser = await UserService.getUser(currentUser.uid);
    const body = req.body as CreateUserBody;

    const user: UserData = {
      id: currentUser.uid,
      email: body.email ?? currentUser.email ?? "",
      phoneNumber: body.phoneNumber ?? currentUser.phoneNumber ?? null,
      name: body.name ?? currentUser.displayName ?? "",
      profileImageUrl: body.profileImageUrl ?? currentUser.photoURL ?? "",
      accountSetupCompleted: body.accountSetupCompleted ?? false,
      dob: body.dob ?? null,
      gender: body.gender ?? null,
      business: body.business ?? null,
      verification: {
        emailVerified:
          body.verification?.emailVerified ?? currentUser.emailVerified,
        phoneVerified:
          body.verification?.phoneVerified ?? Boolean(currentUser.phoneNumber),
        authProviders:
          body.verification?.authProviders ??
          currentUser.providerData.map((provider) => provider.providerId),
      },
      lastKnownLocation: body.lastKnownLocation ?? null,
      settings: body.settings ?? {
        notifications: {
          pushEnabled: true,
          emailEnabled: true,
          smsEnabled: true,
        },
      },
      createdAt: existingUser?.createdAt ?? now,
      updatedAt: now,
    };

    const createdUser = await UserService.createUser(user);
    const response = API_RESPONSE.userCreated;
    return SuccessResult(
      res,
      response.message,
      { user: createdUser },
      response.statusCode,
      response.code,
    );
  }),
);

export { createUserRouter };
