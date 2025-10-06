import React, { useState, useEffect, useCallback} from "react";
import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../services";
import { enqueueSnackbar } from 'notistack';
import type { DashboardData } from "../../types";

import {
  StatsGrid,
  TradingPerformanceChart,
  RecentTransactions,
  MarketTicker,
  TradingPositions,
  ReferEarn,
} from "./components/index";
import { DASHBOARD_DATA } from "../../../api/api-variable";
import { useAuth } from '../../context/AuthContext/AuthContext';
import { ShimmerLoader } from '../../components/ui';

/**
 * Main Dashboard component displaying key metrics and recent activities
 * Implements data fetching and responsive layout
 */
const Dashboard: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Fetch dashboard data from API
  const fetchDashboardData = useCallback(() => {
    setLoading(true);
    apiRequest({
      endpoint: DASHBOARD_DATA,
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      console.log("Dashboard data received:", response);
      
      // Type the response data properly
      const data = response as DashboardData;
      setDashboardData(data);
    }).catch((error) => {
      console.error("Failed to fetch dashboard data:", error);
      const errorMessage = error?.message || error?.response?.data?.message || 'Failed to fetch dashboard data';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);
  
  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token, fetchDashboardData]);


  // Show loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <ShimmerLoader variant="dashboard" width={1200} height={400} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ShimmerLoader variant="chart" width={600} height={300} />
          <ShimmerLoader variant="card" width={600} height={300} />
        </div>
        <ShimmerLoader variant="table" width={1200} height={200} />
      </div>
    );
  }

  // Show a message if no token is available
  if (!token) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>Please log in to view dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Stats Grid */}
      {dashboardData && <StatsGrid dashboardData={dashboardData } />}

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradingPerformanceChart dashboardData={dashboardData} />
        <RecentTransactions  dashboardData={dashboardData} />
      </div>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Trading Positions and Refer & Earn Cards */}
      <div className="flex flex-col lg:flex-row gap-5 min-h-96">
        <div className="w-full lg:w-1/2">
          <TradingPositions
           dashboardData={dashboardData}
          />
        </div>
        <div className="w-full lg:w-1/2">
          <ReferEarn referralLink={dashboardData?.referral_link as string} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;