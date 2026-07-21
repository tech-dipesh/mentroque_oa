import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { updateOwnProfileSchema } from "./users.schema.js";
import { getMe, updateMe } from "./users.controller.js";

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get("/me", asyncHandler(getMe));
usersRouter.patch(
  "/me",
  requireRole("USER"),
  validate(updateOwnProfileSchema),
  asyncHandler(updateMe)
);
