import Router from "express";
import {
    getAllPaymentsValidator,
    getPaymentByIdValidator,
    createPaymentValidator
} from "@/app/validators/payment.validator";
import {
    getAllPayments,
    getPaymentById,
    createPayments
} from "@/app/controllers/payment.controller";

const router = Router();

router.get(":merchantId", getAllPaymentsValidator, getAllPayments);
router.get("/:merchantId/:paymentId", getPaymentByIdValidator, getPaymentById);
router.post("/:merchantId", createPaymentValidator, createPayments);

export default router;