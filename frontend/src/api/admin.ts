import { apiRequest } from "./client.js";
import type { AuthUser, CallRequest, Meeting, MentorMatch } from "../types/index.js";

export function getMentors(token: string) {
  return apiRequest<AuthUser[]>("/admin/mentors", { token });
}

export function updateMentorMeta(
  token: string,
  mentorId: string,
  input: { tags: string[]; description: string; domain: string }
) {
  return apiRequest<AuthUser>(`/admin/mentors/${mentorId}`, {
    method: "PATCH",
    body: input,
    token,
  });
}

export function getPendingRequests(token: string) {
  return apiRequest<CallRequest[]>("/admin/requests", { token });
}

export function getRecommendations(token: string, requestId: string) {
  return apiRequest<MentorMatch[]>(`/admin/requests/${requestId}/recommendations`, {
    token,
  });
}

export function bookCall(
  token: string,
  requestId: string,
  input: { mentorId: string; dayOfWeek: number; startTime: string; endTime: string }
) {
  return apiRequest<Meeting>(`/admin/requests/${requestId}/book`, {
    method: "POST",
    body: input,
    token,
  });
}

export function getAllMeetings(token: string) {
  return apiRequest<Meeting[]>("/admin/meetings", { token });
}
