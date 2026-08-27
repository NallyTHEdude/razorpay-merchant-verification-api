import express from "express";
import { globalErrorHandler } from "@/utils/errors/globalErrorHandler";

const app = express();

app.use(express.json());

//import routes
import healthRoute from "@/app/routes/health.route";

// setup routes
app.use("/health", healthRoute);


app.use(globalErrorHandler);

export default app;