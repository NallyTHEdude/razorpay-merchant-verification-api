import express from "express";
import { globalErrorHandler } from "@/utils/errors/globalErrorHandler";

//import routes
import { swaggerRouter } from "@/config";
import healthRoute from "@/app/routes/health.route";
import merchantRoute from "@/app/routes/merchant.route";

const app = express();

app.use(express.json());



// setup routes
app.use("/api-docs", swaggerRouter);
app.use("/api/health", healthRoute);
app.use("/api/merchants", merchantRoute);


app.use(globalErrorHandler);

export default app;