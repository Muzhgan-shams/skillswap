import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters"),
  email: z.email("Please provide a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  bio: z.string().optional(),
  city: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email("Please provide a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .optional(),
  bio: z.string().max(300, "Bio must be at most 300 characters").optional(),
  city: z.string().min(2, "City must be at least 2 characters").optional(),
});

// Generate TypeScript type from schema
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
