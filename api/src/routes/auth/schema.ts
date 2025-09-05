import z from "zod";

export const insertUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .describe("User's email address")
    .default("test@test.com"),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .describe("User's full name")
    .default("Test Silva"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .describe("User's password")
    .default("Test123!!!"),
});

export const loginUserSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .describe("User's email address")
    .default("test@test.com"),
  password: z
    .string()
    .min(1, "Password is required")
    .describe("User's password")
    .default("Test123!!!"),
});
