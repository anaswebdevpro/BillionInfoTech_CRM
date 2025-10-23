/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components";
import { COLORS } from "@/constants";
import { apiRequest } from "@/index";
import { ADMIN_FETCH_TICKET_STATS } from "../../../../../api/api-variable";
import {
  AlertCircle,
  CheckCircle,
  
  Inbox,
  TrendingUp,
} from "lucide-react";
import useAdminAuth from "@/Hook/useAdminAuth";
import { useEffect, useState } from "react";


const HeaderState = () => {
  const { adminToken } = useAdminAuth();
  const [stats, setStats] = useState<any>(null);

  const GetStates = () => {
    apiRequest({
      endpoint: ADMIN_FETCH_TICKET_STATS,
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((response: any) => {
        console.log("Fetched ticket stats:", response);
        setStats(response.data);
      })
      .catch((error: any) => {
        console.error("Failed to fetch ticket stats:", error);
      });
  };

  useEffect(() => {
    GetStates();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card
        className={`p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-${COLORS.PRIMARY}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Tickets</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats ? stats.total_tickets : "..."}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600">+42 today</span>
            </div>
          </div>
          <div className={`p-3 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-full`}>
            <Inbox className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-yellow-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Open Tickets</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats ? stats.open_tickets : "..."}
            </p>
            <div className="flex items-center mt-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mr-1" />
              <span className="text-xs text-yellow-600">
                Requires attention
              </span>
            </div>
          </div>
          <div className="p-3 bg-yellow-100 rounded-full">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-all duration-200 border-l-4 border-l-green-500">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Resolved Today</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats ? stats.closed_tickets : "..."}
            </p>
            <div className="flex items-center mt-2">
              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-xs text-green-600">Great progress!</span>
            </div>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HeaderState;
