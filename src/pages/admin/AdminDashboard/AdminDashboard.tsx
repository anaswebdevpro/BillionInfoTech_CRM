/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback } from "react";
import { COLORS } from "../../../constants/colors";
import Card from "../../../components/ui/Card";
import { ShimmerLoader } from "../../../components/ui";
import { useSnackbar } from "notistack";
import useAdminAuth from "../../../Hook/useAdminAuth";
import { apiRequest } from "@/services";
import { ADMIN_DASHBOARD_DATA } from "../../../../api/api-variable";
import {
  Users,
  UserCheck,
  UserX,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  FileText,
  CreditCard,
  CheckCircle,
  XCircle,
  LucideIcon,
} from "lucide-react";
import RecentTransactions from "./RecentTransactions";

// Types
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: "blue" | "green" | "red";
  prefix?: string;
}

// Reusable Stat Card Component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  prefix = "",
}) => {
  const colorClasses = {
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-100",
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-100",
    },
    red: {
      text: "text-red-600",
      bg: "bg-red-100",
    },
  };

  const { text, bg } = colorClasses[color];

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-3xl font-bold ${text} mt-2`}>
            {prefix}
            {value}
          </p>
        </div>
        <div className={`p-3 ${bg} rounded-full`}>
          <Icon className={`h-6 w-6 sm:h-8 sm:w-8 ${text}`} />
        </div>
      </div>
    </Card>
  );
};

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rawStats, setRawStats] = useState<unknown | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAdminAuth();

  const fetchDashboardData = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiRequest({
      endpoint: ADMIN_DASHBOARD_DATA,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        const resp: any = response;
        console.log("✅ Dashboard API Response:", resp);
        // API returns: {success: true, stats: {...}}
        const stats = resp?.stats ?? null;
        setRawStats(stats);
      })
      .catch((error) => {
        const err: any = error;
        console.error("Failed to fetch dashboard data:", err);
        const errorMessage =
          err?.message ||
          err?.response?.data?.message ||
          "Failed to fetch dashboard data";
        enqueueSnackbar(errorMessage, { variant: "error" });
      })
      .finally(() => setLoading(false));
  }, [token, enqueueSnackbar]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading || !rawStats) {
    return (
      <div className="space-y-6">
        <ShimmerLoader variant="dashboard" width={1200} height={400} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <ShimmerLoader key={i} variant="card" width={300} height={150} />
          ))}
        </div>
      </div>
    );
  }

  const stats: any = rawStats;

  // Dashboard Configuration
  const dashboardSections = [
    {
      title: "User Statistics",
      cards: [
        {
          title: "Total Users",
          value: stats.total_users,
          icon: Users,
          color: "blue" as const,
        },
        {
          title: "Active Users",
          value: stats.active_users,
          icon: UserCheck,
          color: "green" as const,
        },
        {
          title: "In-Active Users",
          value: stats.inactive_users,
          icon: UserX,
          color: "red" as const,
        },
      ],
    },
    {
      title: "Deposit Requests",
      cards: [
        {
          title: "Approved Deposits Requests",
          value: stats.approved_deposits,
          icon: CheckCircle,
          color: "green" as const,
        },
        {
          title: "Declined Deposits Requests",
          value: stats.declined_deposits,
          icon: XCircle,
          color: "red" as const,
        },
        {
          title: "Pending Deposits Requests",
          value: stats.pending_deposits,
          icon: Clock,
          color: "blue" as const,
        },
      ],
    },
    {
      title: "Withdrawal Requests",
      cards: [
        {
          title: "Approved Withdrawal Requests",
          value: stats.approved_withdrawals,
          icon: CheckCircle,
          color: "green" as const,
        },
        {
          title: "Declined Withdrawal Requests",
          value: stats.declined_withdrawals,
          icon: XCircle,
          color: "red" as const,
        },
        {
          title: "Pending Withdrawal Requests",
          value: stats.pending_withdrawals,
          icon: Clock,
          color: "blue" as const,
        },
      ],
    },
    {
      title: "Financial Overview",
      cards: [
        {
          title: "Total Deposit",
          value: stats.total_deposit,
          icon: TrendingUp,
          color: "green" as const,
          prefix: "$",
        },
        {
          title: "Total Withdrawal",
          value: stats.total_withdrawal,
          icon: TrendingDown,
          color: "red" as const,
          prefix: "$",
        },
        {
          title: "Pending KYC",
          value: stats.pending_kyc,
          icon: FileText,
          color: "blue" as const,
        },
      ],
    },
    {
      title: "Today's Activity",
      cards: [
        {
          title: "Today's Deposit",
          value: stats.today_deposit,
          icon: DollarSign,
          color: "green" as const,
          prefix: "$",
        },
        {
          title: "Today's Withdrawal",
          value: stats.today_withdrawal,
          icon: DollarSign,
          color: "red" as const,
          prefix: "$",
        },
        {
          title: "Pending IB Request",
          value: stats.pending_ib,
          icon: CreditCard,
          color: "blue" as const,
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY}`}>
            Admin Dashboard
          </h1>
          <p className={`mt-2 text-${COLORS.SECONDARY_TEXT}`}>
            Comprehensive system overview and analytics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Last updated:</span>
          <span className="text-sm font-medium">
            {new Date().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Dashboard Sections */}
      {dashboardSections.map((section, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {section.cards.map((card, cardIndex) => (
            <StatCard key={cardIndex} {...card} />
          ))}
        </div>
      ))}

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
};

export default AdminDashboard;
