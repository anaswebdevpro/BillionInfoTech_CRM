import React, { useState } from "react";

import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";
import AllKycTable from "./AllKycTable";



const AdminKYC: React.FC = () => {
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
      <div className="p-6">
        <ShimmerLoader variant="dashboard" width={1000} height={600} />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
           KYC Management
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage your clients KYC details
            </p>
          </div>
         
        </div>
      </div>

    

    
      <AllKycTable />
    </div>
  );
};

export default AdminKYC;
