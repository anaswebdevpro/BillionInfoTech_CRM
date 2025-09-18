import React, { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Input } from '../../components/ui';
import { apiRequest } from '../../services/api';
import { INTERNAL_TRANSFER, SUBMIT_INTERNAL_TRANSFER } from '../../../api/api-variable';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context';
import { enqueueSnackbar } from 'notistack';

interface LiveAccount {
  account_number: number;
  slug: string;
}

interface FromAccount {
  wallet?: string;
  balance?: string;
  account_number?: number;
  slug?: string;
}

interface ToAccount {
  account_number: number;
  slug: string;
}

interface ApiResponse {
  response: boolean;
  title: string;
  main_wallet: string;
  profit_wallet: string;
  live_accounts: LiveAccount[];
  from_account: FromAccount[];
  to_account: ToAccount[];
}

interface TransferFormData {
  fromAccount: string;
  toAccount: string;
  amount: string;
}

interface RecentTransfer {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

/**
 * Internal Transfer page component
 * Allows users to transfer funds between their accounts
 */
const InternalTransfer: React.FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [recentTransfers, setRecentTransfers] = useState<RecentTransfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { token } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Fetch internal transfer data
      const response = await apiRequest<ApiResponse>({
        endpoint: INTERNAL_TRANSFER,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response?.response) {
        console.log('API Response:', response);
        
        setApiData(response);
      } else {
        console.error('API Response failed:', response);
        setError('Failed to load transfer data');
      }

      // Mock recent transfers data (replace with actual API call)
      setRecentTransfers([
        {
          id: '1',
          fromAccount: 'AMB001',
          toAccount: 'AMB002',
          amount: 2500,
          date: 'Aug 10, 2025 14:30',
          status: 'completed'
        },
        {
          id: '2',
          fromAccount: 'AMB002',
          toAccount: 'AMB001',
          amount: 1000,
          date: 'Aug 09, 2025 10:15',
          status: 'completed'
        }
      ]);

    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load transfer data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch accounts and recent transfers on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Validation schema
  const validationSchema = Yup.object({
    fromAccount: Yup.string()
      .required('From account is required'),
    toAccount: Yup.string()
      .required('To account is required')
      .test('different-accounts', 'From and To accounts must be different', function(value) {
        return value !== this.parent.fromAccount;
      }),
    amount: Yup.number()
      .min(10, 'Minimum transfer amount is $10')
      .max(100000, 'Maximum transfer amount is $100,000')
      .required('Transfer amount is required')
  });

  // Formik form handling
  const formik = useFormik<TransferFormData>({
    initialValues: {
      fromAccount: '',
      toAccount: '',
      amount: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsSubmitting(true);
        
        const formData = new FormData();
        formData.append('from_account', values.fromAccount);
        formData.append('to_account', values.toAccount);
        formData.append('amount', values.amount);

        const response = await apiRequest({
          endpoint: SUBMIT_INTERNAL_TRANSFER,
          method: 'POST',
          data: formData,
          headers: { Authorization: `Bearer ${token}` },
      
        });

        if (response) {
          // Reset form on successful submission
          formik.resetForm();
          // Refresh data
          await fetchData();
          enqueueSnackbar('Transfer completed successfully!', { variant: 'success' });
        }
      } catch (error) {
        console.error('Transfer failed:', error);
          enqueueSnackbar('Transfer failed. Please try again.', { variant: 'error' });
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100';
      case 'pending':
        return 'bg-yellow-100';
      case 'failed':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
    }
  };

  // Show loading state if component is still initializing
  if (isLoading && !apiData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading Internal Transfer...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{apiData?.title || 'Internal Transfer'}</h1>
          <p className="text-gray-600 mt-2">Transfer funds between your trading accounts</p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Transfer Funds Section */}
          <Card title="Transfer Funds" subtitle="Move money between your accounts.">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* From Account */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-1`}>
                  From Account <span className="text-red-500">*</span>
                </label>
                <select
                  name="fromAccount"
                  value={formik.values.fromAccount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY_BG} focus:border-${COLORS.PRIMARY_BG} ${
                    formik.touched.fromAccount && formik.errors.fromAccount
                      ? 'border-red-500'
                      : `border-${COLORS.GRAY_BORDER}`
                  }`}
                >
                  <option value="">Select account</option>
                  {apiData?.from_account.map((account, index) => (
                    <option key={index} value={account.wallet || `${account.account_number}-${account.slug}`}>
                      {account.wallet ? `${account.wallet} ($${account.balance})` : `Account ${account.account_number} (${account.slug})`}
                    </option>
                  ))}
                </select>
                {formik.touched.fromAccount && formik.errors.fromAccount && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.fromAccount}</p>
                )}
              </div>

              {/* To Account */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-1`}>
                  To Account <span className="text-red-500">*</span>
                </label>
                <select
                  name="toAccount"
                  value={formik.values.toAccount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY_BG} focus:border-${COLORS.PRIMARY_BG} ${
                    formik.touched.toAccount && formik.errors.toAccount
                      ? 'border-red-500'
                      : `border-${COLORS.GRAY_BORDER}`
                  }`}
                >
                  <option value="">Select account</option>
                  {apiData?.to_account.map((account, index) => (
                    <option key={index} value={`${account.account_number}-${account.slug}`}>
                      Account {account.account_number} ({account.slug})
                    </option>
                  ))}
                </select>
                {formik.touched.toAccount && formik.errors.toAccount && (
                  <p className="mt-1 text-sm text-red-600">{formik.errors.toAccount}</p>
                )}
              </div>

              {/* Transfer Amount */}
              <Input
                label="Transfer Amount"
                name="amount"
                type="number"
                placeholder="Enter amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.amount && formik.errors.amount ? formik.errors.amount : undefined}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
              >
                Transfer Funds
              </Button>
            </form>
          </Card>

          {/* Account Overview Section */}
          <Card title="Account Overview" subtitle="Your available trading accounts.">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-500 mt-4">Loading accounts...</p>
              </div>
            ) : !apiData ? (
              <div className="text-center py-8">
                <div className="text-6xl text-gray-300 mb-4">⇄</div>
                <p className="text-gray-500">No accounts available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Main Wallet */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Main Wallet</p>
                    <p className="text-sm text-gray-600">Primary balance</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${parseFloat(apiData.main_wallet).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">USD</p>
                  </div>
                </div>

                {/* Profit Wallet */}
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Profit Wallet</p>
                    <p className="text-sm text-gray-600">Trading profits</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${parseFloat(apiData.profit_wallet).toLocaleString()}</p>
                    <p className="text-sm text-gray-500">USD</p>
                  </div>
                </div>

                {/* Live Accounts */}
                {apiData.live_accounts.map((account, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Account {account.account_number}</p>
                      <p className="text-sm text-gray-600">{account.slug.toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">Live Account</p>
                      <p className="text-sm text-gray-500">Trading</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Transfer Information */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Transfer Information</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Transfers are processed instantly</li>
                <li>• No fees for internal transfers</li>
                <li>• Available 24/7</li>
                <li>• Minimum transfer: $10</li>
              </ul>
            </div>
          </Card>
        </div>

        {/* Recent Transfers Section */}
        <Card title="Recent Transfers" subtitle="Your latest internal transfers.">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading transfers...</p>
            </div>
          ) : recentTransfers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent transfers found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransfers.map((transfer) => (
                <div key={transfer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl text-gray-400">⇄</div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transfer.fromAccount} → {transfer.toAccount}
                      </p>
                      <p className="text-sm text-gray-500">{transfer.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${transfer.amount.toLocaleString()}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBg(transfer.status)} ${getStatusColor(transfer.status)}`}>
                      {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default InternalTransfer;
