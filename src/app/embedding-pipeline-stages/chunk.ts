// import { extractTextFromPdf } from "./document";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 150,
});

const cleanDocumentText = (text: string): string => {
  return text
    .replace(/--\s*\d+\s+of\s+\d+\s*--/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

export const chunkDocument = async (text: string): Promise<string[]> => {
  const cleanedText = cleanDocumentText(text);
  return splitter.splitText(cleanedText);
};

// // TEST
// const main = async () => {
//   const secureUrl =
//     "https://res.cloudinary.com/nallythedude/image/upload/v1788265676/merchant-documents/36a728e6-e65f-4890-9bb9-a29f468fbe3c/Rifaqat_Nawaz_FischerJordan-154e1645-1e3d-4535-923b-9a3085002547.pdf";

//   const text = await extractTextFromPdf(secureUrl);

//   const chunks = await chunkDocument(text);

//   console.log("Total chunks:", chunks.length);

//   chunks.forEach((chunk, index) => {
//     console.log(`\n========== CHUNK ${index} ==========\n`);
//     console.log(chunk);
//   });
// };

// main();