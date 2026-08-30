import { PaymentStatus } from "@/data/enums/db.enums";
import { config } from "@/config/env/env";

import {
  VerificationResults,
  MLPredictionData,
  PipelinePayment,
} from "@/data/types/pipelineTypes";

const HIGH_VALUE_PAYMENT_THRESHOLD = 10_000;

export const logRegPrediction = async (
  paymentData: PipelinePayment[],
  verificationResults: VerificationResults,
): Promise<MLPredictionData> => {
  const paymentCount = paymentData.length;

  if (paymentCount === 0) {
    throw new Error("Payment data cannot be empty");
  }

  const averagePaymentAmount =
    paymentData.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) /
    paymentCount;

  const failedPaymentRate =
    paymentData.filter((payment) => payment.status === PaymentStatus.FAILED)
      .length / paymentCount;

  const highValuePaymentRate =
    paymentData.filter(
      (payment) => parseFloat(payment.amount) >= HIGH_VALUE_PAYMENT_THRESHOLD,
    ).length / paymentCount;

  const internationalPaymentRate =
    paymentData.filter((payment) => payment.isInternational).length /
    paymentCount;

  const predictionData = {
    ...verificationResults,
    paymentCount,
    averagePaymentAmount,
    failedPaymentRate,
    highValuePaymentRate,
    internationalPaymentRate,
  };

  const response = await fetch(`${config.ML_SERVICE_URL}/score`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(predictionData),
  });

  if (!response.ok) {
    throw new Error(`ML API request failed with status ${response.status}`);
  }

  const result = await response.json();

  if (
    typeof result.fraudProbability !== "number" ||
    typeof result.riskLevel !== "string"
  ) {
    throw new Error("Invalid response from ML API");
  }

  return {
    ...predictionData,
    fraudProbability: result.fraudProbability,
    riskLevel: result.riskLevel,
  };
};
