import { z } from "zod";

export const createRequestSchema = z.object({
  callType: z.enum(["RESUME_REVAMP", "JOB_MARKET_GUIDANCE", "MOCK_INTERVIEW"]),
  description: z.string().min(10, "Give a bit more detail, at least 10 characters"),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;

export const requestIdParamsSchema = z.object({
  requestId: z.string().uuid(),
});

export const bookCallSchema = z
  .object({
    mentorId: z.string().uuid(),
    dayOfWeek: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Start time must be before end time",
    path: ["endTime"],
  });

export type BookCallInput = z.infer<typeof bookCallSchema>;
