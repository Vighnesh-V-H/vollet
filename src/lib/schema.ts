import { z } from "zod";

export const passwordSchema = z
  .object({
    password: z
      .string({ required_error: "Password can't be empty" })
      .min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string({
      required_error: "Confirm password can't be empty",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
