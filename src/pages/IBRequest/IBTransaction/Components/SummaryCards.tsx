/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Card } from "../../../../components/ui";
import { COLORS } from "../../../../constants/colors";
import { DollarSign, BarChart3 } from "lucide-react";
import { apiRequest } from "@/services";
import { GET_BROKERAGE_REPORTS } from "../../../../../api/api-variable";
import { useAuth } from "@/context";

const SummaryCards: React.FC = () => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { token } = useAuth();

  const fetchData = () => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: GET_BROKERAGE_REPORTS,
        method: "POST",

        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response: any) => {
          setLoading(false);
          setData(response);
          console.log("chai pilo ", response);
        })
        .catch((error: any) => {
          console.error("Login failed:", error);
        });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <div>
            <div className={`text-4xl font-bold text-${COLORS.SECONDARY} mb-1`}>
              ${data?.custom_data?.total?.slice(0, -1) || "0.000"}
            </div>
            <div
              className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT} uppercase tracking-wide`}
            >
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
            <div className={`text-4xl font-bold text-${COLORS.SECONDARY} mb-1`}>
              ${data?.custom_data?.total?.slice(0, -1) || "0.0"}
            </div>
            <div
              className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT} uppercase tracking-wide`}
            >
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
