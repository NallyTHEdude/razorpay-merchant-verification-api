import Router from "express";
import {
    getAllPaymentsValidator,
    getPaymentByIdValidator,
    createPaymentValidator
} from "@/app/validators/payment.validator";
import { validate } from "@/app/middlewares/validate.middleware";
import {
    getAllPayments,
    getPaymentById,
    createPayments
} from "@/app/controllers/payment.controller";

const router = Router();

router.get("/:merchantId", validate(getAllPaymentsValidator), getAllPayments);
router.get("/:merchantId/:paymentId", validate(getPaymentByIdValidator), getPaymentById);
router.post("/:merchantId", validate(createPaymentValidator), createPayments);

export default router;