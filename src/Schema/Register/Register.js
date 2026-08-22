import * as zod from "zod";

export const schema = zod
  .object({
    name: zod
      .string()
      .nonempty("Name is required")
      .min(4, "Name must be at least 4 characters long")
      .max(20, "Name must be at most 20 characters long"),

    username: zod
      .string()
      .nonempty("Username is required")
      .regex(
        /^[A-Z][a-z0-9]{5,21}$/,
        "Username must start with an uppercase letter and be 6 to 20 characters long.",
      ),

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

    rePassword: zod
      .string()
      .nonempty("Please confirm your password")
      .min(6, "Password must be at least 6 characters long")
      .max(20, "Password must be at most 20 characters long"),

    dateOfBirth: zod.coerce.date().refine(
      (dateValue) => {
        const today = new Date();

        const birthDate = new Date(dateValue);

        const age = today.getFullYear() - birthDate.getFullYear();

        return age >= 18;
      },
      {
        message: "You must be at least 18 years old",
      },
    ),

    gender: zod.enum(["male", "female"], {
      message: "Gender is required",
    }),
  })
  .refine((obj) => obj.password === obj.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });
