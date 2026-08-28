import Router from "express";
import {
    createVerification,
    getVerificationById,
    getAllVerifications,
} from "@/app/controllers/verification.controller";
const router = Router();

router.get("/:merchantId", getAllVerifications);
router.get("/:merchantId/:verificationId", getVerificationById);
router.post("/:merchantId", createVerification);

export default router;