import express from "express";
import { serve } from "inngest/express";
import { globalErrorHandler } from "@/utils/errors/globalErrorHandler";

import { inngestClient } from "@/config/pipeline/client";
import { helloWorldFunction } from "./config/pipeline/functions";


//import routes
import { swaggerRouter } from "@/config";
import healthRoute from "@/app/routes/health.route";
import merchantRoute from "@/app/routes/merchant.route";
import verificationRoute from "@/app/routes/verification.route";
import paymentRoute from "@/app/routes/payment.route";

const app = express();

app.use(express.json());
app.use("/api/inngest", serve({
    client: inngestClient,
    functions: [
        helloWorldFunction
    ]
}))


// setup routes
app.use("/api-docs", swaggerRouter);
app.use("/api/health", healthRoute);
app.use("/api/merchant", merchantRoute);
app.use("/api/verification", verificationRoute);
// app.use("/api/payment", paymentRoute); TODO: uncomment when done


app.use(globalErrorHandler);

export default app;