import {
    getAll,
    getByVerificationId,
    create
} from "@/app/services/verification.service";
import { Request, Response } from "express";
import { ApiResponse } from "@/utils/response/ApiResponse";
import {StatusCodes} from "http-status-codes";
import type { Verification, CreateVerificationDto, VerificationMerchantIdParam } from "@/data/types/Verification";

export const getAllVerifications = async (req: Request, res: Response) => {
    const { merchantId } = req.params;
    const verifications : Verification[] = await getAll(merchantId);
    new ApiResponse(
        StatusCodes.OK,
        verifications,
        "Verifications fetched successfully"
    ).send(res);
}

export const getVerificationById = async (req: Request, res: Response) => {
    const { merchantId, verificationId } = req.params;
    const verification : Verification = await getByVerificationId(merchantId, verificationId);
    new ApiResponse(
        StatusCodes.OK,
        verification,
        "Verification fetched successfully"
    ).send(res);
}   

export const createVerification = async (req: Request<VerificationMerchantIdParam>, res: Response) => {
  const { merchantId } = req.params;
  const createVerificationDto: CreateVerificationDto = {
    merchantId,
  };
  const verification = await create(createVerificationDto);
  new ApiResponse(
    StatusCodes.CREATED,
    verification,
    "Verification created successfully",
  ).send(res);
};