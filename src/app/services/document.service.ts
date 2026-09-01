import { uploadDocument } from "@/app/repositories/document.repository";
import { getMerchantById } from "@/app/repositories/merchant.repository";
import { CloudinaryFolderName } from "@/data/enums/cloudinary.enums";
import { type UploadMerchantDto } from "@/data/types/Document";
import { ApiError } from "@/utils/errors/ApiError";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";

export const uploadMerchant = async (data: UploadMerchantDto) => {
    const { fileBuffer, merchantId } = data;

    const merchant = await getMerchantById(merchantId);
    if(!merchant) {
        throw new ApiError(
            StatusCodes.NOT_FOUND, 
            "Merchant not found"
        );
    }

    const uploadResult = await uploadDocument(fileBuffer, {
        folder: CloudinaryFolderName.MERCHANT_DOCUMENTS,
        subFolder: merchant.id,
    });

    if(!uploadResult) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR, 
            "Document upload failed"
        );
    }

    return uploadResult;
}

