import {
  CreateMerchantDto,
  Merchant,
  UpdateMerchantDto,
} from "@/data/types/Merchant";
import { ApiError } from "@/utils/errors/ApiError";
import { StatusCodes } from "http-status-codes";
import {
  getAllMerchants,
  getMerchantById,
  getMerchantByGstNumber,
  createMerchant,
  updateMerchant,
  deleteMerchantById,
} from "../repositories/merchant.repository";
import { request as requestVerification } from "@/app/services/verification.service";

export const getAll = async (): Promise<Merchant[]> => {
  const allMerchants: Merchant[] = await getAllMerchants();
  return allMerchants;
};

export const getById = async (id: string): Promise<Merchant> => {
  const merchant: Merchant | null = await getMerchantById(id);
  if (!merchant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Merchant with id: ${id} does not exist`,
    );
  }
  return merchant;
};

export const getByGstNumber = async (gstNumber: string): Promise<Merchant> => {
  const merchant: Merchant | null = await getMerchantByGstNumber(gstNumber);
  if (!merchant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Merchant with GST number: ${gstNumber} does not exist`,
    );
  }
  return merchant;
};

export const create = async (merchantData: CreateMerchantDto): Promise<Merchant> => {
  const existingMerchant: Merchant | null = await getMerchantByGstNumber(merchantData.gstNumber);
  if (existingMerchant) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `Merchant with GST number: ${merchantData.gstNumber} already exists`,
    );
  }

  const newMerchant: Merchant | null = await createMerchant(merchantData);
  if (!newMerchant) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create merchant",
    );
  }
  return newMerchant;
};

// new verification is created on merchat update, so we need to trigger the pipeline here
export const update = async (id: string, newMerchantData: UpdateMerchantDto): Promise<Merchant> => {
  const updatedMerchant = await updateMerchant(id, newMerchantData);
  if (!updatedMerchant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Merchant with id: ${id} does not exist`,
    );
  }

  await requestVerification({
    merchantId: updatedMerchant.id,
  });

  return updatedMerchant;
};

export const deleteById = async (id: string): Promise<Merchant> => {
  const deletedMerchant: Merchant | null = await deleteMerchantById(id);
  if (!deletedMerchant) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      `Merchant with id: ${id} does not exist`,
    );
  }
  return deletedMerchant;
};
