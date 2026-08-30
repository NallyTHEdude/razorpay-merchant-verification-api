import { inngestClient } from "./client";

import {
  loadVerificationContext,
  runPhoneVerification,
  runGstVerification,
  runWebsiteVerification,
  runMlPrediction,
  buildPipelineResults,
  combinePipelineResults,
  persistVerificationResult,
} from "./pipeline";

import { Merchant } from "@/data/types/Merchant";

import { markVerificationAsServerError } from "@/app/repositories/verification.repository";

export const verificationPipeline = inngestClient.createFunction(
  {
    id: "verify-merchant",
    retries: 2, // 2 retries after the initial attempt, total 3 attemts
    triggers: [
      {
        event: "verification/requested",
      },
    ],

    // Runs after all retries are exhausted
    onFailure: async (failure) => {
      const merchant = (
        failure.event.data.event.data as unknown as {
          merchant: Merchant;
          verificationId: string;
        }
      ).merchant;

      const verificationId = (
        failure.event.data.event.data as unknown as {
          merchant: Merchant;
          verificationId: string;
        }
      ).verificationId;

      console.error(
        `Verification pipeline permanently failed for merchant ${merchant.id}`,
        failure.error,
      );

      await markVerificationAsServerError(verificationId);
      console.log(`Verification ${verificationId} marked as SERVER_ERROR`);
    },
  },

  async ({ event, step }) => {
    const { merchant, verificationId } = event.data;

    // Step 0: Start verification
    await step.run("start-verification", async () => {
      console.log(
        `Starting verification ${verificationId} for merchant ${merchant.id}`,
      );
    });

    // Step 1: Load verification + recent payments
    const { verification, recentPayments } = await step.run(
      "load-context",
      async () => {
        return loadVerificationContext(merchant, verificationId);
      },
    );

    // Step 2: Verify phone number
    const isPhoneNumberVerified = await step.run(
      "verify-phone-number",
      async () => {
        return runPhoneVerification(merchant);
      },
    );

    // Step 3: Verify GST number
    const isGstNumberVerified = await step.run(
      "verify-gst-number",
      async () => {
        return runGstVerification(merchant);
      },
    );

    // Step 4: Verify website
    const { websiteData, isWebsiteVerified } = await step.run(
      "verify-website",
      async () => {
        return runWebsiteVerification(merchant);
      },
    );

    // Step 5: Run ML prediction
    const mlPredictionData = await step.run("run-ml-prediction", async () => {
      return runMlPrediction(
        merchant,
        recentPayments,
        isGstNumberVerified,
        isPhoneNumberVerified,
        isWebsiteVerified,
      );
    });

    // Step 6: Build pipeline results
    const pipelineResults = buildPipelineResults(
      merchant,
      verification,
      recentPayments,
      isPhoneNumberVerified,
      isGstNumberVerified,
      websiteData,
      isWebsiteVerified,
      mlPredictionData,
    );

    // Step 7: Combine results
    const result = await step.run("combine-results", async () => {
      return combinePipelineResults(pipelineResults);
    });

    // Step 8: Persist final result
    const updatedVerificationData = await step.run(
      "update-verification",
      async () => {
        return persistVerificationResult(pipelineResults, result);
      },
    );

    console.log(
      `Updated verification ${verification.id} for merchant ${merchant.id}`,
    );

    return {
      updatedVerificationData,
      pipelineResults,
    };
  },
);
