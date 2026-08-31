import { eventType } from "inngest";
import { z } from "zod";
import { type Merchant } from "@/data/types/Merchant";

export const verificationRequested = eventType("verification/requested", {
  schema: z.object({
    merchant: z.custom<Merchant>(),
    verificationId: z.string(),
    isMerchantUpdate: z.boolean(),
  }),
});
