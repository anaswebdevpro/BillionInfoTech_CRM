import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { CreditCard, Building, Bitcoin, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { transactionsAPI } from '../services';
// Using a local form type to match UI fields
interface DepositFormValues {
  amount: number;
  method: 'bank' | 'usdt' | 'crypto';
  currency: string;
}
import { COLORS } from '../constants/colors';

/**
 * Deposits page component
 * Handles various deposit methods (Bank Transfer, USDT, etc.)
 */
const Deposits: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'usdt' | 'crypto'>('bank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const depositMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building,
      description: 'Traditional bank wire transfer',
      minAmount: 100,
      maxAmount: 50000,
      processingTime: '1-3 business days',
    },
    {
      id: 'usdt',
      name: 'USDT (Tether)',
      icon: CreditCard,
      description: 'Cryptocurrency deposit via USDT',
      minAmount: 50,
      maxAmount: 100000,
      processingTime: '10-30 minutes',
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Bitcoin,
      description: 'Bitcoin, Ethereum, and other cryptos',
      minAmount: 25,
      maxAmount: 100000,
      processingTime: '15-60 minutes',
    },
  ];

  // Validation schema for deposit form
  const validationSchema = Yup.object({
    amount: Yup.number()
      .min(depositMethods.find(m => m.id === selectedMethod)?.minAmount || 25, 
           `Minimum amount is $${depositMethods.find(m => m.id === selectedMethod)?.minAmount}`)
      .max(depositMethods.find(m => m.id === selectedMethod)?.maxAmount || 100000,
           `Maximum amount is $${depositMethods.find(m => m.id === selectedMethod)?.maxAmount}`)
      .required('Amount is required'),
    currency: Yup.string().required('Currency is required'),
  });

  // Form handling with Formik
  const formik = useFormik<DepositFormValues>({
    initialValues: {
      amount: 0,
      method: selectedMethod,
      currency: 'USD',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        await transactionsAPI.deposit({
          amount: values.amount,
          method: values.method,
          currency: values.currency,
          description: `${values.method} deposit of ${values.amount} ${values.currency}`,
        });
        setSuccess(true);
        formik.resetForm();
      } catch (error) {
        console.error('Failed to create deposit:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  // Handle method selection
  const handleMethodSelect = (method: 'bank' | 'usdt' | 'crypto') => {
    setSelectedMethod(method);
    formik.setFieldValue('method', method);
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <div className="text-center py-8">
            <div className={`w-16 h-16 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <CheckCircle className={`w-8 h-8 text-${COLORS.PRIMARY}`} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Request Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your deposit request has been received and is being processed.
            </p>
            <Button onClick={() => setSuccess(false)}>
              Make Another Deposit
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const selectedMethodData = depositMethods.find(m => m.id === selectedMethod);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
  <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Deposits</h1>
  <p className={`text-${COLORS.SECONDARY_TEXT}`}>Fund your trading account using various payment methods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method Selection */}
        <Card title="Select Deposit Method" subtitle="Choose your preferred payment method">
          <div className="space-y-3">
            {depositMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => handleMethodSelect(method.id as 'bank' | 'usdt' | 'crypto')}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    selectedMethod === method.id
                      ? `border-${COLORS.PRIMARY_BG} bg-${COLORS.PRIMARY_BG_LIGHT}`
                      : `border-${COLORS.BORDER} hover:border-${COLORS.GRAY_BORDER}`
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className={`h-6 w-6 ${
                      selectedMethod === method.id ? `text-${COLORS.PRIMARY}` : `text-${COLORS.GRAY}`
                    }`} />
                    <div className="ml-3 flex-1">
                      <h3 className={`text-sm font-semibold text-${COLORS.SECONDARY}`}>{method.name}</h3>
                      <p className="text-xs text-gray-500">{method.description}</p>
                      <div className={`flex justify-between text-xs text-gray-500 mt-1`}>
                        <span>${method.minAmount} - ${method.maxAmount.toLocaleString()}</span>
                        <span>{method.processingTime}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Deposit Form */}
        <Card title="Deposit Details" subtitle="Enter the amount you wish to deposit">
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Currency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <select
                name="currency"
                value={formik.values.currency}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block w-full px-3 py-2 border border-${COLORS.GRAY_BORDER} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY_BG} focus:border-${COLORS.PRIMARY_BG}`}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>

            {/* Amount Input */}
            <Input
              label="Amount"
              type="number"
              name="amount"
              placeholder={`Min: $${selectedMethodData?.minAmount}`}
              value={formik.values.amount || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.amount && formik.errors.amount ? formik.errors.amount : undefined}
              required
            />

            {/* Method Information */}
            {selectedMethodData && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  {selectedMethodData.name} Information:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Processing Time: {selectedMethodData.processingTime}</li>
                  <li>• Min Amount: ${selectedMethodData.minAmount}</li>
                  <li>• Max Amount: ${selectedMethodData.maxAmount.toLocaleString()}</li>
                  {selectedMethod === 'bank' && (
                    <>
                      <li>• Bank fees may apply</li>
                      <li>• Requires account verification</li>
                    </>
                  )}
                  {selectedMethod === 'usdt' && (
                    <>
                      <li>• Network: TRC20/ERC20</li>
                      <li>• No additional fees</li>
                    </>
                  )}
                  {selectedMethod === 'crypto' && (
                    <>
                      <li>• Multiple currencies supported</li>
                      <li>• Network fees apply</li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Amounts:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => formik.setFieldValue('amount', amount)}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !formik.isValid}
            >
              {isSubmitting ? 'Processing...' : `Deposit $${formik.values.amount || 0}`}
            </Button>
          </form>
        </Card>
      </div>

      {/* Recent Deposits */}
      <Card title="Recent Deposits" subtitle="Your latest deposit transactions">
        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3 bg-${COLORS.SECONDARY_BG} rounded-lg`}>
            <div className="flex items-center">
              <Building className={`h-5 w-5 text-${COLORS.GRAY} mr-3`} />
              <div>
                <p className={`text-sm font-medium text-${COLORS.SECONDARY}`}>Bank Transfer</p>
                <p className="text-xs text-gray-500">Aug 10, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium text-${COLORS.PRIMARY}`}>+$5,000</p>
              <p className={`text-xs text-${COLORS.PRIMARY_TEXT} bg-${COLORS.PRIMARY_BG_LIGHT} px-2 py-1 rounded-full`}>
                Completed
              </p>
            </div>
          </div>
          
          <div className={`flex items-center justify-between p-3 bg-${COLORS.SECONDARY_BG} rounded-lg`}>
            <div className="flex items-center">
              <CreditCard className={`h-5 w-5 text-${COLORS.GRAY} mr-3`} />
              <div>
                <p className={`text-sm font-medium text-${COLORS.SECONDARY}`}>USDT</p>
                <p className="text-xs text-gray-500">Aug 09, 2025</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium text-${COLORS.PRIMARY}`}>+$1,000</p>
              <p className={`text-xs text-${COLORS.YELLOW_TEXT} bg-yellow-100 px-2 py-1 rounded-full`}>
                Processing
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Deposits;
