import Router from "express";
import {
    getAllPaymentsValidator,
    getPaymentByIdValidator,
    createPaymentValidator
}

const router = Router();

router.get(":merchantId", getAllPaymentsValidator, getAllPayments);
router.get("/:merchantId/:paymentId", getPaymentByIdValidator, getPaymentById);
router.post("/:merchantId", createPaymentValidator, createPayment);

export default router;