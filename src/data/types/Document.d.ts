import type { CloudinaryFolderName } from "@/data/enums/cloudinary.enums";
import type { Readable } from "node:stream";

export type DocumentUploadOptions = {
  folder: CloudinaryFolderName;
  subFolder: string;
  originalFilename: string;
};

export type UploadMerchantDto = {
  merchantId: string;
  fileStream: Readable;
  originalFilename: string;
};

export type UploadGovernmentDto = {
  fileStream: Readable;
  originalFilename: string;
};

export type DocumentUploadResult = {
  publicId: string;
  secureUrl: string;
  format?: string;
  bytes: number;
};

export type DocumentMerchantIdParam = {
  merchantId: string;
};
