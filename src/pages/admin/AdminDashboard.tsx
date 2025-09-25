import React, { useState } from 'react';
import { COLORS } from '../../constants/colors';
import Card from '../../components/ui/Card';
import { ShimmerLoader } from '../../components/ui';
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
  XCircle
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  approvedDeposits: number;
  declinedDeposits: number;
  pendingDeposits: number;
  approvedWithdrawals: number;
  declinedWithdrawals: number;
  pendingWithdrawals: number;
  totalDeposit: number;
  totalWithdrawal: number;
  todaysDeposit: number;
  todaysWithdrawal: number;
  pendingKYC: number;
  pendingIBRequest: number;
}

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardStats] = useState<DashboardStats>({
    totalUsers: 17,
    activeUsers: 8,
    inactiveUsers: 9,
    approvedDeposits: 0,
    declinedDeposits: 0,
    pendingDeposits: 0,
    approvedWithdrawals: 0,
    declinedWithdrawals: 0,
    pendingWithdrawals: 0,
    totalDeposit: 11010.00,
    totalWithdrawal: 0.00,
    todaysDeposit: 0.00,
    todaysWithdrawal: 0.00,
    pendingKYC: 1,
    pendingIBRequest: 0
  });

  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);




  if (loading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY}`}>Admin Dashboard</h1>
          <p className={`mt-2 text-${COLORS.SECONDARY_TEXT}`}>Comprehensive system overview and analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Last updated:</span>
          <span className="text-sm font-medium">{new Date().toLocaleString()}</span>
        </div>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardStats.totalUsers}</p>
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
              <p className="text-3xl font-bold text-green-600 mt-2">{dashboardStats.activeUsers}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In-Active Users</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{dashboardStats.inactiveUsers}</p>
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
              <p className="text-sm font-medium text-gray-600">Approved Deposits Requests</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{dashboardStats.approvedDeposits}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Declined Deposits Requests</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{dashboardStats.declinedDeposits}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Deposits Requests</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardStats.pendingDeposits}</p>
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
              <p className="text-sm font-medium text-gray-600">Approved Withdrawal Requests</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{dashboardStats.approvedWithdrawals}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Declined Withdrawal Requests</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{dashboardStats.declinedWithdrawals}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Withdrawal Requests</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardStats.pendingWithdrawals}</p>
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
              <p className="text-3xl font-bold text-green-600 mt-2">${dashboardStats.totalDeposit.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Withdrawal</p>
              <p className="text-3xl font-bold text-red-600 mt-2">${dashboardStats.totalWithdrawal.toFixed(2)}</p>
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
              <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardStats.pendingKYC}</p>
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
              <p className="text-sm font-medium text-gray-600">Today's Deposit</p>
              <p className="text-3xl font-bold text-green-600 mt-2">${dashboardStats.todaysDeposit.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Withdrawal</p>
              <p className="text-3xl font-bold text-red-600 mt-2">${dashboardStats.todaysWithdrawal.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <DollarSign className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending IB Request</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{dashboardStats.pendingIBRequest}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
