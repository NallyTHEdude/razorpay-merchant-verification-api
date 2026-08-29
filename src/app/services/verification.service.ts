import {
    createVerification,
    getAllVerifications,
    getByVerificationId
} from "@/app/repositories/verification.repository";
import { getAllPayments } from "@/app/repositories/payment.repository";
import {
    getMerchantById
} from "@/app/repositories/merchant.repository";
import { RiskLevel, VerificationStatus } from "@/data/enums/db.enums";
import { Merchant } from "@/data/types/Merchant";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { ApiError } from "@/utils/errors/ApiError";
import { NewVerification, Verification } from "@/data/types/Verification";
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
export const create = async (createVerificationDto: { merchantId: string }): Promise<Verification> => {
    const merchant: Merchant | null = await getMerchantById(createVerificationDto.merchantId);
    if (!merchant) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Merchant with id: ${createVerificationDto.merchantId} does not exist`,
        )
    }

    // upload dummy data first
    const dummyVerificationData: NewVerification | null = {
        merchantId: createVerificationDto.merchantId,
        verificationStatus: VerificationStatus.PENDING,
        isGstNumberVerified: false,
        isWebsiteVerified: false,
        isPhoneNumberVerified: false,
        riskLevel: RiskLevel.VERY_HIGH,
        trustscore: 0,
        createdAt: new Date(),
    };
    const createdVerificationData: Verification | null = await createVerification(dummyVerificationData);
    if (!createdVerificationData) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to create verification for merchant with id: ${createVerificationDto.merchantId}`,
        )
    }

    // TODO: do not fetch all payments, fetch most recent 100 payments in production, this is just for testing purposes
    const merchantPayments = await getAllPayments(createVerificationDto.merchantId);

    // trigger the verification pipeline using Inngest
    inngestClient.send({
      name: "verification/created",
      data: {
        merchant: merchant,
        verification: createdVerificationData,
        recentPayments: merchantPayments
      },
    });

    return createdVerificationData;
};