import { randomBytes } from "crypto";

export function generatePlaceholderMeetLink(): string {
  const code = randomBytes(4).toString("hex");
  return `https://meet.mentorque.dev/${code}`;
}
