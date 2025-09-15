import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, Settings, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import {  ShimmerText, ShimmerButton } from '../../components/ui/Shimmer';
// import { apiRequest } from '../services/api';
import type { Account } from '../../types';
import { COLORS } from '../../constants/colors';

/**
 * Manage Account page component
 * Allows users to view, edit, and manage their trading accounts
 */
const MyAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      
      // Dummy data for demonstration
      const dummyAccounts: Account[] = [
        {
          id: '1',
          userId: 'user123',
          accountNumber: 'MT5-001234',
          accountType: 'Live',
          balance: 15420.50,
          currency: 'USD',
          leverage: '1:100',
          status: 'Active'
        },
        {
          id: '2',
          userId: 'user123',
          accountNumber: 'MT5-001235',
          accountType: 'Demo',
          balance: 10000.00,
          currency: 'EUR',
          leverage: '1:200',
          status: 'Active'
        },
        {
          id: '3',
          userId: 'user123',
          accountNumber: 'MT5-001236',
          accountType: 'Live',
          balance: 8750.25,
          currency: 'GBP',
          leverage: '1:50',
          status: 'Pending'
        },
        {
          id: '4',
          userId: 'user123',
          accountNumber: 'MT5-001237',
          accountType: 'Live',
          balance: 0.00,
          currency: 'USD',
          leverage: '1:100',
          status: 'Inactive'
        },
        {
          id: '5',
          userId: 'user123',
          accountNumber: 'MT5-001238',
          accountType: 'Demo',
          balance: 50000.00,
          currency: 'USD',
          leverage: '1:500',
          status: 'Active'
        },
        {
          id: '6',
          userId: 'user123',
          accountNumber: 'MT5-001239',
          accountType: 'Live',
          balance: 22350.75,
          currency: 'JPY',
          leverage: '1:100',
          status: 'Active'
        }
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAccounts(dummyAccounts);
    } catch (error) {
      console.error('Failed to load accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
      case 'active':
    return `text-${COLORS.PRIMARY} bg-${COLORS.PRIMARY_BG_LIGHT}`;
      case 'inactive':
        return 'text-red-600 bg-red-100';
      case 'pending':
    return `text-${COLORS.YELLOW_TEXT} bg-yellow-100`;
      default:
    return `text-${COLORS.SECONDARY_TEXT} bg-${COLORS.GRAY_LIGHT}`;
    }
  };

  const getAccountTypeIcon = (type: string) => {
    return type === 'Live' ? (
      <TrendingUp className={`h-5 w-5 text-${COLORS.PRIMARY}`} />
    ) : (
      <Settings className="h-5 w-5 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Shimmer */}
        <div className={`border-b border-${COLORS.BORDER} pb-5`}>
          <ShimmerText width="200px" height={36} />
          <ShimmerText width="400px" height={20} className="mt-2" />
        </div>

        {/* Account Grid Shimmer */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="space-y-4">
                {/* Account Header Shimmer */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                    <div className="space-y-2">
                      <ShimmerText width="120px" height={20} />
                      <ShimmerText width="80px" height={16} />
                    </div>
                  </div>
                  <ShimmerText width="60px" height={24} />
                </div>

                {/* Account Details Shimmer */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <ShimmerText width="60px" height={14} />
                      <ShimmerText width="100px" height={18} />
                    </div>
                    <div className="space-y-2">
                      <ShimmerText width="70px" height={14} />
                      <ShimmerText width="80px" height={18} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <ShimmerText width="60px" height={14} />
                    <ShimmerText width="40px" height={16} />
                  </div>
                </div>

                {/* Action Buttons Shimmer */}
                <div className="flex space-x-3">
                  <ShimmerButton width="100%" height={32} />
                  <ShimmerButton width="100%" height={32} />
                  <ShimmerButton width="40px" height={32} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`border-b border-${COLORS.BORDER} pb-5`}>
        <h1 className={`text-3xl font-bold leading-6 text-${COLORS.SECONDARY}`}>My Accounts</h1>
        <p className={`mt-2 max-w-4xl text-sm text-${COLORS.SECONDARY_TEXT}`}>
          View and manage your trading accounts, modify settings, and monitor account performance.
        </p>
      </div>

      {/* Account Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.id} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Account Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getAccountTypeIcon(account.accountType)}
                  <div>
                    <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
                      {account.accountNumber}
                    </h3>
                    <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>{account.accountType} Account</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    account.status
                  )}`}
                >
                  {account.status}
                </span>
              </div>

              {/* Account Details */}
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm font-medium text-${COLORS.SECONDARY_TEXT}`}>Balance</p>
                    <p className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
                      ${account.balance.toLocaleString()} {account.currency}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium text-${COLORS.SECONDARY_TEXT}`}>Leverage</p>
                    <p className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>{account.leverage}</p>
                  </div>
                </div>

                <div>
                  <p className={`text-sm font-medium text-${COLORS.SECONDARY_TEXT}`}>Currency</p>
                  <p className={`text-sm text-${COLORS.SECONDARY}`}>{account.currency}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  disabled={account.status !== 'Active'}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  disabled={account.status === 'Active'}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

   

      {/* Empty State */}
      {accounts.length === 0 && !loading && (
        <Card className="text-center py-12">
          <Settings className={`mx-auto h-12 w-12 text-${COLORS.GRAY}`} />
          <h3 className={`mt-2 text-sm font-medium text-${COLORS.SECONDARY}`}>No accounts found</h3>
          <p className={`mt-1 text-sm text-${COLORS.SECONDARY_TEXT}`}>
            You don't have any trading accounts yet. Create your first account to get started.
          </p>
          <div className="mt-6">
            <Button>Create Account</Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default MyAccounts;
