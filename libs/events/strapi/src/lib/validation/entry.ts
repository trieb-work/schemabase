import { z } from "zod";

export const entryEventValidation = z.object({
  created_at: z.string(),
  event: z
    .string()
    .refine(
      (e) =>
        e.includes("entry.create") ||
        e.includes("entry.update") ||
        e.includes("entry.delete"),
    ),
  model: z.string(),
  entry: z.object({
    id: z.number().int(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
  // Used to fetch more data from strapi if necessary
  origin: z.string(),
});

export type EntryEvent = z.infer<typeof entryEventValidation>;
