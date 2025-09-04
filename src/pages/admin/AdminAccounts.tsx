import React from 'react';
import { COLORS } from '../../constants/colors';

const AdminAccounts: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Account Management</h1>
        <p className={`text-${COLORS.SECONDARY_TEXT} mt-2`}>Trading account oversight and management</p>
        <div className={`mt-6 bg-${COLORS.PRIMARY_BG_LIGHT} border border-${COLORS.PRIMARY_BG} rounded-lg p-4`}>
          <p className={`text-${COLORS.PRIMARY}`}>Account management interface coming soon...</p>
          <ul className={`mt-2 text-sm text-${COLORS.SECONDARY_TEXT} list-disc list-inside`}>
            <li>Trading account status</li>
            <li>Account balance monitoring</li>
            <li>Risk management</li>
            <li>Account restriction</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminAccounts;
