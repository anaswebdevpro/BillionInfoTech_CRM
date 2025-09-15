import React from 'react';
import { COLORS } from '../../../constants/colors';
import { SummaryCardsProps } from './types';

const SummaryCards: React.FC<SummaryCardsProps> = ({
  filteredData,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
        <div className={`text-2xl font-bold text-${COLORS.PRIMARY}`}>{filteredData.length}</div>
        <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Filtered Results</div>
      </div>
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
        <div className={`text-2xl font-bold text-green-600`}>
          {filteredData.filter(item => 'status' in item && item.status === 1).length}
        </div>
        <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Active Items</div>
      </div>
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
        <div className={`text-2xl font-bold text-red-600`}>
          {filteredData.filter(item => 'status' in item && item.status === 0).length}
        </div>
        <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Inactive Items</div>
      </div>
    </div>
  );
};

export default SummaryCards;
