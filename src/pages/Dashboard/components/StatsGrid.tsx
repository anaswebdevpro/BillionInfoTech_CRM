import React from 'react';
import { TrendingUp, DollarSign, Activity, Users } from 'lucide-react';
import Card from '../../../components/ui/Card';

// Local interface matching Dashboard component's DashboardData
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

interface StatsGridProps {
  dashboardData: DashboardData;
}

const StatsGrid: React.FC<StatsGridProps> = ({ dashboardData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900">
              ${dashboardData?.wallet_balance || "0"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Profit</p>
            <p className="text-2xl font-bold text-gray-900">
              ${dashboardData?.stats?.commission || "0"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Activity className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Trades</p>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardData?.recent_trades.length || "0"}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Users className="h-8 w-8 text-orange-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Withdrawals</p>
            <p className="text-2xl font-bold text-gray-900">
              {dashboardData?.stats?.withdrawals || "0"}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StatsGrid;
