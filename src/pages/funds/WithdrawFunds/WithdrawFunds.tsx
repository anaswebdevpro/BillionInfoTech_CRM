import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { ShimmerLoader } from '../../../components/ui';
import WithdrawalRecords from './WithdrawalRecords';
import { COLORS } from '../../../constants/colors';
import { apiRequest } from '@/services';
import { useAuth } from '@/context';
import { SUBMIT_WITHDRAW_FUNDS, WITHDRAW_FUNDS_OPTIONS } from '../../../../api/api-variable';

export interface WithdrawResponse {
  response: boolean;
  title: string;
  profit_wallet: string;
  main_balance: string;
  fiat_symbol: string;
  conversion_rate: string;
  banks: {
    id: number;
    account_holder: string;
    account_number: string;
    bank_name: string;
  }[];
  payment_methods: {
    id: number;
    name: string;
  }[];
}

const WithdrawFunds: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const {token} =useAuth();
  const [data, setData] = useState<WithdrawResponse | null>(null);

 const fetchData = () => {
   setIsLoading(true);
    try {
     
      apiRequest({
        endpoint: WITHDRAW_FUNDS_OPTIONS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        
        
      })
      .then((response: unknown) => {
         console.log('Withdraw options response:', response);
         setData(response as WithdrawResponse);
      })
      
      .catch((error) => {
        console.error('Error fetching withdrawal options:', error);
        console.log('Error response data:', error?.response?.data);
        console.log('Error message:', error?.response?.data?.message);
        
        setData(null);
        // Show the exact error message from API
        const errorMessage = error?.response?.data?.message || 'Failed to fetch withdrawal options!';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      })
      .finally(() => {
        setIsLoading(false);
      });
     
    } catch (error) {
      console.error("Failed to fetch trade history:", error);
     
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



















  

  const validationSchema = Yup.object({
    withdrawFrom: Yup.string()
      .required('Withdraw from is required'),
    accountPassword: Yup.string()
      .required('Account password is required'),
    paymentMethod: Yup.string()
      .required('Payment method is required'),
    walletAddress: Yup.string()
      .required('Wallet address is required'),
    amount: Yup.number()
      .min(1, 'Amount must be at least $1')
      .required('Amount is required')
  });

  const formik = useFormik({
    initialValues: {
      withdrawFrom: '',
      accountPassword: '',
      paymentMethod: '',
      walletAddress: '',
      amount: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const requestedbody = {
        withdraw_from: values.withdrawFrom,
        password: values.accountPassword,
        payment_method: values.paymentMethod,
        wallet_address: values.walletAddress,
        amount: values.amount
      };

      try {
 apiRequest({
        endpoint: SUBMIT_WITHDRAW_FUNDS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: requestedbody
      })
       .then((response) => {
         console.log('Withdraw funds response:', response);
         enqueueSnackbar('Withdrawal request submitted successfully!', { variant: 'success' });
         formik.resetForm();
      })
       .catch((error) => {
        
         console.log('Error message:', error?.response?.data?.message);
         
         // Show the exact error message from API
         const errorMessage = error?.response?.data?.message || 'Withdrawal failed!';
         enqueueSnackbar(errorMessage, { variant: 'error' });
       });
            
      

      } catch (error) {
        console.error('Failed to submit withdrawal request:', error);
        enqueueSnackbar('Failed to submit withdrawal request. Please try again.', { variant: 'error' });
      
      } finally {
        setIsLoading(false);
      }
    }
  });

  if (isLoading && !data) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <ShimmerLoader variant="form" width={800} height={600} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY}`}>Withdraw Funds</h1>
          <p className={`mt-2 text-${COLORS.SECONDARY_TEXT}`}>
            Withdraw funds from your trading account to your preferred payment method
          </p>
        </div>
      </div>

      {/* Form Section - Centered */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <Card className="p-8 shadow-lg border-0">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Withdrawal Request</h2>
            <p className="text-gray-600">Fill in the details below to process your withdrawal</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Withdraw From */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Withdraw From
                </label>
                <select
                  name="withdrawFrom"
                  value={formik.values.withdrawFrom}
                  onChange={formik.handleChange}
                  
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    formik.touched.withdrawFrom && formik.errors.withdrawFrom ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select wallet</option>
                  <option value="main_wallet">Main Wallet {data?.main_balance}</option>
                  {/* <option value="trading_wallet">Trading Wallet</option> */}
                </select>
                {formik.touched.withdrawFrom && formik.errors.withdrawFrom && (
                  <p className="text-red-500 text-sm mt-2">{formik.errors.withdrawFrom}</p>
                )}
              </div>

              {/* Demo's Account Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Demo's Account Password
                </label>
                <input
                  type="password"
                  name="accountPassword"
                  value={formik.values.accountPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter account password"
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    formik.touched.accountPassword && formik.errors.accountPassword ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.accountPassword && formik.errors.accountPassword && (
                  <p className="text-red-500 text-sm mt-2">{formik.errors.accountPassword}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formik.values.paymentMethod}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                    formik.touched.paymentMethod && formik.errors.paymentMethod ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select</option>
                  {data?.payment_methods.map((method) => (
                    <option key={method.id} value={method.id}>
                      {method.name}
                    </option>
                  ))}
                </select>
                {formik.touched.paymentMethod && formik.errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-2">{formik.errors.paymentMethod}</p>
                )}
              </div>

              {/* Amount to Withdraw */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Amount to Withdraw
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    name="amount"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0.00"
                    className={`w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                      formik.touched.amount && formik.errors.amount ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {formik.touched.amount && formik.errors.amount && (
                  <p className="text-red-500 text-sm mt-2">{formik.errors.amount}</p>
                )}
              </div>

              {/* Wallet Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Wallet Address
                </label>
                <input
                  type="text"
                  name="walletAddress"
                  value={formik.values.walletAddress}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter wallet address"
                  className={`w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono text-sm ${
                    formik.touched.walletAddress && formik.errors.walletAddress ? 'border-red-500' : ''
                  }`}
                />
                {formik.touched.walletAddress && formik.errors.walletAddress && (
                  <p className="text-red-500 text-sm mt-2">{formik.errors.walletAddress}</p>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200 mt-8">
              <Button
                type="submit"
                disabled={isLoading || !formik.isValid}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  'Send Withdrawal Request'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Withdrawal Records Table - Full Width */}
      <div className="max-w-7xl mx-auto px-4">
        <WithdrawalRecords />
      </div>
    </div>
  );
};

export default WithdrawFunds;
