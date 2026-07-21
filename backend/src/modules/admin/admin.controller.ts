import type { Request, Response } from "express";
import {
  bookCall,
  getRecommendationsForRequest,
  listAllMeetings,
  listMentors,
  listPendingRequests,
  updateMentorMeta,
} from "./admin.service.js";

export async function getMentors(_req: Request, res: Response) {
  const mentors = await listMentors();
  res.json(mentors);
}

export async function patchMentorMeta(req: Request, res: Response) {
  const mentor = await updateMentorMeta(req.params.mentorId, req.body);
  res.json(mentor);
}

export async function getPendingRequests(_req: Request, res: Response) {
  const requests = await listPendingRequests();
  res.json(requests);
}

export async function getRecommendations(req: Request, res: Response) {
  const recommendations = await getRecommendationsForRequest(req.params.requestId);
  res.json(recommendations);
}

export async function postBookCall(req: Request, res: Response) {
  const meeting = await bookCall(req.params.requestId, req.user!.id, req.body);
  res.status(201).json(meeting);
}

export async function getMeetings(_req: Request, res: Response) {
  const meetings = await listAllMeetings();
  res.json(meetings);
}
