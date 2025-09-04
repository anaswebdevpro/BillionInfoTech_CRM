import React from 'react';
import { cn } from '../../utils/cn';
import { COLORS } from '../../constants/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

/**
 * Reusable Button component with multiple variants and sizes
 * Follows the DRY principle for consistent button styling
 */
const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: `bg-${COLORS.PRIMARY} text-${COLORS.WHITE} hover:bg-green-700 focus:ring-${COLORS.PRIMARY_BG}`,
    secondary: `bg-gray-600 text-${COLORS.WHITE} hover:bg-gray-700 focus:ring-gray-500`,
    outline: `border border-${COLORS.GRAY_BORDER} bg-${COLORS.WHITE} text-gray-700 hover:bg-gray-50 focus:ring-blue-500`,
    ghost: `text-${COLORS.SECONDARY_TEXT} hover:bg-gray-100 focus:ring-gray-500`,
  } as const;

  const sizes = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
