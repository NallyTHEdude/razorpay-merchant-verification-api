import type { DocumentUploadResult } from "@/data/types/Document";
import type { Readable } from "node:stream";

declare global {
  namespace Express {
    interface Request {
      fileStream?: Readable;
      documentUploadResult?: DocumentUploadResult;
    }
  }
}

export {};
