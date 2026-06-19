import { Router } from "express";
import { V1Router } from "./v1";

const ApiRouter = Router();
ApiRouter.use("/v1", V1Router);

export { ApiRouter };
