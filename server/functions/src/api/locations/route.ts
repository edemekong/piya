import { Router } from "express";
import {
  getLocationDetailsSchema,
  searchLocationsSchema,
  type GetLocationDetailsBody,
  type SearchLocationsBody,
} from "../../shared/schema/location.schema";
import { LocationService } from "../../shared/services/location.service";
import {
  asyncHandler,
  ErrorResult,
  SuccessResult,
} from "../../shared/utils/api-response";
import { API_RESPONSE } from "../../shared/utils/constants";
import { validateRequest } from "../../shared/utils/validator";

const LocationRouter = Router();

LocationRouter.post(
  "/search",
  validateRequest({ body: searchLocationsSchema }),
  asyncHandler(async (req, res) => {
    const input = req.body as SearchLocationsBody;
    const predictions = await LocationService.fetchLocationPredictions(
      input.input,
      { origin: input.origin }
    );
    const response = API_RESPONSE.locationPredictionsFetched;
    return SuccessResult(
      res,
      response.message,
      { predictions },
      response.statusCode,
      response.code
    );
  })
);

LocationRouter.post(
  "/details",
  validateRequest({ body: getLocationDetailsSchema }),
  asyncHandler(async (req, res) => {
    const input = req.body as GetLocationDetailsBody;
    const location = await LocationService.fetchLocationFromPlaceId(
      input.placeId
    );
    if (!location) {
      const response = API_RESPONSE.locationNotFound;
      return ErrorResult(
        res,
        response.statusCode,
        response.message,
        response.code
      );
    }

    const response = API_RESPONSE.locationFetched;
    return SuccessResult(
      res,
      response.message,
      { location },
      response.statusCode,
      response.code
    );
  })
);

export { LocationRouter };
