import { inngestClient } from "./client";

export const merchantPipeline = inngestClient.createFunction(
  {
    id: "verify-merchant",
    triggers: [
      {
        event: "verification/created",
      },
    ],
  },

  // TODO: Implement the actual verification logic for each step in the pipeline
  async ({ event, step }) => {
    const { merchantId, verificationId } = event.data;

    await step.run("start-verification", async () => {
      console.log(
        `Starting verification ${verificationId} for merchant ${merchantId}`,
      );
    });

    await step.run("verify-phone-number", async () => {
      console.log(`Verifying phone for merchant ${merchantId}`);
    });

    await step.run("verify-gst-number", async () => {
      console.log(`Verifying GST for merchant ${merchantId}`);
    });

    await step.run("verify-website", async () => {
      console.log(`Verifying website for merchant ${merchantId}`);
    });

    await step.run("run-ml-prediction", async () => {
      console.log(`Running ML prediction for merchant ${merchantId}`);
    });

    await step.run("complete-verification", async () => {
      console.log(`Verification ${verificationId} completed`);
    });

    return {
      merchantId,
      verificationId,
      status: "COMPLETED",
    };
  },
);
