import { z } from "zod";

export const createReviewSchema = z.object({
  requestId: z.number().int("Request ID must be a whole number"),
  revieweeId: z.number().int("Reviewee ID must be a whole number"),
  rating: z
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  title: z.string().max(100, "Title must be at most 100 characters").optional(),
  description: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(500, "Review must be at most 500 characters"),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
