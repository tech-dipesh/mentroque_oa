import { z } from "zod";

export const updateMentorMetaSchema = z.object({
  tags: z.array(z.string().min(1)).max(15),
  description: z.string().optional(),
  domain: z.string().min(1),
});

export type UpdateMentorMetaInput = z.infer<typeof updateMentorMetaSchema>;

export const mentorIdParamsSchema = z.object({
  mentorId: z.string().uuid(),
});
