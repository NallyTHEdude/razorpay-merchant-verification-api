import Busboy from "busboy";
import type { NextFunction, Request, Response } from "express";

import { uploadDocument } from "@/app/repositories/document.repository";
import { validateDocument } from "@/app/validators/document.validator";
import { CloudinaryFolderName } from "@/data/enums/cloudinary.enums";
import { ApiError } from "@/utils/errors/ApiError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export const documentUpload = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const busboy = Busboy({
    headers: req.headers,
    limits: {
      files: 1,
      fileSize: 10 * 1024 * 1024,
    },
  });

  let fileReceived = false;
  let fileTooLarge = false;
  let failed = false;
  let uploadPromise: Promise<Awaited<ReturnType<typeof uploadDocument>>> | null =null;
  const fail = (error: unknown) => {
    if (failed) return;

    failed = true;
    next(error);
  };

  busboy.on("file", (_fieldName, file, info) => {
    fileReceived = true;

    file.on("limit", () => {
      fileTooLarge = true;
      file.unpipe();
      file.destroy(new Error("File too large"));
    });

    try {
      validateDocument(info.filename, info.mimeType);

      const merchantId = req.params.merchantId;
      const normalizedMerchantId = Array.isArray(merchantId)
        ? merchantId[0]
        : merchantId;

      if (!normalizedMerchantId || normalizedMerchantId.trim() === "") {
        file.resume();
        fail(new ApiError(StatusCodes.BAD_REQUEST, "Merchant ID is required"));
        return;
      }

        uploadPromise = uploadDocument(file, {
            folder: CloudinaryFolderName.MERCHANT_DOCUMENTS,
            subFolder: normalizedMerchantId,
            originalFilename: info.filename,
        });
    } catch (error) {
      file.resume();
      fail(error);
    }
  });

  busboy.on("finish", async () => {
    if (failed) return;

    if (!fileReceived) {
      fail(new ApiError(StatusCodes.BAD_REQUEST, "Document is required"));
      return;
    }

    if (fileTooLarge) {
      fail(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          "File size must not exceed 10 MB",
        ),
      );
      return;
    }

    try {
      if (uploadPromise) {
        const uploadResult = await uploadPromise;

        if (failed) return;

        req.documentUploadResult = uploadResult;
      }

      next();
    } catch (error) {
      fail(error);
    }
  });

  busboy.on("error", (error) => {
    fail(error);
  });

  req.pipe(busboy);
};