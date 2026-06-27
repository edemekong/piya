import { Router } from "express";
import { teamRouter } from "./team";

const BusinessRouter = Router();

BusinessRouter.use(teamRouter);

export { BusinessRouter };
