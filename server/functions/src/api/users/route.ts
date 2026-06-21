import { Router } from "express";
import { getUserRouter } from "./get-user";
import { createUserRouter } from "./create-user";
import { updateUserRouter } from "./update-user";

const UserRouter = Router();

UserRouter.use("/fetch", getUserRouter);
UserRouter.use("/create", createUserRouter);
UserRouter.use("/update", updateUserRouter);

export { UserRouter };
