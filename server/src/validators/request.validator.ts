import { z } from "zod";

export const createRequestSchema = z.object({
  listingId: z.number().int("Listing ID must be a whole number"),
  message: z
    .string()
    .max(500, "Message must be at most 500 characters")
    .optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
