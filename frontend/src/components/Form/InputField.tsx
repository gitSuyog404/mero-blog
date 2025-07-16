import React, { useState } from "react";
import { motion } from "framer-motion";
import { Field, ErrorMessage } from "formik";
import clsx from "clsx";

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = "text",
  placeholder,
  className = "",
  disabled = false,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";

  return (
    <motion.div
      className={clsx("relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Field name={name}>
        {({ field, meta }: any) => {
          const hasError = meta.touched && meta.error;

          return (
            <div className="relative">
              {/* Label */}
              <motion.label
                htmlFor={name}
                className={clsx(
                  "block text-sm font-medium mb-2 transition-colors duration-200",
                  {
                    "text-gray-700": !hasError,
                    "text-red-600": hasError,
                  }
                )}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.15,
                  ease: "easeOut",
                }}
              >
                {label}
              </motion.label>

              {/* Input Container */}
              <div className="relative">
                {/* Input */}
                <motion.input
                  {...field}
                  id={name}
                  type={isPasswordField && showPassword ? "text" : type}
                  placeholder={placeholder}
                  autoComplete={autoComplete}
                  disabled={disabled}
                  className={clsx(
                    "w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-white",
                    "focus:outline-none focus:ring-2 focus:ring-offset-0",
                    "hover:border-gray-400 hover:shadow-sm",
                    {
                      "border-gray-300 focus:border-gray-500 focus:ring-gray-200":
                        !hasError,
                      "border-red-500 focus:border-red-500 focus:ring-red-200":
                        hasError,
                      "bg-gray-50 cursor-not-allowed hover:border-gray-300 hover:shadow-none":
                        disabled,
                      "pr-12": isPasswordField,
                    }
                  )}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.05,
                    ease: "easeOut",
                  }}
                  whileFocus={{
                    y: -1,
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: { duration: 0.15, ease: "easeOut" },
                  }}
                  whileHover={
                    !disabled
                      ? {
                          y: -0.5,
                          transition: { duration: 0.15, ease: "easeOut" },
                        }
                      : {}
                  }
                />

                {/* Password Toggle */}
                {isPasswordField && (
                  <motion.button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-150 flex items-center justify-center"
                    onClick={() => setShowPassword(!showPassword)}
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      transition: { duration: 0.15, ease: "easeOut" },
                    }}
                    whileTap={{
                      scale: 0.9,
                      rotate: -5,
                      transition: { duration: 0.1 },
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      delay: 0.1,
                      ease: "easeOut",
                    }}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          );
        }}
      </Field>

      {/* Error Message */}
      <ErrorMessage name={name}>
        {(msg) => (
          <motion.div
            className="text-red-500 text-sm mt-1 ml-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {msg}
          </motion.div>
        )}
      </ErrorMessage>
    </motion.div>
  );
};

export default InputField;
