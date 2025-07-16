import { useEffect } from "react";
import { motion } from "framer-motion";
import { Formik, Form } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { InputField } from "../../components/Form";
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
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Always default to user role
  };

  // Redirect if already logged in
  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      // Remove confirmPassword before sending to API
      const { confirmPassword, ...submitValues } = values;
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
        {/* Header */}
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

        {/* Form Container */}
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
                {/* Email Field */}
                <InputField
                  name="email"
                  label="Email address"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                />

                {/* Password Field */}
                <InputField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                />

                {/* Confirm Password Field */}
                <InputField
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />

                {/* Terms and Privacy */}
                <div className="text-sm text-gray-600">
                  By creating an account, you agree to our{" "}
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
                  .
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={!isValid || !dirty || isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                      Creating account...
                    </div>
                  ) : (
                    "Create account"
                  )}
                </motion.button>
              </Form>
            )}
          </Formik>

          {/* Divider */}
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

          {/* Social Login Buttons */}
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

        {/* Sign In Link */}
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
