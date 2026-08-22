import * as zod from "zod";

export const schema = zod.object({
  email: zod.string().email("Invalid email address"),

  password: zod
    .string()
    .nonempty("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be at most 20 characters long")
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
    ),
});
