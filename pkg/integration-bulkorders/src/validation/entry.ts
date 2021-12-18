import { z } from "zod";

export const entryEventValidation = z.object({
  created_at: z.string(),
  event: z.enum(["entry.create", "entry.update", "entry.delete"]),
  model: z.string(),
  entry: z.object({
    id: z.number().int(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export type EntryEvent = z.infer<typeof entryEventValidation>;
