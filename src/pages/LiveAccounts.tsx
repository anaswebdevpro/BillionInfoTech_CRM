import React, { useState, useEffect } from 'react';
import { Plus, Eye, Settings } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { accountsAPI } from '../services';
import type { Account } from '../types';
import { COLORS } from '../constants/colors';
import { Link } from 'react-router-dom';

/**
 * Live Accounts page component
 * Displays user's trading accounts with management options
 */
const LiveAccounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch accounts data on component mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountsAPI.getAccounts();
        setAccounts(data);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-${COLORS.PRIMARY}`}></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Live Accounts</h1>
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>Manage your trading accounts</p>
        </div>
        <Link to="/trading-account">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Account
          </Button>
        </Link>
      </div>

      {/* Accounts List */}
      <Card>
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y divide-${COLORS.BORDER}`}>
            <thead className={`bg-${COLORS.SECONDARY_BG}`}>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leverage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className={`bg-${COLORS.WHITE} divide-y divide-${COLORS.BORDER}`}>
              {accounts.map((account) => (
                <tr key={account.id} className={`hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium text-${COLORS.SECONDARY}` }>
                      {account.accountNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm text-${COLORS.SECONDARY}` }>
                      {account.accountType} Account
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium text-${COLORS.SECONDARY}` }>
                      ${account.balance.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm text-${COLORS.SECONDARY}` }>
                      {account.currency}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm text-${COLORS.SECONDARY}` }>
                      {account.leverage}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.status === 'Active' 
                        ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {account.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {accounts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No accounts found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <p className={`text-2xl font-bold text-${COLORS.SECONDARY}` }>
              {accounts.filter(a => a.status === 'Active').length}
            </p>
            <p className="text-sm text-gray-500">Active Accounts</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className={`text-2xl font-bold text-${COLORS.SECONDARY}` }>
              ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">Total Balance</p>
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <p className={`text-2xl font-bold text-${COLORS.SECONDARY}` }>
              {accounts.filter(a => a.accountType === 'Live').length}
            </p>
            <p className="text-sm text-gray-500">Live Accounts</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LiveAccounts;
