import { Router } from "express";
import { updateUserSchema, UpdateUserBody } from "../../shared/schema/user.schema";
import { UserService } from "../../shared/services/user.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const updateUserRouter = Router();

updateUserRouter.patch(
  "/",
  validateRequest({ body: updateUserSchema }),
  asyncHandler(async (req, res) => {
    const currentUser = req.currentUser;

    if (!currentUser) {
      const error = API_RESPONSE.unauthorized;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const updatedUser = await UserService.updateUser(
      currentUser.uid,
      req.body as UpdateUserBody,
    );

    if (!updatedUser) {
      const error = API_RESPONSE.userNotFound;
      return ErrorResult(res, error.statusCode, error.message, error.code);
    }

    const response = API_RESPONSE.userUpdated;
    return SuccessResult(
      res,
      response.message,
      { user: updatedUser },
      response.statusCode,
      response.code,
    );
  }),
);

export { updateUserRouter };
