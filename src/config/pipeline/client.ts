import { Inngest } from "inngest";
import { config } from "@/config/env/env";

export const inngestClient = new Inngest({
    id: "inngest-client",
    isDev: config.NODE_ENV === "development"
});