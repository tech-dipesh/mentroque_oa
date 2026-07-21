import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError.js";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ZodError) {
    
    console.log('zod', err.errors[0]);
    return res.status(400).json({
      message: err.errors[0].message ?? "Validation failed",
      issues: err.flatten().fieldErrors,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: "Something went wrong" });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ message: `No route for ${req.method} ${req.path}` });
}
