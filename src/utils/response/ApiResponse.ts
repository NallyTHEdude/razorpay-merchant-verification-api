import type { Response } from "express";
import { type HttpStatusCode } from "@/data/types/statusCodes";

export class ApiResponse<T> {
  statusCode: HttpStatusCode;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: HttpStatusCode, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  send(res: Response) {
    return res.status(this.statusCode).json(this);
  }
}
