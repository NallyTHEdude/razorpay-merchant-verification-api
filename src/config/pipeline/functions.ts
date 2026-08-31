import { inngestClient } from "./client";
import { verificationRequested } from "./eventSchemas";

import {
  loadVerificationContext,
  runPhoneVerification,
  runGstVerification,
  runWebsiteVerification,
  runMlPrediction,
  buildPipelineResults,
  combinePipelineResults,
  persistVerificationResult,
  applyMerchantUpdate,
} from "./pipeline";

import { type Merchant } from "@/data/types/Merchant";
import { markVerificationAsServerError } from "@/app/repositories/verification.repository";
import { VerificationStatus } from "@/data/enums/db.enums";

export const verificationPipeline = inngestClient.createFunction(
  {
    id: "verify-merchant",
    retries: 2, // 2 retries after the initial attempt, total 3 attempts

    triggers: [verificationRequested],

    // Runs after all retries are exhausted
    onFailure: async (failure) => {
      const eventData = failure.event.data.event.data as unknown as {
        merchant: Merchant;
        verificationId: string;
      };

      const { merchant, verificationId } = eventData;

      console.error(
        `Verification pipeline permanently failed for merchant ${merchant.id}`,
        failure.error,
      );

      await markVerificationAsServerError(verificationId);

      console.log(`Verification ${verificationId} marked as SERVER_ERROR`);
    },
  },

  async ({ event, step }) => {
    const { merchant, verificationId, isMerchantUpdate } = event.data;

    // Step 0: Start verification
    await step.run("start-verification", () => {
      console.log(`Starting verification ${verificationId} for merchant ${merchant.id}`);
    });

    // Step 1: Load verification + recent payments
    const { verification, recentPayments } = await step.run(
      "load-context",
      async () => {
        return loadVerificationContext(merchant, verificationId);
      },
    );

    // Step 2-4: Run independent verification stages concurrently for better latency
    const [isPhoneNumberVerified, isGstNumberVerified, websiteVerification] =
      await Promise.all([
        // Step 2: Verify phone number
        step.run("verify-phone-number", async () => {
          return runPhoneVerification(merchant);
        }),

        // Step 3: Verify GST number
        step.run("verify-gst-number", async () => {
          return runGstVerification(merchant);
        }),

        // Step 4: Verify website
        step.run("verify-website", async () => {
          return runWebsiteVerification(merchant);

          // For testing purposes, we can return dummy data here:
          //
          // return {
          //   websiteData: {
          //     dummyData: true,
          //     url: "wrong_dummy_url_here",
          //   },
          //   isWebsiteVerified: false,
          // };
        }),
      ]);

    const { websiteData, isWebsiteVerified } = websiteVerification;

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
    const result = await step.run("combine-results", () => {
      return combinePipelineResults(pipelineResults);
    });

    // Step 8: Persist final verification result
    const updatedVerificationData = await step.run(
      "update-verification",
      async () => {
        return persistVerificationResult(pipelineResults, result);
      },
    );

    // Step 9: Apply merchant update only after successful verification
    const updatedMerchant = await step.run(
      "apply-merchant-update",
      async () => {
        if (!isMerchantUpdate) {
          return null;
        }

        if (result.verificationStatus !== VerificationStatus.COMPLETED) {
          return null;
        }

        console.log(
          `Verification successful. Applying merchant update for ${merchant.id}`,
        );

        return applyMerchantUpdate(merchant);
      },
    );

    console.log(
      `Updated verification ${verification.id} for merchant ${merchant.id}`,
    );

    return {
      updatedVerificationData,
      pipelineResults,
      updatedMerchant,
    };
  },
);
