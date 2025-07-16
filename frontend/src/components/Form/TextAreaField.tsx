import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Field, ErrorMessage } from 'formik';
import clsx from 'clsx';

interface TextAreaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  className?: string;
  disabled?: boolean;
  showCharCount?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  name,
  label,
  placeholder,
  rows = 4,
  maxLength,
  className = '',
  disabled = false,
  showCharCount = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={clsx('relative', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Field name={name}>
        {({ field, meta }: any) => {
          const hasError = meta.touched && meta.error;
          const hasValue = field.value && field.value.length > 0;
          const charCount = field.value ? field.value.length : 0;

          return (
            <div className="relative">
              {/* Label */}
              <motion.label
                htmlFor={name}
                className={clsx(
                  'absolute left-3 transition-all duration-200 pointer-events-none z-10',
                  {
                    'text-xs -top-2 bg-white px-1 text-gray-600': isFocused || hasValue,
                    'text-sm top-3 text-gray-500': !isFocused && !hasValue,
                    'text-red-500': hasError,
                  }
                )}
                animate={{
                  fontSize: isFocused || hasValue ? '0.75rem' : '0.875rem',
                  y: isFocused || hasValue ? -20 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                {label}
              </motion.label>

              {/* TextArea */}
              <textarea
                {...field}
                id={name}
                rows={rows}
                maxLength={maxLength}
                placeholder={isFocused ? placeholder : ''}
                disabled={disabled}
                className={clsx(
                  'w-full px-3 py-3 border rounded-lg transition-all duration-200 bg-white resize-none',
                  'focus:outline-none focus:ring-2 focus:ring-offset-0',
                  {
                    'border-gray-300 focus:border-gray-500 focus:ring-gray-200': !hasError,
                    'border-red-500 focus:border-red-500 focus:ring-red-200': hasError,
                    'bg-gray-50 cursor-not-allowed': disabled,
                  }
                )}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={{ minHeight: `${rows * 1.5}rem` }}
              />

              {/* Character Count */}
              {showCharCount && maxLength && (
                <motion.div
                  className={clsx(
                    'absolute bottom-2 right-3 text-xs',
                    {
                      'text-gray-500': charCount < maxLength * 0.8,
                      'text-yellow-600': charCount >= maxLength * 0.8 && charCount < maxLength,
                      'text-red-500': charCount >= maxLength,
                    }
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isFocused || hasValue ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {charCount}/{maxLength}
                </motion.div>
              )}
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

export default TextAreaField;
