import { globalErrorHandler } from "@/utils/errors/globalErrorHandler";
import express from "express";
import { serve } from "inngest/express";

import { inngestClient } from "@/config/inngest-pipeline/client";
import { verificationPipeline } from "./config/inngest-pipeline/functions";

//import routes
import healthRoute from "@/app/routes/health.route";
import merchantRoute from "@/app/routes/merchant.route";
import paymentRoute from "@/app/routes/payment.route";
import verificationRoute from "@/app/routes/verification.route";
import swaggerRouter from "@/config/swagger/swagger";

const app = express();

app.use(express.json());

// suggested in docs
app.use(
  "/api/inngest",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  serve({
    client: inngestClient,
    functions: [verificationPipeline],
  }),
);

// setup routes
app.use("/api-docs", swaggerRouter);
app.use("/api/health", healthRoute);
app.use("/api/merchant", merchantRoute);
app.use("/api/verification", verificationRoute);
app.use("/api/payment", paymentRoute);

app.use(globalErrorHandler);

export default app;
