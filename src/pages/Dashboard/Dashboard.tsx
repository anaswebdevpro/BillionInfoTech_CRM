import React, { useState, useEffect, useRef } from "react";
import { COLORS } from "../../constants/colors";
import { apiRequest } from "../../services";
import { useAuth } from "../../context/AuthContext/AuthContext";
import type { DashboardStats, Transaction, Position } from "../../types";
import { DASHBOARD_DATA } from "../../../api/api-variable";
import { TrendingUp, DollarSign, Activity, Users, ArrowUpRight, ArrowDownRight, Rss, Twitter, Facebook, Instagram, MessageCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import TickerDisplay from '../../components/ui/TickerDisplay';
import { GRADIENTS } from '../../constants/colors';

// StatsGrid Component
interface StatsGridProps {
  stats: DashboardStats | null;
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string | number;
}> = ({ icon, title, value }) => (
  <Card>
    <div className="flex items-center">
      <div className="flex-shrink-0">{icon}</div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </Card>
);

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const statsData = [
    {
      title: 'Total Balance',
      value: `$${stats?.totalBalance.toLocaleString() || '0'}`,
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
    },
    {
      title: 'Total Profit',
      value: `$${stats?.totalProfit.toLocaleString() || '0'}`,
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
    },
    {
      title: 'Total Trades',
      value: stats?.totalTrades.toLocaleString() || '0',
      icon: <Activity className="h-8 w-8 text-purple-600" />,
    },
    {
      title: 'Active Accounts',
      value: stats?.activeAccounts || '0',
      icon: <Users className="h-8 w-8 text-orange-600" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <StatCard key={stat.title} icon={stat.icon} title={stat.title} value={stat.value} />
      ))}
    </div>
  );
};

// TradingPerformanceChart Component
interface TradingPerformanceChartProps {
  stats: DashboardStats | null;
}

const chartData = {
  points: [
    { x: 45, y: 145 },
    { x: 85, y: 125 },
    { x: 125, y: 105 },
    { x: 165, y: 85 },
    { x: 205, y: 75 },
    { x: 245, y: 60 },
    { x: 285, y: 45 },
  ],
  yAxisLabels: [
    { y: 25, label: '20%' },
    { y: 60, label: '15%' },
    { y: 95, label: '10%' },
    { y: 130, label: '5%' },
    { y: 165, label: '0%' },
  ],
  xAxisLabels: [
    { x: 50, label: 'Jan' },
    { x: 90, label: 'Feb' },
    { x: 130, label: 'Mar' },
    { x: 170, label: 'Apr' },
    { x: 210, label: 'May' },
    { x: 250, label: 'Jun' },
  ],
};

