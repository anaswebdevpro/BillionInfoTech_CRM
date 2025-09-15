import React, { useState, useEffect, useRef} from "react";
import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../services";

import type { DashboardStats, Transaction, Position } from "../../types";
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

/**
 * Main Dashboard component displaying key metrics and recent activities
 * Implements data fetching and responsive layout
 */
const Dashboard: React.FC = () => {
const {token} =useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [positions, setPositions] = useState<Position[]>([]);
  const [closedPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOpenPositions, setShowOpenPositions] = useState(true);
  const [dashboardData, setDashboardData] = useState<Record<string, unknown> | null>(null);
  const fetchingRef = useRef(false); // Prevent multiple concurrent API calls

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Don't fetch if token is not available yet
      if (!token) {
        console.log("No token available, skipping dashboard data fetch");
        setLoading(false); // Stop loading if no token
        return;
      }
      
      // Prevent multiple concurrent API calls
      if (fetchingRef.current) {
        console.log("API call already in progress, skipping...");
        return;
      }
      
      console.log("Fetching dashboard data with token:", token.substring(0, 10) + "...");
      setLoading(true); // Start loading when we have token
      fetchingRef.current = true; // Mark as fetching
      
      try {
        const response = await apiRequest({
          endpoint: DASHBOARD_DATA,
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log("Dashboard data received:", response);
        
        // Type the response data properly
        const data = response as Record<string, unknown>;
        
        if (data) {
          // Set dashboard stats from API response
          setStats({
            totalBalance: parseFloat(((data.wallet_balance as string) || '0').replace(/,/g, '')) || 0,
            totalProfit: parseFloat((((data.stats as Record<string, unknown>)?.deposits as string) || '0').replace(/,/g, '')) - parseFloat((((data.stats as Record<string, unknown>)?.withdrawals as string) || '0').replace(/,/g, '')) || 0,
            totalTrades: Array.isArray(data.recent_trades) ? data.recent_trades.length : 0,
            activeAccounts: Array.isArray(data.live_accounts) ? data.live_accounts.length : 0,
            monthlyGrowth: 0 // Calculate if needed
          });
          
          // Set recent transactions from API response
          if (data.recent_transactions && Array.isArray(data.recent_transactions)) {
            setRecentTransactions(data.recent_transactions.map((tx: unknown, index: number) => {
              const transaction = tx as Record<string, unknown>;
              return {
                id: (transaction.id as string) || index.toString(),
                userId: (transaction.userId as string) || '',
                type: (transaction.type as string) || 'Unknown',
                amount: parseFloat((transaction.amount as string) || '0') || 0,
                currency: (transaction.currency as string) || 'USD',
                method: (transaction.method as string) || '',
                status: (transaction.status as string) || 'pending',
                date: (transaction.date as string) || new Date().toISOString(),
                fromAccount: (transaction.fromAccount as string) || '',
                toAccount: (transaction.toAccount as string) || ''
              };
            }));
          }
          
          // Set trading positions if available
          if (data.recent_trades && Array.isArray(data.recent_trades)) {
            setPositions(data.recent_trades.map((trade: unknown, index: number) => {
              const position = trade as Record<string, unknown>;
              return {
                srNo: index + 1,
                orderId: (position.orderId as string) || (position.id as string) || index.toString(),
                account: (position.account as string) || 'Demo Account',
                type: (position.type as string) || 'BUY',
                openPrice: parseFloat((position.openPrice as string) || '0') || 0,
                symbol: (position.symbol as string) || 'EURUSD',
                volume: parseFloat((position.volume as string) || '0') || 0,
                id: (position.id as string) || index.toString()
              };
            }));
          }
          
          setDashboardData(data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
        fetchingRef.current = false; // Reset fetching flag
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="space-y-2">
        {/* Stats Grid Shimmer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                  <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts and Recent Activity Shimmer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Ticker Shimmer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
          <div className="flex space-x-4 overflow-x-auto">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-32">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Positions and Refer & Earn Shimmer */}
        <div className="flex flex-col lg:flex-row gap-5 min-h-96">
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
              <div className="space-y-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
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
      <StatsGrid stats={stats} loading={loading} />

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradingPerformanceChart stats={stats} loading={loading} />
        <RecentTransactions recentTransactions={recentTransactions} loading={loading} />
      </div>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Trading Positions and Refer & Earn Cards */}
      <div className="flex flex-col lg:flex-row gap-5 min-h-96">
        <div className="w-full lg:w-1/2">
          <TradingPositions
            positions={positions}
            closedPositions={closedPositions}
            showOpenPositions={showOpenPositions}
            setShowOpenPositions={setShowOpenPositions}
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
