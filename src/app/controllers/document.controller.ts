import { type DocumentMerchantIdParam } from "@/data/types/Document";
import { ApiError } from "@/utils/errors/ApiError";
import { ApiResponse } from "@/utils/response/ApiResponse";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export const uploadMerchantDocument = asyncHandler(
  async (req: Request<DocumentMerchantIdParam>, res: Response) => {
    const uploadResult = req.documentUploadResult;

    if (!uploadResult) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "No document was uploaded");
    }

    new ApiResponse(
      StatusCodes.OK,
      uploadResult,
      "Document uploaded successfully",
    ).send(res);
  },
);
