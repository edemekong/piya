import { Router } from "express";
import { AuthMiddleware } from "../middlewares/middleware";
import { STATUS_CODES } from "../shared/utils/constants";
import { AvailabilityRouter } from "./availability/route";
import { AuthRouter } from "./auth/route";
import { BadgeRouter } from "./badges";
import { BusinessRouter } from "./businesses/route";
import { ContactRouter } from "./contacts/route";
import { DeliveryPricingRouter } from "./delivery-pricing/route";
import { DevRouter } from "./dev/route";
import { DiscountRouter } from "./discounts/route";
import { GiftRouter } from "./gifts/route";
import { LeadRequestRouter } from "./lead-requests/route";
import { LocationRouter } from "./locations/route";
import { OfferingRouter } from "./offerings/route";
import { UserRouter } from "./users/route";
import {
  ProtectedWhatsAppRouter,
  PublicWhatsAppRouter,
} from "./whatsapp/route";

const V1Router = Router();

V1Router.get("/health", (req, res) => {
  return res.status(STATUS_CODES.ok).send("OK");
});

V1Router.use("/auth", AuthRouter);
V1Router.use("/dev", DevRouter);
V1Router.use("/lead-requests", LeadRequestRouter);
V1Router.use("/whatsapp", PublicWhatsAppRouter);

V1Router.use(AuthMiddleware);
V1Router.use("/badges", BadgeRouter);
V1Router.use("/businesses", BusinessRouter);
V1Router.use("/contacts", ContactRouter);
V1Router.use("/delivery-pricing", DeliveryPricingRouter);
V1Router.use("/discounts", DiscountRouter);
V1Router.use("/gifts", GiftRouter);
V1Router.use("/locations", LocationRouter);
V1Router.use("/offerings", OfferingRouter);
V1Router.use("/availability", AvailabilityRouter);
V1Router.use("/users", UserRouter);
V1Router.use("/whatsapp", ProtectedWhatsAppRouter);

export { V1Router };
