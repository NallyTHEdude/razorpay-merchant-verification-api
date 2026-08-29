import { body, param } from "express-validator";

export const createPaymentsValidator = [
    param("merchantId")
        .trim()
        .notEmpty()
        .withMessage("Merchant ID is required")
        .isUUID()
        .withMessage("Invalid merchant ID"),
    body()
        .isArray({ min: 1 })    
        .withMessage("Payments must be a non-empty array"),
    body("*.amount")
        .trim()
        .notEmpty()
        .withMessage("Payment amount is required"),
    body("*.status")
        .trim()
        .notEmpty()
        .withMessage("Payment status is required"),
    body("*.paymentMethod")
        .trim()
        .notEmpty()
        .withMessage("Payment method is required"),
];
