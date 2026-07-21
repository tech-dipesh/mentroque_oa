import { z } from "zod";

export const updateOwnProfileSchema = z.object({
  tags: z.array(z.string().min(1)).max(15),
  description: z.string().min(10),
  domain: z.string().min(1),
});

export type UpdateOwnProfileInput = z.infer<typeof updateOwnProfileSchema>;
