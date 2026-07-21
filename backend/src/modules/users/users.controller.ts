import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";

export async function getMe(req: Request, res: Response) {
  const me = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.id } });
  res.json({
    id: me.id,
    name: me.name,
    email: me.email,
    role: me.role,
    tags: me.tags,
    description: me.description,
    domain: me.domain,
    timezone: me.timezone,
  });
}

export async function updateMe(req: Request, res: Response) {
  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: req.body,
  });
  res.json({
    id: updated.id,
    tags: updated.tags,
    description: updated.description,
    domain: updated.domain,
  });
}
