import * as Yup from "yup";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  socialLinks: {
    website: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    x: string;
    youtube: string;
  };
  agreeToTerms: boolean;
  role?: "admin" | "user";
}

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

export const registerSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required("First name is required")
    .max(20, "First name must be less than 20 characters"),
  lastName: Yup.string()
    .trim()
    .required("Last name is required")
    .max(20, "Last name must be less than 20 characters"),
  email: Yup.string()
    .trim()
    .required("Email is required")
    .max(50, "Email must be less than 50 characters")
    .email("Invalid email address"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters long"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
  socialLinks: Yup.object({
    website: Yup.string()
      .trim()
      .test("is-url-or-empty", "Please enter a valid URL", function (value) {
        if (!value || value === "") return true;
        return Yup.string().url().isValidSync(value);
      })
      .max(100, "Website URL must be less than 100 characters"),
    facebook: Yup.string()
      .trim()
      .test("is-url-or-empty", "Please enter a valid URL", function (value) {
        if (!value || value === "") return true;
        return Yup.string().url().isValidSync(value);
      })
      .max(100, "Facebook URL must be less than 100 characters"),
    instagram: Yup.string()
      .trim()
      .test("is-url-or-empty", "Please enter a valid URL", function (value) {
        if (!value || value === "") return true;
        return Yup.string().url().isValidSync(value);
      })
      .max(100, "Instagram URL must be less than 100 characters"),
    linkedin: Yup.string()
      .trim()
      .test("is-url-or-empty", "Please enter a valid URL", function (value) {
        if (!value || value === "") return true;
        return Yup.string().url().isValidSync(value);
      })
      .max(100, "LinkedIn URL must be less than 100 characters"),
    x: Yup.string()
      .trim()
      .test("is-url-or-empty", "Please enter a valid URL", function (value) {
        if (!value || value === "") return true;
        return Yup.string().url().isValidSync(value);
      })
      .max(100, "X (Twitter) URL must be less than 100 characters"),
    youtube: Yup.string()
      .trim()
      .test("is-url-or-empty", "Please enter a valid URL", function (value) {
        if (!value || value === "") return true;
        return Yup.string().url().isValidSync(value);
      })
      .max(100, "YouTube URL must be less than 100 characters"),
  }),
  agreeToTerms: Yup.boolean()
    .required("You must agree to the terms and conditions")
    .oneOf([true], "You must agree to the terms and conditions"),
});
