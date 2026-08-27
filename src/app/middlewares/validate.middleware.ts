import { ApiError } from "@/utils/errors/ApiError";
import { RequestHandler } from "express";
import { ValidationChain, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";

export const validate = (validators: ValidationChain[]): RequestHandler => {
  return async (req, _res, next) => {
    await Promise.all(validators.map((validator) => validator.run(req)));

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const details = errors.array().map((error) => ({
        field: "path" in error ? error.path : undefined,
        message: error.msg,
      }));

      return next(
        new ApiError(StatusCodes.BAD_REQUEST, "Validation failed", details),
      );
    }

    next();
  };
};
