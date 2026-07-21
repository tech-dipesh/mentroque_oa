import { Router } from "express";
import { validate } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loginSchema, signupSchema } from "./auth.schema.js";
import {
  loginAdmin,
  loginMentor,
  loginUser,
  signupAdmin,
  signupMentor,
  signupUser,
} from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/login/user", validate(loginSchema), asyncHandler(loginUser));
authRouter.post("/login/mentor", validate(loginSchema), asyncHandler(loginMentor));
authRouter.post("/login/admin", validate(loginSchema), asyncHandler(loginAdmin));

authRouter.post("/signup/user", validate(signupSchema), asyncHandler(signupUser));
authRouter.post("/signup/mentor", validate(signupSchema), asyncHandler(signupMentor));
authRouter.post("/signup/admin", validate(signupSchema), asyncHandler(signupAdmin));
