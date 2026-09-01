import { uploadDocument } from "@/app/repositories/document.repository";
import { getMerchantById } from "@/app/repositories/merchant.repository";
import { CloudinaryFolderName } from "@/data/enums/cloudinary.enums";
import { type UploadMerchantDto } from "@/data/types/Document";
import { ApiError } from "@/utils/errors/ApiError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export const uploadMerchant = async (data: UploadMerchantDto) => {
  const { fileStream, merchantId, originalFilename } = data;

  if (!merchantId) {
    throw new ApiError(
        StatusCodes.BAD_REQUEST, 
        "Merchant ID is required"
    );
  }

  if (!fileStream) {
    throw new ApiError(
        StatusCodes.BAD_REQUEST, 
        "Document stream is required"
    );
  }

  const merchant = await getMerchantById(merchantId);
  if (!merchant) {
    throw new ApiError(
        StatusCodes.NOT_FOUND, 
        "Merchant not found"
    );
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
