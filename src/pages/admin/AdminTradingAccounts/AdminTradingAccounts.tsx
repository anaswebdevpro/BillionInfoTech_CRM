import React, { useState } from "react";

import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";
import AllTradingAccount from "./AllTradingAccountTable";




const AdminTradingAccounts: React.FC = () => {
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
          All Trading Accounts
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage your trading accounts
            </p>
          </div>
         
        </div>
      </div>

    <AllTradingAccount/>

    
    </div>
  );
};

export default AdminTradingAccounts;
