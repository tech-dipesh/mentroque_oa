import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodSchema } from "zod";

type RequestPart = "body" | "query" | "params";

export function validate<Schema extends ZodSchema>(
  schema: Schema,
  part: RequestPart = "body"
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse(req[part]);
    req[part] = parsed;
    next();
  };
}
