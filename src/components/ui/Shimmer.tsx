import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { cn } from '../../utils/cn';

interface ShimmerProps {
  count?: number;
  height?: number | string;
  width?: number | string;
  circle?: boolean;
  className?: string;
  duration?: number;
  baseColor?: string;
  highlightColor?: string;
}

/**
 * Shimmer component using react-loading-skeleton
 * Provides consistent loading states across the application
 */
const Shimmer: React.FC<ShimmerProps> = ({
  count = 1,
  height,
  width,
  circle = false,
  className,
  duration = 1.2,
  baseColor = '#f0f0f0',
  highlightColor = '#e0e0e0',
}) => {
  return (
    <SkeletonTheme
      baseColor={baseColor}
      highlightColor={highlightColor}
      duration={duration}
    >
      <Skeleton
        count={count}
        height={height}
        width={width}
        circle={circle}
        className={cn(className)}
      />
    </SkeletonTheme>
  );
};

// Predefined shimmer components for common use cases
export const ShimmerText: React.FC<Omit<ShimmerProps, 'circle'>> = (props) => (
  <Shimmer {...props} />
);

export const ShimmerCircle: React.FC<Omit<ShimmerProps, 'circle'>> = (props) => (
  <Shimmer {...props} circle={true} />
);

export const ShimmerCard: React.FC<Omit<ShimmerProps, 'circle'>> = (props) => (
  <Shimmer {...props} height={200} />
);

export const ShimmerButton: React.FC<Omit<ShimmerProps, 'circle'>> = (props) => (
  <Shimmer {...props} height={40} />
);

export const ShimmerTable: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string;
}> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex space-x-3">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Shimmer
            key={colIndex}
            width={`${100 / columns}%`}
            height={20}
          />
        ))}
      </div>
    ))}
  </div>
);

export const ShimmerList: React.FC<{ 
  items?: number; 
  className?: string;
}> = ({ 
  items = 5, 
  className 
}) => (
  <div className={cn("space-y-3", className)}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-3">
        <ShimmerCircle height={40} width={40} />
        <div className="flex-1 space-y-2">
          <ShimmerText width="70%" height={16} />
          <ShimmerText width="40%" height={12} />
        </div>
      </div>
    ))}
  </div>
);

// Dashboard specific shimmer components
export const ShimmerStatsCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-6 bg-white rounded-lg shadow-sm border border-gray-200", className)}>
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <ShimmerText width={120} height={16} />
        <ShimmerText width={80} height={24} />
      </div>
      <ShimmerCircle height={48} width={48} />
    </div>
  </div>
);

export const ShimmerChart: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn("p-6 bg-white rounded-lg shadow-sm border border-gray-200", className)}>
    <div className="space-y-4">
      <ShimmerText width={200} height={20} />
      <Shimmer height={200} />
    </div>
  </div>
);

export const ShimmerDataTable: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string;
}> = ({ 
  rows = 10, 
  columns = 5, 
  className 
}) => (
  <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
    <div className="p-6 border-b border-gray-200">
      <ShimmerText width={150} height={20} />
    </div>
    <div className="p-6">
      <ShimmerTable rows={rows} columns={columns} />
    </div>
  </div>
);

export default Shimmer;
