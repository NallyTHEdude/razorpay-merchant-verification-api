import {
  createMerchant,
  deleteMerchant,
  getAllMerchants,
  getMerchantByGstNumber,
  getMerchantById,
  updateMerchant,
} from "@/app/controllers/merchant.controller";
import { validate } from "@/app/middlewares/validate.middleware";
import {
  createMerchantValidator,
  deleteMerchantValidator,
  getMerchantByGstNumberValidator,
  getMerchantByIdValidator,
  updateMerchantValidator,
} from "@/app/validators/merchant.validator";
import Router from "express";

const router = Router();

router.get("/", getAllMerchants);
router.get("/gst/:gstNumber",validate(getMerchantByGstNumberValidator),getMerchantByGstNumber,);
router.get("/:id", validate(getMerchantByIdValidator), getMerchantById);
router.post("/", validate(createMerchantValidator), createMerchant);
router.patch("/:id", validate(updateMerchantValidator), updateMerchant);
router.delete("/:id", validate(deleteMerchantValidator), deleteMerchant);

export default router;