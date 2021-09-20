import { z } from "zod";

export const entryValidation = z.object({
  event: z.enum(["entry.create", "entry.update", "entry.delete"]),
  created_at: z.string(),
  model: z.string(),
  entry: z.object({
    id: z.number().int(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export type EntryEvent = z.infer<typeof entryValidation>;
