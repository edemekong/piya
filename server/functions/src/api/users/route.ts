import { Router } from "express";
import { accountSetupRouter } from "./account-setup";
import { getUserRouter } from "./get-user";
import { createUserRouter } from "./create-user";
import { updateUserRouter } from "./update-user";

const UserRouter = Router();

UserRouter.use("/fetch", getUserRouter);
UserRouter.use("/create", createUserRouter);
UserRouter.use("/update", updateUserRouter);
UserRouter.use("/account-setup", accountSetupRouter);

export { UserRouter };
