import { NextFunction, Request, Response } from "express";
import logger from "../lib/logger";

export function errorMiddleware(error: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error(error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
}

