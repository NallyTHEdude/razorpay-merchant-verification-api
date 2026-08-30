import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
// import type { VerificationStatus, RiskLevel } from "@/data/enums/db.enums";
import type { verifications } from "@/db/schemas/verifications.schema";

export type Verification = InferSelectModel<typeof verifications>;

export type NewVerification = InferInsertModel<typeof verifications>;

export type VerificationIdParam = {
  verificationId: string;
};

export type VerificationMerchantIdParam = {
  merchantId: string;
};

export interface RequestVerificationDto {
  merchantId: string;
}
