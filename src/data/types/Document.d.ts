import type { CloudinaryFolderName } from "@/data/enums/cloudinary.enums";

export type DocumentUploadOptions = {
  folder: CloudinaryFolderName;
  subFolder: string;
};

export type UploadMerchantDto = {
  fileBuffer: Buffer;
  merchantId: string;
};