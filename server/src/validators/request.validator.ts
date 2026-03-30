import { z } from "zod";

export const createRequestSchema = z.object({
  listingId: z.number().int("Listing ID must be a whole number"),
  message: z
    .string()
    .max(500, "Message must be at most 500 characters")
    .optional(),
});

export const updateRequestSchema = z.object({
  status: z.enum(["ACCEPTED", "REJECTED", "COMPLETED"], {
    error: "Status must be ACCEPTED, REJECTED or COMPLETED",
  }),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestInput = z.infer<typeof updateRequestSchema>;
