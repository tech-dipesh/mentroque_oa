import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/appError.js";
import type { CreateSlotInput } from "./availability.schema.js";

export async function listSlotsForOwner(ownerId: string) {
  return prisma.availabilitySlot.findMany({
    where: { ownerId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function addSlot(ownerId: string, input: CreateSlotInput) {
  const overlapping = await prisma.availabilitySlot.findFirst({
    where: {
      ownerId,
      dayOfWeek: input.dayOfWeek,
      startTime: { lt: input.endTime },
      endTime: { gt: input.startTime },
    },
  });

  if (overlapping) {
    throw new AppError("This overlaps with a slot you already added", 409);
  }

  return prisma.availabilitySlot.create({
    data: { ownerId, ...input },
  });
}

export interface OverlapWindow {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export async function findOverlapWindows(
  ownerIdA: string,
  ownerIdB: string
): Promise<OverlapWindow[]> {
  const [slotsA, slotsB] = await Promise.all([
    listSlotsForOwner(ownerIdA),
    listSlotsForOwner(ownerIdB),
  ]);

  const windows: OverlapWindow[] = [];

  for (const a of slotsA) {
    for (const b of slotsB) {
      if (a.dayOfWeek !== b.dayOfWeek) continue;

      const start = a.startTime > b.startTime ? a.startTime : b.startTime;
      const end = a.endTime < b.endTime ? a.endTime : b.endTime;

      if (start < end) {
        windows.push({ dayOfWeek: a.dayOfWeek, startTime: start, endTime: end });
      }
    }
  }

  return windows;
}

export async function removeSlot(ownerId: string, slotId: string) {
  const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });

  if (!slot || slot.ownerId !== ownerId) {
    throw new AppError("Slot not found", 404);
  }

  await prisma.availabilitySlot.delete({ where: { id: slotId } });
}
