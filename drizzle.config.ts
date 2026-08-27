import {config} from "./src/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schemas",
  dialect: "postgresql",
  dbCredentials: {
    url: config.DATABASE_URL!,
  },
});
