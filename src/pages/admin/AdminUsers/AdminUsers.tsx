import React, { useState } from "react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const AdminUsers: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <ShimmerLoader variant="card" width={800} height={400} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
          User Management
        </h1>
        <p className={`text-${COLORS.SECONDARY_TEXT} mt-2`}>
          Comprehensive user management interface
        </p>
        <div
          className={`mt-6 bg-${COLORS.PRIMARY_BG_LIGHT} border border-${COLORS.PRIMARY_BG} rounded-lg p-4`}
        >
          <p className={`text-${COLORS.PRIMARY}`}>
            User management interface coming soon...
          </p>
          <ul
            className={`mt-2 text-sm text-${COLORS.SECONDARY_TEXT} list-disc list-inside`}
          >
            <li>View all users</li>
            <li>User verification status</li>
            <li>Account permissions</li>
            <li>User activity logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
