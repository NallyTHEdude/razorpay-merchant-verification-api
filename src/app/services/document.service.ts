import { uploadDocument } from "@/app/repositories/document.repository";
import { getMerchantById } from "@/app/repositories/merchant.repository";
import { CloudinaryFolderName } from "@/data/enums/cloudinary.enums";
import {
  type UploadGovernmentDto,
  type UploadMerchantDto,
} from "@/data/types/Document";
import { ApiError } from "@/utils/errors/ApiError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export const uploadMerchant = async (data: UploadMerchantDto) => {
  const { fileStream, merchantId, originalFilename } = data;

  if (!merchantId || merchantId.trim() === "") {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Merchant ID is required");
  }

  const merchant = await getMerchantById(merchantId);
  if (!merchant) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Merchant not found");
  }

  const uploadResult = await uploadDocument(fileStream, {
    folder: CloudinaryFolderName.MERCHANT_DOCUMENTS,
    subFolder: merchant.id,
    originalFilename,
  });

  if (!uploadResult) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Document upload failed",
    );
  }

  return uploadResult;
};

export const uploadGovernment = async (data: UploadGovernmentDto) => {
  const { fileStream, originalFilename } = data;

  const uploadResult = await uploadDocument(fileStream, {
    folder: CloudinaryFolderName.GOVERNMENT_DOCUMENTS,
    subFolder: "",
    originalFilename,
  });

  if (!uploadResult) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Document upload failed",
    );
  }

  return uploadResult;
};
