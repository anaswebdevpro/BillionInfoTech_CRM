import React from 'react';
import { COLORS } from '../../../constants/colors';
import { PaginationControlsProps } from './types';

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  filteredDataLength,
  totalDataLength,
  onPageChange,
}) => {
  return (
    <div className={`px-4 py-3 border-t border-${COLORS.BORDER} bg-${COLORS.SECONDARY_BG}`}>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, filteredDataLength)} of {filteredDataLength} entries
          {filteredDataLength !== totalDataLength && (
            <span className="ml-2 text-gray-500">
              (filtered from {totalDataLength} total entries)
            </span>
          )}
        </div>
        
        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 border border-${COLORS.BORDER} rounded-md hover:bg-${COLORS.SECONDARY_BG} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1 border rounded-md transition-colors ${
                    currentPage === pageNum
                      ? `bg-${COLORS.PRIMARY} text-white border-${COLORS.PRIMARY}`
                      : `border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG}`
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 border border-${COLORS.BORDER} rounded-md hover:bg-${COLORS.SECONDARY_BG} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaginationControls;
