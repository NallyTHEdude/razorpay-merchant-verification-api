import { Firecrawl } from "firecrawl";
import { config } from "@/config/env/env";

export const firecrawl = new Firecrawl({
  apiKey: config.FIRECRAWL_API_KEY,
});
