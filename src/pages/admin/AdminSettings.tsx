import React from 'react';
import { COLORS } from '../../constants/colors';

const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>System Settings</h1>
        <p className={`text-${COLORS.SECONDARY_TEXT} mt-2`}>Platform configuration and system administration</p>
        <div className={`mt-6 bg-${COLORS.PRIMARY_BG_LIGHT} border border-${COLORS.PRIMARY_BG} rounded-lg p-4`}>
          <p className={`text-${COLORS.PRIMARY}`}>System settings interface coming soon...</p>
          <ul className={`mt-2 text-sm text-${COLORS.SECONDARY_TEXT} list-disc list-inside`}>
            <li>System configuration</li>
            <li>Security settings</li>
            <li>API management</li>
            <li>Backup & maintenance</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
