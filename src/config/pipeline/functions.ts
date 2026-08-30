import { inngestClient } from "./client";

import { verifyPhoneNumber } from "@/app/verification-pipeline/stages/phone-number/phoneNumber.verification";
import { gstNumberVerification } from "@/app/verification-pipeline/stages/gst-number/gstNumber.verification";
import { logRegPrediction } from "@/app/verification-pipeline/stages/ml-prediction/logisticRegression";
import { fetchWebsiteData } from "@/app/verification-pipeline/stages/web-scraper/website.verification";
import { combineResults } from "@/app/verification-pipeline/stages/combine-results/combine-results";
import { updateVerification } from "@/app/verification-pipeline/stages/update-verification/update-verification";

import { PipelineResults } from "@/data/types/pipelineTypes";

export const merchantPipeline = inngestClient.createFunction(
  {
    id: "verify-merchant",
    triggers: [
      {
        event: "verification/created",
      },
    ],
  },

  async ({ event, step }) => {
    const { merchant, verification, recentPayments } = event.data;

    await step.run("start-verification", async () => {
      console.log(
        `Starting verification ${verification.id} for merchant ${merchant.id}`,
      );
    });

    const isPhoneNumberVerified = await step.run(
      "verify-phone-number",
      async () => {
        console.log(`Verifying phone number for merchant ${merchant.id}`);

        return verifyPhoneNumber(merchant.phoneNumber);
      },
    );

    const isGstNumberVerified = await step.run(
      "verify-gst-number",
      async () => {
        console.log(`Verifying GST for merchant ${merchant.id}`);

        return gstNumberVerification(merchant.gstNumber);
      },
    );

    const { websiteData, isWebsiteVerified } = await step.run(
      "verify-website",
      async () => {
        console.log(
          `Verifying website and getting data for merchant ${merchant.id}`,
        );

        return fetchWebsiteData(merchant.websiteUrl);
      },
    );

    const mlPredictionData = await step.run("run-ml-prediction", async () => {
      console.log(`Running ML prediction for merchant ${merchant.id}`);

      return logRegPrediction(recentPayments, {
        isGstNumberVerified,
        isPhoneNumberVerified,
        isWebsiteVerified,
      });
    });

    const pipelineResults: PipelineResults = {
      merchant,
      verification,
      recentPayments,
      isPhoneNumberVerified,
      isGstNumberVerified,
      websiteData,
      isWebsiteVerified,
      mlPredictionData,
    };

    const result = await step.run("combine-results", async () => {
      return combineResults(pipelineResults);
    });

    const updatedVerificationData = await step.run(
      "update-verification",
      async () => {
        console.log(
          `Updating verification ${verification.id} for merchant ${merchant.id}`,
        );

        return updateVerification(pipelineResults, result);
      },
    );

    console.log(
      `Updated Verification: ${verification.id} for merchant: ${merchant.id}`,
    );

    return {updatedVerificationData, pipelineResults};
  },
);
