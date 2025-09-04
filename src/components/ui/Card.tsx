import React from 'react';
import { cn } from '../../utils/cn';
import { COLORS } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

/**
 * Reusable Card component for consistent layout
 * Used throughout the dashboard for content containers
 */
const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
}) => {
  return (
    <div className={cn(`bg-${COLORS.WHITE} rounded-lg shadow-sm border border-${COLORS.BORDER}`, className)}>
      {(title || subtitle) && (
        <div className={`px-6 py-4 border-b border-${COLORS.BORDER}`}>
          {title && <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>{title}</h3>}
          {subtitle && <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mt-1`}>{subtitle}</p>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
