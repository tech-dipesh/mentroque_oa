import { apiRequest } from "./client.js";
import type { CallRequest, CallType } from "../types/index.js";

export function getMyRequests(token: string) {
  return apiRequest<CallRequest[]>("/requests/me", { token });
}

export function createMyRequest(
  token: string,
  input: { callType: CallType; description: string }
) {
  return apiRequest<CallRequest>("/requests/me", {
    method: "POST",
    body: input,
    token,
  });
}
