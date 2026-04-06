import { z } from "zod";

export const createMessageSchema = z.object({
  requestId: z.number().int("Request ID must be a whole number"),
  receiverId: z.number().int("Receiver ID must be a whole number"),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(1000, "Message must be at most 1000 characters"),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
