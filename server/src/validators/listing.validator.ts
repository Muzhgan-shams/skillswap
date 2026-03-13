import { z } from "zod";

export const createListingSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum(
    [
      "Technology",
      "Music",
      "Language",
      "Cooking",
      "Fitness",
      "Art",
      "Business",
      "Other",
    ],
    { error: "Please select a valid category" },
  ),
  skillOffered: z
    .string()
    .min(3, "Skill offered must be at least 3 characters"),
  skillWanted: z.string().min(3, "Skill wanted must be at least 3 characters"),
  hours: z
    .number()
    .int("Hours must be a whole number")
    .min(1, "Must offer at least 1 hour")
    .max(100, "Cannot offer more than 100 hours"),
});

export const updateListingSchema = createListingSchema.partial().extend({
  isAvailable: z.boolean().optional(), // takes create fields and makes them optional, then adds isAvailable as an optional field
});

export type CreateListingInput = z.infer<typeof createListingSchema>;
export type UpdateListingInput = z.infer<typeof updateListingSchema>;
