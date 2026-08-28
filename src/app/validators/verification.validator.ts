import {param} from 'express-validator';

// TODO: SETUP PAGINATION AFTER MVP
// export const getAllVerificationsValidator = [
//   param("merchantId")
//     .trim()
//     .notEmpty()
//     .withMessage("Merchant ID is required"),

//   query("page")
//     .optional()
//     .isInt({ min: 1 })
//     .withMessage("Page must be a positive integer"),

//   query("limit")
//     .optional()
//     .isInt({ min: 1, max: 100 })
//     .withMessage("Limit must be between 1 and 100"),
// ];

export const createVerificationValidator = [
  param("merchantId")
    .trim()
    .notEmpty()
    .withMessage("Merchant ID is required")
    .isUUID()
    .withMessage("Invalid merchant ID"),
];

export const getVerificationByIdValidator = [
    param("merchantId")
        .trim()
        .notEmpty()
        .withMessage("Merchant ID is required")
        .isUUID()
        .withMessage("Invalid merchant ID"),
    param("verificationId")
        .trim()
        .notEmpty()
        .withMessage("Verification ID is required")
        .isUUID()
        .withMessage("Invalid verification ID"),
];
