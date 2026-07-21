import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/appError.js";
import { generatePlaceholderMeetLink } from "../../utils/meetLink.js";
import { findOverlapWindows } from "../availability/availability.service.js";
import { rankMentorsForRequest, refreshMentorEmbedding } from "../matching/matching.service.js";
import type { BookCallInput } from "../matching/request.schema.js";
import type { UpdateMentorMetaInput } from "./admin.schema.js";

export async function listMentors() {
  return prisma.user.findMany({
    where: { role: "MENTOR" },
    orderBy: { name: "asc" },
  });
}

export async function updateMentorMeta(mentorId: string, input: UpdateMentorMetaInput) {
  const mentor = await prisma.user.findUnique({ where: { id: mentorId } });

  if (!mentor || mentor.role !== "MENTOR") {
    throw new AppError("Mentor not found", 404);
  }

  await prisma.user.update({ where: { id: mentorId }, data: input });
  await refreshMentorEmbedding(mentorId);

  return prisma.user.findUniqueOrThrow({ where: { id: mentorId } });
}

export async function listPendingRequests() {
  return prisma.callRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: { user: true },
  });
}

export async function getRecommendationsForRequest(requestId: string) {
  const request = await prisma.callRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError("Request not found", 404);
  }

  const matches = await rankMentorsForRequest(requestId);

  const matchesWithOverlap = await Promise.all(
    matches.map(async (match) => {
      const overlapWindows = await findOverlapWindows(request.userId, match.mentor.id);
      return { ...match, overlapWindows };
    })
  );

  return matchesWithOverlap;
}

export async function bookCall(
  requestId: string,
  adminId: string,
  input: BookCallInput
) {
  const request = await prisma.callRequest.findUnique({ where: { id: requestId } });

  if (!request) {
    throw new AppError("Request not found", 404);
  }

  if (request.status === "BOOKED") {
    throw new AppError("This request already has a call booked", 409);
  }

  const overlapWindows = await findOverlapWindows(request.userId, input.mentorId);

  const fitsAWindow = overlapWindows.some(
    (window) =>
      window.dayOfWeek === input.dayOfWeek &&
      window.startTime <= input.startTime &&
      window.endTime >= input.endTime
  );

  if (!fitsAWindow) {
    throw new AppError(
      "That time doesn't fall inside a window where both the user and mentor are free",
      409
    );
  }

  const meeting = await prisma.meeting.create({
    data: {
      callRequestId: requestId,
      adminId,
      mentorId: input.mentorId,
      userId: request.userId,
      callType: request.callType,
      dayOfWeek: input.dayOfWeek,
      startTime: input.startTime,
      endTime: input.endTime,
      meetLink: generatePlaceholderMeetLink(),
    },
  });

  await prisma.callRequest.update({
    where: { id: requestId },
    data: { status: "BOOKED" },
  });

  return meeting;
}

export async function listAllMeetings() {
  return prisma.meeting.findMany({
    orderBy: { createdAt: "desc" },
    include: { mentor: true, user: true },
  });
}
