import { param } from "express-validator";

export const getAllPaymentsValidator = [
    param("merchantId")
        .trim()
        .notEmpty()
        .withMessage("Merchant ID is required")
        .isUUID()
        .withMessage("Invalid merchant ID"),
];

export const getPaymentByIdValidator = [
    param("merchantId")
        .trim()
        .notEmpty()
        .withMessage("Merchant ID is required")
        .isUUID()
        .withMessage("Invalid merchant ID"),
    param("paymentId")
        .trim()
        .notEmpty()
        .withMessage("Payment ID is required")
        .isUUID()
        .withMessage("Invalid payment ID"),
];

export const createPaymentValidator = [
    param("merchantId")
        .trim()
        .notEmpty()
        .withMessage("Merchant ID is required")
        .isUUID()
        .withMessage("Invalid merchant ID"),
];