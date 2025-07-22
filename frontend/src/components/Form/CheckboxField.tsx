import React from "react";
import { Field, ErrorMessage } from "formik";
import { motion } from "framer-motion";

interface CheckboxFieldProps {
  name: string;
  label?: string;
  children?: React.ReactNode;
  className?: string;
}

const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  children,
  className = "",
}) => {
  return (
    <div className={`${className}`}>
      <Field name={name}>
        {({ field, meta }: any) => (
          <div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  {...field}
                  type="checkbox"
                  checked={field.value}
                  className={`w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2 transition-colors duration-200 ${
                    meta.touched && meta.error
                      ? "border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                />
              </div>
              <div className="ml-3 text-sm">
                {label && (
                  <label htmlFor={name} className="text-gray-700">
                    {label}
                  </label>
                )}
                {children && (
                  <div className="text-gray-600">
                    {children}
                  </div>
                )}
              </div>
            </div>
            <ErrorMessage name={name}>
              {(msg) => (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-1 text-sm text-red-600"
                >
                  {msg}
                </motion.div>
              )}
            </ErrorMessage>
          </div>
        )}
      </Field>
    </div>
  );
};

export default CheckboxField;
