import {
    createVerification,
    getAllVerifications,
    getByVerificationId
} from "@/app/repositories/verification.repository";
import {
    getMerchantById
} from "@/app/repositories/merchant.repository";
import { RiskLevel, VerificationStatus } from "@/data/enums/db.enums";
import { Merchant } from "@/data/types/Merchant";
import { StatusCodes } from "http-status-codes/build/cjs/status-codes";
import { ApiError } from "@/utils/errors/ApiError";
import { NewVerification, Verification } from "@/data/types/Verification";


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

// TODO: implement inngest pipeline for verification
export const create = async (createVerificationDto: { merchantId: string }): Promise<Verification> => {
    const merchant: Merchant | null = await getMerchantById(createVerificationDto.merchantId);
    if (!merchant) {
        throw new ApiError(
            StatusCodes.NOT_FOUND,
            `Merchant with id: ${createVerificationDto.merchantId} does not exist`,
        )
    }
    // dummy data for now
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

    const createdVerification: Verification | null = await createVerification(dummyVerificationData);
    if (!createdVerification) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to create verification for merchant with id: ${createVerificationDto.merchantId}`,
        )
    }
    return createdVerification;
};