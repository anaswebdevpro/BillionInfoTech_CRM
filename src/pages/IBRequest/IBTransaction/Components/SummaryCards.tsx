import React from 'react';
import { Card } from '../../../../components/ui';
import { COLORS } from '../../../../constants/colors';
import { DollarSign, BarChart3 } from 'lucide-react';

const SummaryCards: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className={`text-4xl font-bold text-${COLORS.SECONDARY} mb-1`}>$1,642.95</div>
            <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT} uppercase tracking-wide`}>
              Total Earned Commission
            </div>
            <div className={`text-sm text-green-600 font-medium mt-1`}>
              ↗ +12.5% from last month
            </div>
          </div>
        </div>
      </Card>

      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className={`text-4xl font-bold text-${COLORS.SECONDARY} mb-1`}>24.7</div>
            <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT} uppercase tracking-wide`}>
              Total Lots Traded
            </div>
            <div className={`text-sm text-green-600 font-medium mt-1`}>
              ↗ +8.2% from last month
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryCards;