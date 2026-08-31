import cloudinary from "@/config/cloudinary";
import { DocumentUploadOptions } from "@/data/types/Cloudinary";

export const uploadDocument = (
  buffer: Buffer,
  options: DocumentUploadOptions,
): Promise<{
    publicId: string; 
    secureUrl: string;
    format: string;
    bytes: number;
}> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: options.folder,
        resource_type: "raw",
        format: "pdf",
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          publicId: result.public_id,
          secureUrl: result.secure_url,
          format: result.format,
          bytes: result.bytes,
        });
      },
    );

    stream.end(buffer);
  });
};
