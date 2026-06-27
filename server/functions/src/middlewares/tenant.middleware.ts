import { Request, Response, NextFunction } from "express";
import { BusinessService } from "../shared/services/business.service";

export const TenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const hostname =
    req.headers["x-forwarded-host"] ||
    req.headers["x-tenant-host"] ||
    req.headers.host;

  const tenantHostname = typeof hostname === "object" ? hostname[0] : hostname;

  if (tenantHostname) {
    const brandConfig = await BusinessService.getBrandConfig(tenantHostname);

    if (brandConfig) {
      req.tenant = {
        businessId: brandConfig.businessId,
        hostname: tenantHostname,
      };
    }
  }

  return next();
};
