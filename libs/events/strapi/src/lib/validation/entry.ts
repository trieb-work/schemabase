import { z } from "zod";
import { Topic } from "../types";

export const eventValidation = z.object({
  created_at: z.string(),
  model: z.string(),
  entry: z.object({
    id: z.number().int(),
    created_at: z.string(),
    updated_at: z.string(),
  }),
});

export const validation: Record<Topic, z.AnyZodObject> = {
  "strapi.entry.create": z
    .object({
      event: z.enum(["entry.create"]),
    })
    .merge(eventValidation),
  "strapi.entry.update": z
    .object({
      event: z.enum(["entry.update"]),
    })
    .merge(eventValidation),
  "strapi.entry.delete": z
    .object({
      event: z.enum(["entry.delete"]),
    })
    .merge(eventValidation),
};

export type EntryCreateEvent = z.infer<typeof validation[Topic.ENTRY_CREATE]>;
export type EntryUpdateEvent = z.infer<typeof validation[Topic.ENTRY_UPDATE]>;
export type EntryDeleteEvent = z.infer<typeof validation[Topic.ENTRY_DELETE]>;
export type EntryEvent = EntryCreateEvent | EntryUpdateEvent | EntryDeleteEvent;
