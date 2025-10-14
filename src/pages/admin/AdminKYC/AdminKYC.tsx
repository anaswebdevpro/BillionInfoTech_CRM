import React from 'react';
import { COLORS } from '../../../constants/colors';

const AdminKYC: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>KYC Management</h1>
        <p className={`text-${COLORS.SECONDARY_TEXT} mt-2`}>Know Your Customer verification and compliance</p>
        <div className={`mt-6 bg-${COLORS.PRIMARY_BG_LIGHT} border border-${COLORS.PRIMARY_BG} rounded-lg p-4`}>
          <p className={`text-${COLORS.PRIMARY}`}>KYC management interface coming soon...</p>
          <ul className={`mt-2 text-sm text-${COLORS.SECONDARY_TEXT} list-disc list-inside`}>
            <li>Document verification</li>
            <li>Identity verification status</li>
            <li>Compliance monitoring</li>
            <li>Risk assessment</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminKYC;
