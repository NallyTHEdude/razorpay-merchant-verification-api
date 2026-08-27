import { db } from "@/db";

export const healthCheckRepository = async () => {
  const isDatabaseConnected = await db.execute(`SELECT 1`).then(() => true).catch(() => false);
    const isLlmConnected = false; //TODO: Placeholder for future LLM connection check
    return new Map([
      ["Database", isDatabaseConnected],
      ["LLM", isLlmConnected]
    ]);
}