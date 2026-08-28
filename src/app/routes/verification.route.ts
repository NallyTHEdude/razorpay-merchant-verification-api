import Router from "express";
import {
    createVerification,
    getVerificationById,
    getAllVerifications,
} from "@/app/controllers/verification.controller";
import { validate } from "@/app/middlewares/validate.middleware";
import {
    createVerificationValidator,
    getVerificationByIdValidator,
} from "@/app/validators/verification.validator";

const router = Router();

router.get("/:merchantId", getAllVerifications);
router.get("/:merchantId/:verificationId", validate(getVerificationByIdValidator), getVerificationById);
router.post("/:merchantId", validate(createVerificationValidator), createVerification);

export default router;