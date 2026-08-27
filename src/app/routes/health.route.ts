import Router from "express";
import { healthCheck } from "../controllers/health.controller.js";

const router = Router();
/**
 * @swagger
 * /api/health:
 * 
 *   get:
 *      tags:
 *          - HealthCheck Endpoint
 * 
 *      summary: Health check endpoint
 *      description: Returns the health status of the API by checking availability of all external services.
 * 
 *      responses:
 *          200:
 *            description: Health status of the API
 *          503:
 *            description: Service Unavailable - One or more external services are not healthy
 */
router.get("/", healthCheck);

export default router;