const TradingPerformanceChart: React.FC<TradingPerformanceChartProps> = ({ stats }) => {
  const linePath = chartData.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${chartData.points[chartData.points.length - 1].x} 165 L ${chartData.points[0].x} 165 Z`;

  return (
    <Card title="Trading Performance" subtitle="Monthly growth overview">
      <div className={`h-64 relative ${GRADIENTS.CARD} rounded-lg overflow-hidden`}>
        {/* Chart Container */}
        <div className="absolute h-full w-full inset-4">
          <svg className="w-full h-full" viewBox="0 0 320 200">
            {/* Grid Background */}
            <defs>
              <pattern
                id="grid"
                width="40"
                height="25"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 25"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  opacity="0.6"
                />
              </pattern>
              <linearGradient
                id="chartGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
              <linearGradient
                id="areaGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
            </defs>

            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Y-axis labels */}
            {chartData.yAxisLabels.map(label => (
              <text key={label.y} x="15" y={label.y} className="text-xs fill-gray-500" fontSize="10">{label.label}</text>
            ))}

            {/* X-axis labels */}
            {chartData.xAxisLabels.map(label => (
              <text key={label.x} x={label.x} y="185" className="text-xs fill-gray-500" fontSize="10">{label.label}</text>
            ))}

            {/* Area under curve */}
            <path
              d={areaPath}
              fill="url(#areaGradient)"
              className="fade-in-up"
            />

            {/* Main chart line */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#chartGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="chart-line"
              strokeDasharray="1000"
            />

            {/* Data points */}
            {chartData.points.map((point, index) => (
              <circle
                key={index}
                cx={point.x}
                cy={point.y}
                r={index === chartData.points.length - 1 ? 5 : 4}
                fill={index === chartData.points.length - 1 ? '#059669' : '#10b981'}
                stroke="#fff"
                strokeWidth="2"
                className="chart-point"
              />
            ))}
          </svg>
        </div>

        {/* Current Value Display - Top Right */}
        <div className="absolute top-3 right-3 text-right bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-sm fade-in-up">
          <div className="flex items-center justify-end space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-2xl font-bold text-green-600">
              +{stats?.monthlyGrowth || 12.5}%
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-1">Monthly Growth</p>
          <p className="text-xs text-green-600 font-medium">
            ↗ +2.3% vs last month
          </p>
        </div>
      </div>
    </Card>
  );
};

// RecentTransactions Component
interface RecentTransactionsProps {
  recentTransactions: Transaction[];
}

const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
  const isCredit = transaction.type === 'credit';
  const isCompleted = transaction.status === 'Completed';

  const Icon = isCredit ? ArrowUpRight : ArrowDownRight;
  const iconColor = isCredit ? 'text-green-600' : 'text-red-600';
  const iconBg = isCredit ? 'bg-green-100' : 'bg-red-100';
  
  const amountColor = isCredit ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isCredit ? '+' : '-';

  const statusClasses = isCompleted
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800';

  return (
    <div
      className="flex items-center justify-between py-2 border-1 border-gray-200 rounded-lg hover:bg-gray-100 hover:shadow-lg p-2 transition-all duration-200"
    >
      <div className="flex items-center">
        <div className={`p-2 rounded-full ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{transaction.type}</p>
          <p className="text-sm text-gray-500">{transaction.method}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-medium ${amountColor}`}>
          {amountPrefix}${transaction.amount.toLocaleString()}
        </p>
        <p className={`text-xs px-2 py-1 rounded-full ${statusClasses}`}>
          {transaction.status}
        </p>
      </div>
    </div>
  );
};

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ recentTransactions }) => {
  return (
    <Card title="Recent Transactions" subtitle="Latest account activity">
      <div className="space-y-1">
        {recentTransactions.length > 0 ? (
          recentTransactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No recent transactions
          </p>
        )}
      </div>
    </Card>
  );
};

// MarketTicker Component
const MarketTicker: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center py-3 shadow-lg rounded-lg gap-2 sm:gap-0">
      <div className="flex-shrink-0 px-3 hidden md:block">
        <Rss className="w-10 h-10 text-orange-600" />
      </div>
      <div className="w-full sm:flex-1 overflow-hidden">
        <TickerDisplay />
      </div>
    </div>
  );
};

// TradingPositions Component
interface TradingPositionsProps {
  positions: Position[];
  closedPositions: Position[];
  showOpenPositions: boolean;
  setShowOpenPositions: (show: boolean) => void;
}

const PositionRow: React.FC<{ position: Position }> = ({ position }) => (
  <tr key={position.orderId}>
    <td className="px-2 py-2">{position.srNo}</td>
    <td className="px-2 py-2">{position.orderId}</td>
    <td className="px-2 py-2">{position.account}</td>
    <td className="px-2 py-2">
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          position.type === 'Buy'
            ? 'bg-green-100 text-green-700'
            : 'bg-red-100 text-red-700'
        }`}
      >
        {position.type}
      </span>
    </td>
    <td className="px-2 py-2">{position.openPrice}</td>
    <td className="px-2 py-2 font-bold">{position.symbol}</td>
    <td className="px-2 py-2">{position.volume}</td>
  </tr>
);

