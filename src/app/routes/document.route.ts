import Router from "express";
import { documentUpload } from "@/app/middlewares/document.middleware";
import { uploadMerchantDocument } from "@/app/controllers/document.controller";
const router = Router();

router.post("/:merchantId", documentUpload, uploadMerchantDocument);


export default router;