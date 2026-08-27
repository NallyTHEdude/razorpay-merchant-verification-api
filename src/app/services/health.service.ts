  import { ApiError } from "@/utils/errors/ApiError";
  import { StatusCodes } from "http-status-codes";
  import { healthCheckRepository } from "@/app/repositories/health.repository";

  export const healthCheckService = async () => {
    const data: Map<string, boolean> = await healthCheckRepository();

    data.forEach((value, key) => {
      if (!value) {
        throw new ApiError(
          StatusCodes.SERVICE_UNAVAILABLE,
          "Health check failed",
          [{ message: `Service ${key} is not healthy` }],
        );
      }
    });
    return data;
  };