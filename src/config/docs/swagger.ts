import Router from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { config } from "@/config";
// @ts-expect-error swagger-model-validator does not provide TypeScript declarations by default, hence ignore
import swaggerModelValidator from "swagger-model-validator";
import swaggerUi from "swagger-ui-express";
import { Request, Response } from "express";

const router = Router();

const options: swaggerJsdoc.Options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Merchant Analyzer API",
            version: "1.0.0",
            description: "API documentation for the Merchant Analyzer project.",
        },
        tags: [
            {
                name: "HealthCheck Endpoint",
                description: "Endpoint related to health check of the API."
            },
            {
                name: "Merchant Endpoints",
                description: "Endpoints related to merchant management."
            },
            {
                name: "Payment Endpoints",
                description: "Endpoints related to payment management."
            },
            {
                name: "Verification Endpoints",
                description: "Endpoints related to verification management."
            },
            {
                name: "Investigation Endpoints",
                description: "Endpoints related to investigation management."
            },
            {
                name: "Rag Endpoints",
                description: "Endpoints related to RAG (Retrieval Augmented Generation)."
            }
        ],
        servers: [
            {
                url: `http://localhost:${config.PORT}`,
                description: "Local development server"
            }
        ],
        components: {
            securitySchemes: {}
        }
    },
    apis: ["./src/app/routes/*.ts"], // Path to the API docs
}

const swaggerSpec = swaggerJsdoc(options);


// validate swagger spec against the OpenAPI 3.0 specification
swaggerModelValidator(swaggerSpec);


// Serve swagger endpoints
router.get("/json", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
});

router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default router;