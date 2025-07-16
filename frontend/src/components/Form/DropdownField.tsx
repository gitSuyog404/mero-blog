import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Field, ErrorMessage } from "formik";
import clsx from "clsx";

interface Option {
  value: string;
  label: string;
}

interface DropdownFieldProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  name,
  label,
  options,
  placeholder = "Select an option",
  className = "",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={clsx("relative", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Field name={name}>
        {({ field, form, meta }: any) => {
          const hasError = meta.touched && meta.error;
          const hasValue = field.value && field.value !== "";
          const selectedOption = options.find(
            (option) => option.value === field.value
          );

          const handleSelect = (option: Option) => {
            form.setFieldValue(name, option.value);
            setIsOpen(false);
            setIsFocused(false);
          };

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

              {/* Dropdown Button */}
              <motion.button
                type="button"
                className={clsx(
                  "w-full px-4 py-3 border rounded-lg transition-all duration-200 bg-white text-left flex items-center justify-between",
                  "focus:outline-none focus:ring-2 focus:ring-offset-0",
                  "hover:border-gray-400 hover:shadow-sm",
                  {
                    "border-gray-300 focus:border-gray-500 focus:ring-gray-200":
                      !hasError && !isOpen,
                    "border-red-500 focus:border-red-500 focus:ring-red-200":
                      hasError,
                    "bg-gray-50 cursor-not-allowed hover:border-gray-300 hover:shadow-none":
                      disabled,
                    "border-gray-500 ring-2 ring-gray-200": isOpen,
                  }
                )}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
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
                whileTap={{ scale: disabled ? 1 : 0.98 }}
              >
                <span
                  className={clsx("block truncate", {
                    "text-gray-500": !selectedOption,
                    "text-gray-900": selectedOption,
                  })}
                >
                  {selectedOption ? selectedOption.label : placeholder}
                </span>

                <motion.svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </motion.button>

              {/* Dropdown Options */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {options.map((option, index) => (
                      <motion.button
                        key={option.value}
                        type="button"
                        className={clsx(
                          "w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150",
                          {
                            "bg-gray-100": option.value === field.value,
                            "rounded-t-lg": index === 0,
                            "rounded-b-lg": index === options.length - 1,
                          }
                        )}
                        onClick={() => handleSelect(option)}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ backgroundColor: "rgb(249, 250, 251)" }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hidden input for form submission */}
              <input type="hidden" name={name} value={field.value || ""} />
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

export default DropdownField;
