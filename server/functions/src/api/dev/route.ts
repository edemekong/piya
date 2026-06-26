import { Router } from "express";
import { EmailPreviewRouter } from "./email-preview";

export const DevRouter = Router();

if (process.env.FUNCTIONS_EMULATOR === "true") {
  DevRouter.use("/email-preview", EmailPreviewRouter);
}
