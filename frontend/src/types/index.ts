export type Role = "USER" | "MENTOR" | "ADMIN";

export type CallType = "RESUME_REVAMP" | "JOB_MARKET_GUIDANCE" | "MOCK_INTERVIEW";

export type RequestStatus = "PENDING" | "MATCHED" | "BOOKED";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  tags: string[];
  description: string | null;
  domain: string | null;
}

export interface AvailabilitySlot {
  id: string;
  ownerId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface CallRequest {
  id: string;
  userId: string;
  callType: CallType;
  description: string;
  status: RequestStatus;
  createdAt: string;
  meeting?: Meeting | null;
  user?: AuthUser;
}

export interface OverlapWindow {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface MentorMatch {
  mentor: {
    id: string;
    name: string;
    email: string;
    tags: string[];
    description: string | null;
    domain: string | null;
  };
  similarity: number;
  matchedTraits: string[];
  reason: string;
  overlapWindows: OverlapWindow[];
}

export interface Meeting {
  id: string;
  callRequestId: string;
  adminId: string;
  mentorId: string;
  userId: string;
  callType: CallType;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  meetLink: string;
  createdAt: string;
  mentor?: AuthUser;
  user?: AuthUser;
}
