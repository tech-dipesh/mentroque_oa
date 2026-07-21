import type { Request, Response } from "express";
import { addSlot, listSlotsForOwner, removeSlot } from "./availability.service.js";

export async function getMySlots(req: Request, res: Response) {
  const slots = await listSlotsForOwner(req.user!.id);
  res.json(slots);
}

export async function createMySlot(req: Request, res: Response) {
  const slot = await addSlot(req.user!.id, req.body);
  res.status(201).json(slot);
}

export async function deleteMySlot(req: Request, res: Response) {
  await removeSlot(req.user!.id, req.params.slotId);
  res.status(204).send();
}
