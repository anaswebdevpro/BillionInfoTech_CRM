import React, { useState, useEffect } from 'react';
import { Trash2, Settings, TrendingUp, Lock, BarChart3, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// import type { Account } from '../../types';
import { COLORS } from '../../constants/colors';
import { apiRequest } from '@/services';
import { TRADE_ACCOUNT } from '../../../api/api-variable';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router';


/**
 * Manage Account page component
 * Allows users to view, edit, and manage their trading accounts
 */

export interface Account {
  id: number;
  account_name: string;
  account_number: number;
  currency_symbol: string;
  leverage_show_value: string;
  leverage_value: string;
  platform_slug: string;
  status: string;
  type: string;
}

const MyAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const {token}= useAuth();
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();
  const fetchAccount = () => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: TRADE_ACCOUNT,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response: unknown) => {
         const res = response as { data: Account[] };
         setAccounts(res.data);
         setLoading(false);
        console.log('Trade Account:', response);
      })
      .catch((error) => {
        console.error('Error fetching trade account:', error);
        setLoading(false);
      })
      
     
    } catch (error) {
      console.error("Failed to fetch trade account:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);
  
     
  

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
       {/* Account Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {accounts.map((account) => (
          <Card key={account.account_number} className="hover:shadow-lg transition-shadow">
            <div className="p-6">
              {/* Account Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {getAccountTypeIcon(account.type)}
                  <div>
                    <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
                      {account.account_number}
                    </h3>
                    <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>{account.type} Account</p>
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
                    <p className={`text-sm font-medium text-${COLORS.SECONDARY_TEXT}`}>Account Name</p>
                    <p className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
                      {account.account_name}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm font-medium text-${COLORS.SECONDARY_TEXT}`}>Leverage</p>
                    <p className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>{account.leverage_show_value}</p>
                  </div>
                </div>
<div className="grid grid-cols-2 gap-4">
    <div>
                  <p className={`text-sm font-medium text-${COLORS.SECONDARY_TEXT}`}>Currency</p>
                  <p className={`text-sm text-${COLORS.SECONDARY}`}>{account.currency_symbol}</p>
                </div>
                
                <div>
                  <p className={`text-sm font-medium text-${COLORS.SECONDARY_TEXT}`}>Platform</p>
                  <p className={`text-sm text-${COLORS.SECONDARY}`}>{account.platform_slug}</p>
                </div>
</div>
              
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-3">
                {/* First Row - Main Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Overview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    disabled={account.status !== 'Active'}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Password
                  </Button>
                 
                </div>
                
                {/* Second Row - Secondary Actions */}
                <div className="flex space-x-2">
                  
                   <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                    disabled={account.status !== 'Active'}
                    onClick={() => navigate('/dashboard/funds/deposit')}
                  >
                    <ArrowDownToLine className="h-4 w-4 mr-2" />
                    Deposit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    disabled={account.status !== 'Active'}
                    onClick={() => navigate('/dashboard/funds/withdraw')}
                  >
                    <ArrowUpFromLine className="h-4 w-4 mr-2" />
                    Withdraw
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
