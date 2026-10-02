import * as z from "zod";

export const AuthFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { error: "Username must be at least 3 characters long." })
    .max(32, { error: "Username must be at most 32 characters long." })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username may only contain letters, numbers, and underscores.",
    }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long." })
    .max(100, { error: "Password must be at most 100 characters long." }),
});

export type AuthFormState =
  | {
      errors?: {
        username?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export type SessionPayload = {
  userId: string;
  username: string;
  expiresAt: Date;
};
