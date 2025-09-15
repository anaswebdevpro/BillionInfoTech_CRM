import React from 'react';
import { cn } from '../../utils/cn';
import { COLORS } from '../../constants/colors';
import { ShimmerText } from './Shimmer';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  loadingLines?: number;
}

/**
 * Reusable Card component for consistent layout
 * Used throughout the dashboard for content containers
 * Includes shimmer loading states
 */
const Card: React.FC<CardProps> = ({
  children,
  className,
  title,
  subtitle,
  loading = false,
  loadingLines = 3,
}) => {
  if (loading) {
    return (
      <div className={cn(`bg-${COLORS.WHITE} rounded-lg shadow-sm border border-${COLORS.BORDER}`, className)}>
        {(title || subtitle) && (
          <div className={`px-6 py-4 border-b border-${COLORS.BORDER}`}>
            <ShimmerText width="60%" height={20} />
            {subtitle && <ShimmerText width="40%" height={14} className="mt-2" />}
          </div>
        )}
        <div className="p-6 space-y-3">
          {Array.from({ length: loadingLines }).map((_, index) => (
            <ShimmerText key={index} width={`${80 + Math.random() * 20}%`} height={16} />
          ))}
        </div>
      </div>
    );
  }

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
