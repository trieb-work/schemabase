import { z } from "zod";

export const accountConfirmationValidation = z.object({
    notify_event: z.enum(["account_confirmation"]),
    payload: z.object({
        user: z.object({
            id: z.number().int(),
            email: z.string().email(),
            first_name: z.string(),
            last_name: z.string(),
            is_staff: z.boolean(),
            is_active: z.boolean(),
            private_metadata: z.unknown(),
            metadata: z.unknown(),
            language_code: z.string(),
        }),
        recipient_email: z.string().email(),
        token: z.string(),
        confirm_url: z.string().url(),
        domain: z.string(),
        site_name: z.string(),
    }),
});
