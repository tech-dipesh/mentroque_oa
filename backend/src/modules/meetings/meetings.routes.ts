import { Router } from "express";
import type { Request, Response } from "express";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { prisma } from "../../lib/prisma.js";

export const meetingsRouter = Router();

meetingsRouter.use(requireAuth, requireRole("USER", "MENTOR"));

meetingsRouter.get(
  "/me",
  asyncHandler(async (req: Request, res: Response) => {
    const isMentor = req.user!.role === "MENTOR";

    const meetings = await prisma.meeting.findMany({
      where: isMentor ? { mentorId: req.user!.id } : { userId: req.user!.id },
      orderBy: { createdAt: "desc" },
      include: { mentor: true, user: true },
    });

    res.json(meetings);
  })
);
