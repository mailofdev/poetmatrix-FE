import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(10, { error: "Use at least 10 characters." })
  .max(128, { error: "Use at most 128 characters." })
  .regex(/[A-Za-z]/, { error: "Include at least one letter." })
  .regex(/\d/, { error: "Include at least one number." });

export const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).max(320),
  password: z.string().min(1, { error: "Enter your password." }).max(128),
});

export const registerSchema = loginSchema.extend({
  password: passwordSchema,
  role: z.enum(["reader", "writer"], {
    error: "Choose reader or writer.",
  }),
});

export const forgotPasswordSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }).max(320),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20, { error: "Reset link is incomplete." }).max(256),
  password: passwordSchema,
});

export type ActionState = {
  error?: string;
  message?: string;
  developmentResetToken?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export function fieldErrors(
  error: z.ZodError,
): Record<string, string[] | undefined> {
  return error.flatten().fieldErrors;
}
