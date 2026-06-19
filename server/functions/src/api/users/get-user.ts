import { Router } from "express";
import { UserService } from "../../shared/services/user.service";
import {
    asyncHandler,
    ErrorResult,
    SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";

const getUserRouter = Router();

getUserRouter.get(
    "/:id",
    asyncHandler(async (req, res) => {
        const requestedUserId = req.params.id;
        const currentUserId = req.currentUser?.uid;

        if (!currentUserId || requestedUserId !== currentUserId) {
            const error = API_RESPONSE.unauthorized;
            return ErrorResult(res, error.statusCode, error.message, error.code);
        }

        const user = await UserService.getUser(requestedUserId);
        if (!user) {
            const error = API_RESPONSE.userNotFound;
            return ErrorResult(res, error.statusCode, error.message, error.code);
        }

        const response = API_RESPONSE.userFetched;
        return SuccessResult(
            res,
            response.message,
            { user },
            response.statusCode,
            response.code,
        );
    }),
);

export { getUserRouter };