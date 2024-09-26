import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../Error/error-response";

export const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      status: "bad request",
      errors: `validation errors :${JSON.stringify(error)}`,
    });
  } else if (error instanceof ResponseError) {
    res.status(error.status).json({
      status: "bad request",
      error: error.message,
    });
  } else {
    res.status(500).json({
      status: "fatal error",
      message: "internal server error",
    });
  }
};
