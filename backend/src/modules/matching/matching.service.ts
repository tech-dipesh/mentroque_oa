import type { CallType, User } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { cosineSimilarity, embedText } from "./embedding.js";

const traitByCallType: Record<CallType, string> = {
  RESUME_REVAMP: "big-tech",
  JOB_MARKET_GUIDANCE: "good-communication",
  MOCK_INTERVIEW: "",
};

function buildMentorSourceText(mentor: Pick<User, "name" | "tags" | "description" | "domain">) {
  const parts = [mentor.description ?? "", mentor.domain ?? "", mentor.tags.join(", ")];
  return parts.filter(Boolean).join(". ");
}

export async function refreshMentorEmbedding(mentorId: string) {
  const mentor = await prisma.user.findUniqueOrThrow({ where: { id: mentorId } });
  const sourceText = buildMentorSourceText(mentor);
  const vector = await embedText(sourceText);

  await prisma.mentorEmbedding.upsert({
    where: { mentorId },
    create: { mentorId, vector, sourceText },
    update: { vector, sourceText },
  });
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
}

export async function rankMentorsForRequest(
  requestId: string
): Promise<MentorMatch[]> {
  const request = await prisma.callRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: { user: true },
  });

  const mentors = await prisma.user.findMany({
    where: { role: "MENTOR" },
    include: { embedding: true },
  });

  const requestText = [
    request.description,
    request.user.domain ?? "",
    request.user.tags.join(", "),
  ]
    .filter(Boolean)
    .join(". ");

  const requestVector = await embedText(requestText);
  const desiredTrait = traitByCallType[request.callType];

  const scored = mentors
    .filter((mentor) => mentor.embedding)
    .map((mentor) => {
      const similarity = cosineSimilarity(mentor.embedding!.vector, requestVector);
      const matchedTraits: string[] = [];

      if (desiredTrait && mentor.tags.includes(desiredTrait)) {
        matchedTraits.push(desiredTrait);
      }

      if (
        request.callType === "MOCK_INTERVIEW" &&
        mentor.domain &&
        mentor.domain === request.user.domain
      ) {
        matchedTraits.push(`same domain: ${mentor.domain}`);
      }

      const traitBoost = matchedTraits.length * 0.15;
      const finalScore = similarity + traitBoost;

      const reason = buildReason(similarity, matchedTraits);

      return {
        mentor: {
          id: mentor.id,
          name: mentor.name,
          email: mentor.email,
          tags: mentor.tags,
          description: mentor.description,
          domain: mentor.domain,
        },
        similarity: Number(finalScore.toFixed(3)),
        matchedTraits,
        reason,
      };
    })
    .sort((a, b) => b.similarity - a.similarity);

  return scored.slice(0, 3);
}

function buildReason(similarity: number, matchedTraits: string[]): string {
  const similarityPercent = Math.round(similarity * 100);

  if (matchedTraits.length === 0) {
    return `${similarityPercent}% profile match based on description and tags`;
  }

  return `${similarityPercent}% profile match, plus matches on ${matchedTraits.join(", ")}`;
}
