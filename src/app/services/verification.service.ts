import {
    getAllVerifications,
    getByVerificationId
} from "@/app/repositories/verification.repository";
import {
    getMerchantById
} from "@/app/repositories/merchant.repository";
import { Merchant } from "@/data/types/Merchant";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { ApiError } from "@/utils/errors/ApiError";
import { Verification, RequestVerificationDto } from "@/data/types/Verification";
import { inngestClient } from "@/config";

export const getAll = async (merchantId: string): Promise<Verification[]> => {
    const merchant: Merchant | null = await getMerchantById(merchantId);
    if (!merchant) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Merchant with id: ${merchantId} does not exist`,
        )
    }
    const verifications: Verification[] = await getAllVerifications(merchantId);
    return verifications;
}

export const getById = async (merchantId: string, verificationId: string): Promise<Verification> => {
    const merchant: Merchant | null = await getMerchantById(merchantId);
    if (!merchant) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Merchant with id: ${merchantId} does not exist`,
        )
    }
    const verification : Verification | null = await getByVerificationId(merchantId, verificationId);
    if (!verification) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Verification with id: ${verificationId} does not exist`,
        )
    }
    return verification;
}

// create calls the inngest trigger to start pipeline
export const request = async (requestVerificationDto: RequestVerificationDto): Promise<void> => {
  const { merchantId } = requestVerificationDto;

  if (!merchantId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Merchant ID is required",
    );
  }

  const merchant = await getMerchantById(merchantId);

  if (!merchant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Merchant with id: ${merchantId} does not exist`,
    );
  }

  await inngestClient.send({
    name: "verification/requested",
    data: { merchant },
  });
};