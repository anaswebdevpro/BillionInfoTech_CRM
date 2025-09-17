import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const WithdrawFunds: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object({
    amount: Yup.number()
      .min(1, 'Amount must be at least $1')
      .required('Amount is required'),
    withdrawalMethod: Yup.string()
      .required('Withdrawal method is required'),
    bankAccount: Yup.string()
      .required('Bank account is required'),
    reason: Yup.string()
      .required('Reason is required')
      .max(200, 'Reason cannot exceed 200 characters')
  });

  const formik = useFormik({
    initialValues: {
      amount: '',
      withdrawalMethod: '',
      bankAccount: '',
      reason: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        // TODO: Implement withdraw funds API call
        console.log('Withdraw funds:', values);
        enqueueSnackbar('Withdrawal request submitted successfully!', { variant: 'success' });
      } catch (error) {
        console.error('Failed to submit withdrawal request:', error);
        enqueueSnackbar('Failed to submit withdrawal request. Please try again.', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
          <p className="text-gray-600">Withdraw funds from your trading account</p>
        </div>

        <Card className="p-6">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Amount *"
                  type="number"
                  name="amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                //   error={formik.touched.amount && formik.errors.amount}
                  placeholder="Enter amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Withdrawal Method *
                </label>
                <select
                  name="withdrawalMethod"
                  value={formik.values.withdrawalMethod}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.touched.withdrawalMethod && formik.errors.withdrawalMethod ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select withdrawal method</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="wire_transfer">Wire Transfer</option>
                  <option value="crypto">Cryptocurrency</option>
                </select>
                {formik.touched.withdrawalMethod && formik.errors.withdrawalMethod && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.withdrawalMethod}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Account *
                </label>
                <select
                  name="bankAccount"
                  value={formik.values.bankAccount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formik.touched.bankAccount && formik.errors.bankAccount ? 'border-red-500' : ''
                  }`}
                >
                  <option value="">Select bank account</option>
                  <option value="account1">****1234 - Chase Bank</option>
                  <option value="account2">****5678 - Bank of America</option>
                  <option value="account3">****9012 - Wells Fargo</option>
                </select>
                {formik.touched.bankAccount && formik.errors.bankAccount && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.bankAccount}</p>
                )}
              </div>

              <div>
                <Input
                  label="Reason for Withdrawal *"
                  type="text"
                  name="reason"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                //   error={formik.touched.reason && formik.errors.reason}
                  placeholder="Enter reason for withdrawal"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isLoading || !formik.isValid}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Submit Withdrawal Request'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default WithdrawFunds;
