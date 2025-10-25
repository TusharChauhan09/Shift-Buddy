import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Valid email required").max(190),
  registrationNumber: z
    .string()
    .trim()
    .min(3, "Registration number too short")
    .max(50)
    .regex(/^[A-Za-z0-9-_]+$/, "Registration number can contain letters, numbers, dash and underscore only"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, "Password must include at least one letter and one number"),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
