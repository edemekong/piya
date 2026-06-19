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

  const domainId = typeof hostname === "object" ? hostname[0] : hostname;

  if (domainId) {
    const brandConfig = await BusinessService.getBrandConfig(domainId);
    
    if (brandConfig) {
      req.tenant = {
        businessId: brandConfig.businessId,
        domain: domainId,
      };
    }
  }

  return next();
};
