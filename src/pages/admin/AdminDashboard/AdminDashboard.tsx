/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import RecentTransactions from "./RecentTransactions";

// using raw API `stats` object directly; no local typed mapping

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const [rawStats, setRawStats] = useState<unknown | null>(null);

  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAdminAuth();

  const fetchDashboardData = () => {
    if (!token) return;
    setLoading(true);
    apiRequest({
      endpoint: ADMIN_DASHBOARD_DATA,
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        const resp: any = response;
        const stats = resp?.data?.stats ?? resp?.stats ?? resp;
        setRawStats(stats ?? null);
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
  };
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Removed simulated loading — we rely on fetchDashboardData and token to control loading state

  if (loading || !rawStats) {
    return (
      <div className="space-y-6">
        <ShimmerLoader variant="dashboard" width={1200} height={400} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShimmerLoader variant="card" width={300} height={150} />
          <ShimmerLoader variant="card" width={300} height={150} />
          <ShimmerLoader variant="card" width={300} height={150} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShimmerLoader variant="card" width={300} height={150} />
          <ShimmerLoader variant="card" width={300} height={150} />
          <ShimmerLoader variant="card" width={300} height={150} />
        </div>
      </div>
    );
  }


  const stats: any = rawStats;

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

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.total_users}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.active_users}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                In-Active Users
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.inactive_users}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Deposit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Approved Deposits Requests
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.approved_deposits}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Declined Deposits Requests
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.declined_deposits}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Deposits Requests
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.pending_deposits}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Withdrawal Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Approved Withdrawal Requests
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {stats.approved_withdrawals}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Declined Withdrawal Requests
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                {stats.declined_withdrawals}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Withdrawal Requests
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.pending_withdrawals}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Deposit</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${stats.total_deposit}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Withdrawal
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                ${stats.total_withdrawal}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending KYC</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.pending_kyc}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today's Deposit
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${stats.today_deposit}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Today's Withdrawal
              </p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                ${stats.today_withdrawal}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending IB Request
              </p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.pending_ib}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          
        </Card>
      </div> 
    <RecentTransactions />
    </div>
  );
};

export default AdminDashboard;
