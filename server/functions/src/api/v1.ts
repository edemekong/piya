import { Router } from "express";
import { AuthMiddleware } from "../middlewares/middleware";
import { STATUS_CODES } from "../shared/utils/constants";
import { AuthRouter } from "./auth/route";
import { DevRouter } from "./dev/route";
import { UserRouter } from "./users/route";

const V1Router = Router();

V1Router.get("/health", (req, res) => {
  return res.status(STATUS_CODES.ok).send("OK");
});

V1Router.use("/auth", AuthRouter);
V1Router.use("/dev", DevRouter);

V1Router.use(AuthMiddleware);
V1Router.use("/users", UserRouter);

export { V1Router };
