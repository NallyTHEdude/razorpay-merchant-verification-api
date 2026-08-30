import { firecrawl } from "@/config/scraper/client";
import {
  WebsiteData,
  WebsiteVerificationResult,
} from "@/data/types/pipelineTypes";
import { websiteDataSchema, WebsiteAgentData } from "./website.validator";

export const fetchWebsiteData = async (
  websiteUrl: string,
): Promise<WebsiteVerificationResult> => {
  try {
    console.log(`Investigating website: ${websiteUrl}`);

    const result = await firecrawl.agent({
      urls: [websiteUrl],

      prompt: `
        Investigate the provided merchant website and gather factual
        information about the business.

        Find relevant information wherever it exists on the website,
        including:

        - Business or company name
        - Contact information
        - Physical business address
        - Products or services
        - Privacy policy
        - Terms and conditions
        - Refund, return, or cancellation policy

        Navigate the website as necessary to find this information.

        Do not determine whether the business is legitimate or fraudulent.
        Do not assign a score.
        Do not make a risk assessment.

        Only return information that you can actually find on the website.
      `,

      schema: websiteDataSchema,

      model: "spark-2",
      effort: "medium",
      maxCredits: 100,
    });

    console.log(
      "----- FIRECRAWL AGENT RESULT -----",
      JSON.stringify(result, null, 2),
    );

    if (!result.success || !result.data) {
      console.error("Firecrawl Agent failed:", result);

      return {
        websiteData: null,
        isWebsiteVerified: false,
      };
    }

    const agentData = result.data as WebsiteAgentData;

    const websiteData: WebsiteData = {
      url: websiteUrl,
      businessName: agentData.businessName,
      contactInformation: agentData.contactInformation,
      physicalAddress: agentData.physicalAddress,
      productsOrServices: agentData.productsOrServices,
      policies: agentData.policies,
      scrapedAt: new Date().toISOString(),
    };

    return {
      websiteData,
      isWebsiteVerified: true,
    };
  } catch (error) {
    console.error("! ----- Firecrawl Agent failed ----- !:", error);

    return {
      websiteData: null,
      isWebsiteVerified: false,
    };
  }
};
