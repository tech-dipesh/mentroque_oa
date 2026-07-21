import { Router } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { requestIdParamsSchema, bookCallSchema } from "../matching/request.schema.js";
import { mentorIdParamsSchema, updateMentorMetaSchema } from "./admin.schema.js";
import {
  getMeetings,
  getMentors,
  getPendingRequests,
  getRecommendations,
  patchMentorMeta,
  postBookCall,
} from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("ADMIN"));

adminRouter.get("/mentors", asyncHandler(getMentors));
adminRouter.patch(
  "/mentors/:mentorId",
  validate(mentorIdParamsSchema, "params"),
  validate(updateMentorMetaSchema),
  asyncHandler(patchMentorMeta)
);

adminRouter.get("/requests", asyncHandler(getPendingRequests));
adminRouter.get(
  "/requests/:requestId/recommendations",
  validate(requestIdParamsSchema, "params"),
  asyncHandler(getRecommendations)
);
adminRouter.post(
  "/requests/:requestId/book",
  validate(requestIdParamsSchema, "params"),
  validate(bookCallSchema),
  asyncHandler(postBookCall)
);

adminRouter.get("/meetings", asyncHandler(getMeetings));
