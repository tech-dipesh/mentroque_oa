import type { Request, Response } from "express";
import { createRequest, listRequestsForUser } from "./request.service.js";

export async function createMyRequest(req: Request, res: Response) {
  const request = await createRequest(req.user!.id, req.body);
  res.status(201).json(request);
}

export async function getMyRequests(req: Request, res: Response) {
  const requests = await listRequestsForUser(req.user!.id);
  res.json(requests);
}
