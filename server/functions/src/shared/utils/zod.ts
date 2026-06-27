import { z } from "zod";
import { ApiError } from "./api-response";
import { API_RESPONSE } from "./constants";

function parseBody<TSchema extends z.ZodType>(
  schema: TSchema,
  body: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(body);

  if (result.success) {
    return result.data;
  }

  const response = API_RESPONSE.invalidRequest;
  throw new ApiError(
    response.statusCode,
    response.message,
    response.code,
    result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    })),
  );
}

export { parseBody };
