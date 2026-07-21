import { prisma } from "../../lib/prisma.js";
import type { CreateRequestInput } from "./request.schema.js";

export async function createRequest(userId: string, input: CreateRequestInput) {
  return prisma.callRequest.create({
    data: { userId, ...input },
  });
}

export async function listRequestsForUser(userId: string) {
  return prisma.callRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { meeting: true },
  });
}
