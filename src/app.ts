import express from "express";
import { globalErrorHandler } from "@/utils/errors/globalErrorHandler";

//import routes
import swaggerRoute from "@/config/docs/swagger";
import healthRoute from "@/app/routes/health.route";

const app = express();

app.use(express.json());



// setup routes
app.use("/api-docs", swaggerRoute);
app.use("/api/health", healthRoute);


app.use(globalErrorHandler);

export default app;