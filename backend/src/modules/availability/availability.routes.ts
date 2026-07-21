import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { createSlotSchema, slotIdParamsSchema } from "./availability.schema.js";
import { createMySlot, deleteMySlot, getMySlots } from "./availability.controller.js";

export const availabilityRouter = Router();

availabilityRouter.use(requireAuth, requireRole("USER", "MENTOR"));

availabilityRouter.get("/me", asyncHandler(getMySlots));
availabilityRouter.post("/me", validate(createSlotSchema), asyncHandler(createMySlot));
availabilityRouter.delete(
  "/me/:slotId",
  validate(slotIdParamsSchema, "params"),
  asyncHandler(deleteMySlot)
);
