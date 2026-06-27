import { Router } from "express";
import { slugRouter } from "./slug";
import { teamRouter } from "./team";

const BusinessRouter = Router();

BusinessRouter.use(slugRouter);
BusinessRouter.use(teamRouter);

export { BusinessRouter };
