import { MistralAIEmbeddings } from "@langchain/mistralai";
import { config } from "@/config/env";

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: config.MISTRAL_API_KEY,
});

export const generateEmbeddings = async (chunks: string[]): Promise<number[][]> => {
  return embeddings.embedDocuments(chunks);
};

// testing
// import { chunkDocument } from "./chunk";
// import { extractTextFromPdf } from "./document";

// const main = async () => {
//   const secureUrl =
//     "https://res.cloudinary.com/nallythedude/image/upload/v1788265676/merchant-documents/36a728e6-e65f-4890-9bb9-a29f468fbe3c/Rifaqat_Nawaz_FischerJordan-154e1645-1e3d-4535-923b-9a3085002547.pdf";

//   const text = await extractTextFromPdf(secureUrl);

//   const chunks = await chunkDocument(text);

//   const result = await generateEmbeddings(chunks);

//   console.log("Chunks:", chunks.length);
//   console.log("Embeddings:", result.length);
//   console.log("Embedding dimensions:", result[0]?.length);
//   console.log("First 10 values:", result[0]?.slice(0, 10));
// };

// main();
