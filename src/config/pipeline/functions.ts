import { inngestClient } from "./client";

import { verifyPhoneNumber } from "@/app/verification-pipeline/stages/phone-number/phoneNumber.verification";
import { gstNumberVerification } from "@/app/verification-pipeline/stages/gst-number/gstNumber.verification";
import { logRegPrediction } from "@/app/verification-pipeline/stages/ml-prediction/logisticRegression";
import { fetchWebsiteData } from "@/app/verification-pipeline/stages/web-scraper/website.verification";
import { combineResults } from "@/app/verification-pipeline/stages/combine-results/combine-results";
import { updateVerification } from "@/app/verification-pipeline/stages/update-verification/update-verification";

import { PipelineResults } from "@/data/types/pipelineTypes";
import { createVerification } from "@/app/repositories/verification.repository";
import { RiskLevel, VerificationStatus } from "@/data/enums/db.enums";
import { getHundredLatestPaymentsByMerchantId } from "@/app/repositories/payment.repository";

export const merchantPipeline = inngestClient.createFunction(
  {
    id: "verify-merchant",
    triggers: [
      {
        event: "verification/requested",
      },
    ],
  },

  async ({ event, step }) => {
    const {merchant} = event.data;

    // Start verification
    await step.run("start-verification", async () => {
      console.log(`Starting verification for merchant ${merchant.id}`,);
    });

    // by the end of below step we will have: {merchant, verification, recentPayments}
    const {verification, recentPayments} = await step.run("load-context", async () => {
      const newVerification = await createVerification({
        merchantId: merchant.id,
        verificationStatus: VerificationStatus.PENDING,
        isGstNumberVerified: false,
        isPhoneNumberVerified: false,
        isWebsiteVerified: false,
        riskLevel: RiskLevel.VERY_HIGH,
        trustscore: 0,
        createdAt: new Date(),
      });

      if(!newVerification) {
        throw new Error(`Failed to create verification for merchant ${merchant.id}`);
      }

      const recentPayments = await getHundredLatestPaymentsByMerchantId(merchant.id);

      console.log(`Loaded verifiation and payments for merchant ${merchant.id}`);
      return { 
        verification: newVerification, 
        recentPayments 
      };
    });
    // Verify phone number
    const isPhoneNumberVerified = await step.run(
      "verify-phone-number",
      async () => {
        console.log(
          `Verifying phone number for merchant ${merchant.id}`,
        );

        return verifyPhoneNumber(merchant.phoneNumber);
      },
    );

    // Verify GST number
    const isGstNumberVerified = await step.run(
      "verify-gst-number",
      async () => {
        console.log(
          `Verifying GST for merchant ${merchant.id}`,
        );

        return gstNumberVerification(merchant.gstNumber);
      },
    );

    // Investigate website and collect evidence
    const { websiteData, isWebsiteVerified } = await step.run(
      "verify-website",
      async () => {
        console.log(`Verifying website for merchant ${merchant.id}`);

        return fetchWebsiteData(
          merchant.websiteUrl,
          merchant.businessName,
          merchant.category,
        );
      },
    );

    // Run ML fraud prediction
    const mlPredictionData = await step.run(
      "run-ml-prediction",
      async () => {
        console.log(
          `Running ML prediction for merchant ${merchant.id}`,
        );

        return logRegPrediction(recentPayments, {
          isGstNumberVerified,
          isPhoneNumberVerified,

          isWebsiteVerified,
        });
      },
    );

    // Collect all pipeline results
    const pipelineResults: PipelineResults = {
      merchant,
      verification: verification ,
      recentPayments: recentPayments,

      isPhoneNumberVerified,
      isGstNumberVerified,

      websiteData,

      // Website accessibility, not legitimacy
      isWebsiteVerified,

      mlPredictionData,
    };

    // Combine verification results
    const result = await step.run(
      "combine-results",
      async () => {
        return combineResults(pipelineResults);
      },
    );

    // Persist final verification result
    const updatedVerificationData = await step.run(
      "update-verification",
      async () => {
        console.log(
          `Updating verification ${verification.id} for merchant ${merchant.id}`,
        );

        return updateVerification(
          pipelineResults,
          result,
        );
      },
    );

    console.log(
      `Updated Verification: ${verification.id} for merchant: ${merchant.id}`,
    );

    return {
      updatedVerificationData,
      pipelineResults,
    };
  },
);
