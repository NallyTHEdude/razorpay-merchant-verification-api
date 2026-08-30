import { Merchant } from "@/data/types/Merchant";
import { Verification } from "@/data/types/Verification";
import { Payment } from "@/data/types/Payment";
import { RiskLevel, VerificationStatus } from "@/data/enums/db.enums";

export type VerificationResults = {
  isPhoneNumberVerified: boolean;
  isGstNumberVerified: boolean;
  isWebsiteVerified: boolean;
};

export type MLPredictionData = {
  paymentCount: number;
  averagePaymentAmount: number;
  failedPaymentRate: number;
  highValuePaymentRate: number;
  internationalPaymentRate: number;
  isGstNumberVerified: boolean;
  isPhoneNumberVerified: boolean;
  isWebsiteVerified: boolean;
  fraudProbability: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
};

export type WebsiteData = {
  url: string;
  businessName?: string;
  contactInformation?: string;
  physicalAddress?: string;
  productsOrServices?: string;
  policies?: {
    privacyPolicy?: string;
    termsAndConditions?: string;
    refundPolicy?: string;
  };
  scrapedAt: string;
};

export type WebsiteVerificationResult = {
  websiteData: WebsiteData | null;
  isWebsiteVerified: boolean;
};

export type PipelineResults = {
  merchant: Merchant;
  verification: Verification;
  recentPayments: Payment[];

  isPhoneNumberVerified: boolean;
  isGstNumberVerified: boolean;
  isWebsiteVerified: boolean;

  websiteData: WebsiteData | null;

  mlPredictionData: MLPredictionData;
};

export type VerificationUpdateData = {
  verificationStatus: VerificationStatus;
  isPhoneNumberVerified: boolean;
  isGstNumberVerified: boolean;
  isWebsiteVerified: boolean;
  trustscore: number;
  riskLevel: RiskLevel;
};
