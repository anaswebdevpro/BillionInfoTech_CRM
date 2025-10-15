import React, { useState } from "react";
import {  UserPlus } from "lucide-react";
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
          <button
            className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}
          >
            <UserPlus className="h-4 w-4" />
            Add New KYC
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <Users className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Total Clients
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                2,847
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className={`bg-blue-50 p-3 rounded-lg`}>
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                New Leads
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                1,234
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className={`bg-${COLORS.YELLOW_BG} p-3 rounded-lg`}>
              <Users className={`h-6 w-6 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Active Clients
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                2,156
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Conversion Rate
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                68%
              </p>
            </div>
          </div>
        </div>
      </div> */}

    
      <AllKycTable />
    </div>
  );
};

export default AdminKYC;
