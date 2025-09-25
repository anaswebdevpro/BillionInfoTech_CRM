import React, { useState, useEffect, useCallback} from "react";
import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../services";

// Local interfaces matching the actual API response
interface LiveAccount {
  name: string;
  account_number: number;
  symbol: string;
  leverage: string;
  slug: string;
}

interface RecentTrade {
  account_number: number;
  category: string;
  close_price: number;
  closed_on: string;
  created_on: string;
  execution_id: number;
  id: number;
  is_distributed: number;
  is_haze: number;
  open_price: number;
  order_id: number;
  platform_id: number;
  profit: number;
  profit_update: number;
  sent_to_meta: number;
  side: string;
  status: number;
  stop_loss: number;
  symbol: string;
  take_profit: number;
  user_id: number;
  volume: number;
  zero_profit: number;
}

interface RecentTransaction {
  txn_type: string;
  type: string;
  amount: number;
  remarks: string;
  created_on: string;
}

interface Stats {
  commission: string;
  deposits: string;
  withdrawals: string;
  eta_drawals: string;
}

interface DashboardData {
  version: string;
  name: string;
  description: string;
  wallet_balance: string;
  referral_link: string;
  live_accounts: LiveAccount[];
  recent_trades: RecentTrade[];
  recent_transactions: RecentTransaction[];
  stats: Stats;
}

interface Position {
  srNo: number;
  orderId: string;
  account: string;
  type: string;
  openPrice: number;
  symbol: string;
  volume: number;
  id: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: string;
  amount: number;
  currency: string;
  method?: string;
  status: string;
  date: string;
  fromAccount?: string;
  toAccount?: string;
}
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
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [closedPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOpenPositions, setShowOpenPositions] = useState(true);
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

      if (data) {
        // Set recent transactions from API response
        if (data.recent_transactions && Array.isArray(data.recent_transactions)) {
          setRecentTransactions(data.recent_transactions.map((tx: RecentTransaction, index: number) => {
            return {
              id: index.toString(),
              userId: '',
              type: tx.type,
              amount: tx.amount,
              currency: 'USD',
              method: tx.txn_type,
              status: 'Completed',
              date: tx.created_on,
              fromAccount: '',
              toAccount: ''
            };
          }));
        }

        // Set trading positions if available
        if (data.recent_trades && Array.isArray(data.recent_trades)) {
          setPositions(data.recent_trades.map((trade: RecentTrade, index: number) => {
            return {
              srNo: index + 1,
              orderId: trade.order_id.toString(),
              account: `Account ${trade.account_number}`,
              type: trade.side === 'sell' ? 'Sell' : 'Buy',
              openPrice: trade.open_price,
              symbol: trade.symbol,
              volume: trade.volume,
              id: trade.id.toString()
            };
          }));
        }

        setDashboardData(data);
      }
    }).catch((error) => {
      console.error("Failed to fetch dashboard data:", error);
    }).finally(() => {
      setLoading(false);
    });
  }, [token]);  useEffect(() => {
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
        <RecentTransactions recentTransactions={recentTransactions} />
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