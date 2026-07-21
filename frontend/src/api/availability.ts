import { apiRequest } from "./client.js";
import type { AvailabilitySlot } from "../types/index.js";

export function getMySlots(token: string) {
  return apiRequest<AvailabilitySlot[]>("/availability/me", { token });
}

export function addMySlot(
  token: string,
  slot: { dayOfWeek: number; startTime: string; endTime: string }
) {
  return apiRequest<AvailabilitySlot>("/availability/me", {
    method: "POST",
    body: slot,
    token,
  });
}

export function deleteMySlot(token: string, slotId: string) {
  return apiRequest<void>(`/availability/me/${slotId}`, {
    method: "DELETE",
    token,
  });
}
