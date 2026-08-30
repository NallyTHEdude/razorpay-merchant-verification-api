import {
  getAllVerifications,
  getByVerificationId,
  createVerification,
} from "@/app/repositories/verification.repository";
import {
    getMerchantById
} from "@/app/repositories/merchant.repository";
import { Merchant } from "@/data/types/Merchant";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { ApiError } from "@/utils/errors/ApiError";
import { Verification, RequestVerificationDto } from "@/data/types/Verification";
import { RiskLevel, VerificationStatus } from "@/data/enums/db.enums";
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
export const request = async (requestVerificationDto: RequestVerificationDto): Promise<Verification> => {
  const { merchantId } = requestVerificationDto;
  if (!merchantId) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Merchant ID is required",
    );
  }

  // Get merchant
  const merchant = await getMerchantById(merchantId);
  if (!merchant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Merchant with id: ${merchantId} does not exist`,
    );
  }

  // Create pending verification
  try {
    const verification = await createVerification({
      merchantId: merchant.id,
      verificationStatus: VerificationStatus.PENDING,
      isGstNumberVerified: false,
      isPhoneNumberVerified: false,
      isWebsiteVerified: false,
      riskLevel: RiskLevel.VERY_HIGH,
      trustscore: 0,
      createdAt: new Date(),
    });

    if (!verification) {
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed to create verification for merchant ${merchant.id}`,
      );
    }

    // Trigger asynchronous verification pipeline
    await inngestClient.send({
      name: "verification/requested",
      data: {
        merchant,
        verificationId: verification.id,
      },
    });

    return verification;
  } catch (error: any) {
    const pgError = error.cause ?? error;
    // PostgreSQL unique constraint violation
    if (pgError.code === "23505" && pgError.constraint === "one_pending_verification_per_merchant") {
      throw new ApiError(
        StatusCodes.CONFLICT,
        "Pending verification already exists, please wait until it is finished",
      );
    }

    throw error;
  }
};