import type { Request, Response } from "express";
import { loginAs, signupAs } from "./auth.service.js";

export async function loginUser(req: Request, res: Response) {
  const result = await loginAs("USER", req.body);
  res.json(result);
}

export async function loginMentor(req: Request, res: Response) {
  const result = await loginAs("MENTOR", req.body);
  res.json(result);
}

export async function loginAdmin(req: Request, res: Response) {
  const result = await loginAs("ADMIN", req.body);
  res.json(result);
}

export async function signupUser(req: Request, res: Response) {
  const result = await signupAs("USER", req.body);
  res.status(201).json(result);
}

export async function signupMentor(req: Request, res: Response) {
  const result = await signupAs("MENTOR", req.body);
  res.status(201).json(result);
}

export async function signupAdmin(req: Request, res: Response) {
  const result = await signupAs("ADMIN", req.body);
  res.status(201).json(result);
}
