import { UploadedFile } from "express-fileupload";

declare global {
  namespace Express {
    interface Request {
      files?: {
        [key: string]: UploadedFile | UploadedFile[];
      };
    }
  }
}

export {};
