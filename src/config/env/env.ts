import {z} from "zod";
import dotenv from "dotenv";

dotenv.config({
    path: ".env"
});

const envSchema = z.object({
  BASE_URL: z.string(),
  PORT: z.coerce.number().int().min(0).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  ML_SERVICE_URL: z.string().url()
});

export const config = envSchema.parse(process.env);