import React from 'react';
import { cn } from '../../utils/cn';
import { COLORS } from '../../constants/colors';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

/**
 * Reusable Input component with label and error support
 * Implements consistent styling across the application
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  return (
  <div className="w-full">
      {label && (
    <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-1`}>
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={cn(
      `block w-full px-3 py-2 border border-${COLORS.GRAY_BORDER} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY_BG} focus:border-${COLORS.PRIMARY_BG}`,
            icon && 'pl-10',
            error && 'border-red-500 focus:ring-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
