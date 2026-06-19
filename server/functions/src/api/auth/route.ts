import { Router } from "express";
import { requestOTPRoute } from "./request-otp";
import { verifyAuthOTPRoute } from "./verify-auth-otp";

const AuthRouter = Router();

AuthRouter.use(requestOTPRoute);
AuthRouter.use(verifyAuthOTPRoute);

export { AuthRouter };