const PositionsTable: React.FC<{
  positions: Position[];
  closedPositions: Position[];
  showOpenPositions: boolean;
}> = ({ positions, closedPositions, showOpenPositions }) => {
  const displayedPositions = showOpenPositions ? positions : closedPositions;
  const emptyMessage = showOpenPositions ? 'No open positions' : 'No closed positions';

  return (
    <tbody>
      {displayedPositions.length > 0 ? (
        displayedPositions.map((pos) => <PositionRow key={pos.orderId} position={pos} />)
      ) : (
        <tr>
          <td colSpan={7} className="px-2 py-4 text-center text-gray-500">
            {emptyMessage}
          </td>
        </tr>
      )}
    </tbody>
  );
};

const ToggleButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 rounded text-sm font-medium transition ${
      active
        ? 'bg-green-600 text-white'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TradingPositions: React.FC<TradingPositionsProps> = ({
  positions,
  closedPositions,
  showOpenPositions,
  setShowOpenPositions,
}) => {
  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
        {/* Custom Header with Title and Toggle Buttons */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trading Positions</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your trading positions</p>
          </div>
          <div className="flex space-x-2">
            <ToggleButton active={showOpenPositions} onClick={() => setShowOpenPositions(true)}>
              Open ({positions.length})
            </ToggleButton>
            <ToggleButton active={!showOpenPositions} onClick={() => setShowOpenPositions(false)}>
              Closed ({closedPositions.length})
            </ToggleButton>
          </div>
        </div>
        
        {/* Card Content with Scroll */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Sr No.</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Order ID</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Account</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">
                    {showOpenPositions ? "Open Price" : "Close Price"}
                  </th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Symbol</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Volume</th>
                </tr>
              </thead>
              <PositionsTable positions={positions} closedPositions={closedPositions} showOpenPositions={showOpenPositions} />
            </table>
          </div>
          
          {/* Footer outside scroll area */}
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600 flex-shrink-0">
            <span>
              Showing{" "}
              {showOpenPositions ? positions.length : closedPositions.length}{" "}
              {showOpenPositions ? "open" : "closed"} positions
            </span>
            {showOpenPositions && (
              <span>
                Total:{" "}
                <span className="font-bold text-lg text-gray-900">
                  $12,345.67
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ReferEarn Component
interface ReferEarnProps {
  referralLink?: string;
}

const socialPlatforms = [
  { name: 'Twitter', icon: Twitter, classes: 'bg-blue-500 hover:bg-blue-600' },
  { name: 'Facebook', icon: Facebook, classes: 'bg-blue-700 hover:bg-blue-800' },
  { name: 'Instagram', icon: Instagram, classes: 'bg-pink-500 hover:bg-pink-600' },
  { name: 'WhatsApp', icon: MessageCircle, classes: 'bg-green-500 hover:bg-green-600' }
];

const ReferEarn: React.FC<ReferEarnProps> = ({ referralLink }) => {
  const defaultReferralLink = "https://demo.newcmsdesign.com/referral/abc123";
  const displayLink = referralLink || defaultReferralLink;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(displayLink);
    // You could add a toast notification here
  };

  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900">Refer & Earn</h3>
          <p className="text-sm text-gray-600 mt-1">Share and get rewarded</p>
        </div>
        
        {/* Content with Scroll */}
        <div className="p-6 flex-1 overflow-auto">
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-500">
              Invite your friends to join our platform and earn rewards for
              each successful referral.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <input
                type="text"
                value={displayLink}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-blue-700 transition whitespace-nowrap"
                onClick={handleCopyLink}
              >
                Copy
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {socialPlatforms.map(platform => (
                <button key={platform.name} className={`${platform.classes} text-white px-3 py-2 rounded-md flex items-center justify-center space-x-1 text-sm flex-1 min-w-0`}>
                  <platform.icon size={16} />
                  <span className="hidden sm:inline">{platform.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Dashboard component displaying key metrics and recent activities
 * Implements data fetching and responsive layout
 */
const Dashboard: React.FC = () => {
  const { token } = useAuth();
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
      <div className="flex items-center justify-center h-64">
        <div
          className={`animate-spin rounded-full h-28 w-28 border-b-2 border-${COLORS.PRIMARY}`}
        ></div>
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
      <StatsGrid stats={stats} />

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TradingPerformanceChart stats={stats} />
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
