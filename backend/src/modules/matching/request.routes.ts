import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createRequestSchema } from "./request.schema.js";
import { createMyRequest, getMyRequests } from "./request.controller.js";

export const requestRouter = Router();

requestRouter.use(requireAuth, requireRole("USER"));

requestRouter.get("/me", asyncHandler(getMyRequests));
requestRouter.post("/me", validate(createRequestSchema), asyncHandler(createMyRequest));
