import { inngestClient } from "./client";
import { verifyPhoneNumber } from "@/app/verification-pipeline/stages/phone-number/phoneNumber.verification";
import { gstNumberVerification } from "@/app/verification-pipeline/stages/gst-number/gstNumber.verification";
import { logRegPrediction } from "@/app/verification-pipeline/stages/ml-prediction/logisticRegression";
import { fetchWebstiteData } from "@/app/verification-pipeline/stages/website/website.verification";

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

    const isPhoneNumberVerified = await step.run("verify-phone-number", async () => {
      console.log(`Verifying phone number for merchant ${merchant.id}`);
      return await verifyPhoneNumber(merchant.phoneNumber);
    });

    const isGstNumberVerified = await step.run("verify-gst-number", async () => {
      console.log(`Verifying GST for merchant ${merchant.id}`);
      return await gstNumberVerification(merchant.gstNumber);
    });

    // TODO: Implement the actual website verification logic
    const {websiteData, isWebsiteVerified} = await step.run("verify-website", async () => {
      console.log(`Verifying website and getting data for merchant ${merchant.id}`);
      return await fetchWebstiteData(merchant.websiteUrl);
    });

    const mlPredictionData = await step.run("run-ml-prediction", async () => {
      console.log(`Running ML prediction for merchant ${merchant.id}`);
      return await logRegPrediction(recentPayments, {isGstNumberVerified, isPhoneNumberVerified, isWebsiteVerified});
    });

    const result = await step.run("combine-results", async () => {
      return {
        isPhoneNumberVerified,
        isGstNumberVerified,
        isWebsiteVerified,
        mlPredictionData,
        websiteData,
      }
    });

    return result;
  },
);
