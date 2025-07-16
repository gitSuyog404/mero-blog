import * as Yup from "yup";

// Types for form values
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
  role?: "admin" | "user";
}

// Login Schema
export const loginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .max(50, "Email must be less than 50 characters")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
});

// Register Schema
export const registerSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .max(50, "Email must be less than 50 characters")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  // Role is not validated since it's always 'user' and not user-selectable
});
