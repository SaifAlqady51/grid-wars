import { z } from "zod";
import { globalStyles } from "../../styles";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])./;

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

const basicPasswordSchema = z
  .string()
  .min(
    PASSWORD_MIN_LENGTH,
    `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  );

const strongPasswordSchema = basicPasswordSchema.regex(
  PASSWORD_REGEX,
  "Password must contain uppercase, lowercase, number, and special character",
);

export const LoginSchema = z.object({
  email: emailSchema,
  password: basicPasswordSchema,
});

export const RegisterSchema = z
  .object({
    email: emailSchema,
    password: strongPasswordSchema,
    username: z
      .string()
      .min(1, "Username is required")
      .max(20, "Username is too long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Export types
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;

// Password strength checker
export const getPasswordStrength = (password: string) => {
  if (!password || password.length === 0) return null;

  if (password.length < 4) {
    return {
      strength: "weak" as const,
      color: globalStyles.colors.destructive,
    };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return { strength: "medium" as const, color: globalStyles.colors.warning };
  }

  try {
    strongPasswordSchema.parse(password);
    return { strength: "strong" as const, color: globalStyles.colors.success };
  } catch {
    return { strength: "medium" as const, color: globalStyles.colors.warning };
  }
};

// Password requirements for display
export const PASSWORD_REQUIREMENTS = [
  `At least ${PASSWORD_MIN_LENGTH} characters`,
  "One uppercase letter",
  "One lowercase letter",
  "One number",
  "One special character (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?])",
] as const;
