import type {
  InferInsertModel,
  InferSelectModel,
} from "drizzle-orm";
import type { Request } from "express";
import { payments } from "@/db/schemas/payments.schema";
import {
  PaymentStatus,
  PaymentMethod,
} from "@/data/enums";

export type Payment = InferSelectModel<typeof payments>;

export type NewPayment = InferInsertModel<typeof payments>;

export type PaymentIdParam = {
  paymentId: string;
};

export type PaymentMerchantIdParam = {
  merchantId: string;
};

export interface CreatePaymentDto {
  amount: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
}

export type CreatePaymentRequest = Request<
  PaymentMerchantIdParam,
  unknown,
  CreatePaymentDto[]
>;