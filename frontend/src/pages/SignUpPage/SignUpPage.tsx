import { useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaGoogle, FaGithub } from "react-icons/fa";
import InputField from "../../components/Form/InputField";
import CheckboxField from "../../components/Form/CheckboxField";
import Loader from "../../components/Loader/Loader";
import {
  registerSchema,
  type RegisterFormValues,
} from "../../schemas/authSchemas";
import { useRegisterMutation } from "../../redux/slices/authApiSlice";
import { setCredentials } from "../../redux/slices/authSlice";
import type { RootState } from "../../redux/store";

export default function SignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  const initialValues: RegisterFormValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    socialLinks: {
      website: "",
      facebook: "",
      instagram: "",
      linkedin: "",
      x: "",
      youtube: "",
    },
    agreeToTerms: false,
    role: "user",
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      const { confirmPassword, agreeToTerms, socialLinks, ...baseValues } =
        values;

      const filteredSocialLinks = Object.fromEntries(
        Object.entries(socialLinks).filter(([_, value]) => value.trim() !== "")
      );

      const submitValues = {
        ...baseValues,
        ...(Object.keys(filteredSocialLinks).length > 0 && {
          socialLinks: filteredSocialLinks,
        }),
      };

      const result = await register(submitValues).unwrap();
      dispatch(setCredentials(result));
      toast.success("Registration successful! Welcome to MeroBlog!");
      navigate("/");
    } catch (error: any) {
      const errorMessage =
        error?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="sm:mx-auto sm:w-full sm:max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="text-center" variants={itemVariants}>
          <Link
            to="/"
            className="text-3xl font-bold text-gray-900 hover:text-gray-700 transition-colors duration-200"
          >
            MeroBlog
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our community of writers and readers
          </p>
        </motion.div>

        <motion.div
          className="mt-8 bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10"
          variants={itemVariants}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({ isValid, dirty }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="firstName"
                    label="First Name"
                    type="text"
                    placeholder="Enter your first name"
                    autoComplete="given-name"
                  />
                  <InputField
                    name="lastName"
                    label="Last Name"
                    type="text"
                    placeholder="Enter your last name"
                    autoComplete="family-name"
                  />
                </div>

                <InputField
                  name="email"
                  label="Email address"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                />

                <InputField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />

                <InputField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">
                    Social Links (Optional)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      name="socialLinks.website"
                      label="Website"
                      type="url"
                      placeholder="https://yourwebsite.com"
                    />
                    <InputField
                      name="socialLinks.linkedin"
                      label="LinkedIn"
                      type="url"
                      placeholder="https://linkedin.com/in/username"
                    />
                    <InputField
                      name="socialLinks.x"
                      label="X (Twitter)"
                      type="url"
                      placeholder="https://x.com/username"
                    />
                    <InputField
                      name="socialLinks.facebook"
                      label="Facebook"
                      type="url"
                      placeholder="https://facebook.com/username"
                    />
                    <InputField
                      name="socialLinks.instagram"
                      label="Instagram"
                      type="url"
                      placeholder="https://instagram.com/username"
                    />
                    <InputField
                      name="socialLinks.youtube"
                      label="YouTube"
                      type="url"
                      placeholder="https://youtube.com/@username"
                    />
                  </div>
                </div>

                <CheckboxField name="agreeToTerms">
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-gray-900 hover:text-gray-700 underline"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-gray-900 hover:text-gray-700 underline"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </CheckboxField>

                <motion.button
                  type="submit"
                  disabled={!isValid || !dirty || isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader size="sm" variant="spinner" />
                      <span className="ml-2">Creating account...</span>
                    </div>
                  ) : (
                    "Create account"
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGoogle className="w-5 h-5" />
              <span className="ml-2">Google</span>
            </motion.button>

            <motion.button
              type="button"
              className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaGithub className="w-5 h-5" />
              <span className="ml-2">GitHub</span>
            </motion.button>
          </div>
        </motion.div>

        <motion.div className="mt-6 text-center" variants={itemVariants}>
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-gray-900 hover:text-gray-700 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
