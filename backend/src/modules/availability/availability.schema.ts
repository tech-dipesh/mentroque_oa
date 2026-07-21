import { z } from "zod";

const timeString = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must look like 14:30");

export const createSlotSchema = z
  .object({
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: timeString,
    endTime: timeString,
  })
  .refine((slot) => slot.startTime < slot.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
  });

export type CreateSlotInput = z.infer<typeof createSlotSchema>;

export const slotIdParamsSchema = z.object({
  slotId: z.string().uuid(),
});
