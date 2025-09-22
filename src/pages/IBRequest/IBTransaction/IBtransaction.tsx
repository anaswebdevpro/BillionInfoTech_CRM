import React from 'react';

import { COLORS } from '../../../constants/colors';
import SummaryCards from './Components/SummaryCards';
import PartnerCommissionsTable from './Components/PartnerCommissionsTable';
import LotWiseCommissionsTable from './Components/LotWiseCommissionsTable';

const IBTransaction: React.FC = () => {


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY} tracking-tight`}>
            IB Transaction
          </h1>
          <p className={`text-base text-${COLORS.SECONDARY_TEXT} mt-2 font-medium`}>
            Monitor and manage IB transactions with real-time insights
          </p>
        </div>
      
      </div>

      {/* Summary Cards Component */}
      <SummaryCards />

      {/* Data Tables Components */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PartnerCommissionsTable />
        <LotWiseCommissionsTable />
      </div>
    </div>
  );
};

export default IBTransaction;
