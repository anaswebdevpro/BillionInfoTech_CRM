/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Upload } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { COLORS } from '../../../../constants/colors';
import { apiRequest } from '@/services';
import { useAuth } from '@/context';
import { DEMO_BANK_DETAILS, SUBMIT_DEPOSIT_REQUEST } from '../../../../../api/api-variable';
import { enqueueSnackbar } from 'notistack';
import TableRecord from './TableRecord'; 

// TypeScript interfaces - Updated to match API response
interface BankInfo {
  id: number;
  bank_name: string;
  account_holder: string;
  account_number: string;
  ifsc_code: string;
  address: string;
  status: number;
  created_on: string | null;
}

interface BankApiResponse {
  success: boolean;
  data: {
    title: string;
    bankInfo: BankInfo;
  };
}

interface BankTransferResponse {
  success: boolean;
  data: {
    title: string;
    bankInfo: BankInfo;
  };
}

const BankTransfer: React.FC = () => {
  const { token } = useAuth();
  const [bankData, setBankData] = useState<BankTransferResponse | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    txn_hash: '',
    type: 'fiat',
    attachment: null as File | null
  });
  
  const [fileName, setFileName] = useState('No file chosen');


  const fetchBankData = useCallback(() => {
    try {
      apiRequest({
        endpoint: DEMO_BANK_DETAILS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: unknown) => {
        const bankResponse = response as BankApiResponse;
        setBankData(bankResponse);
        console.log('Bank data loaded:', bankResponse);
      })
        .catch((error: any) => {
          console.log('Error message:', error?.response?.data?.message);
          const errorMessage = error?.response?.data?.message || 'Failed to fetch bank data!';
          enqueueSnackbar(errorMessage, { variant: 'error' });
          setBankData(null);
        });
    } catch (error: any) {
      console.log('Error message:', error?.response?.data?.message);
      const errorMessage = error?.response?.data?.message || 'Failed to fetch bank data!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setBankData(null);
    }
  }, [token]);

  useEffect(() => {
    fetchBankData();
  }, [fetchBankData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      attachment: file
    }));
    setFileName(file ? file.name : 'No file chosen');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('amount', formData.amount);
      submitData.append('txn_hash', formData.txn_hash);
      submitData.append('type', formData.type);
      if (formData.attachment) {
        submitData.append('attachment', formData.attachment);
      }

      const response = await apiRequest({
        endpoint: SUBMIT_DEPOSIT_REQUEST,
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        },
        data: submitData
      });

      console.log('Deposit request submitted successfully:', response);
      enqueueSnackbar('Deposit request submitted successfully!', { variant: 'success' });
      
      // Reset form
      setFormData({
        amount: '',
        txn_hash: '',
        type: 'fiat',
        attachment: null
      });
      setFileName('No file chosen');
    } catch (error: any) {
      console.log('Error message:', error?.response?.data?.message);
      const errorMessage = error?.response?.data?.message || 'Failed to submit deposit request!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className={`text-3xl font-bold leading-6 text-${COLORS.SECONDARY}`}>
            {bankData ? bankData.data.title : 'INR Deposit Request'}
          </h1>
          <p className={`mt-2 max-w-4xl text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Submit your INR deposit request via bank transfer
          </p>
        </div>
      </div>

      {/* Main Content - Two Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Deposit Request Form */}
        <Card>
          <div className="p-6">
            <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-6`}>
              INR Deposit Request Form
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Field */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>
                  Amount
                </label>
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
                  className="w-full"
                />
              </div>

              {/* Transaction Hash Field */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>
                  Transaction Hash
                </label>
                <Input
                  type="text"
                  name="txn_hash"
                  value={formData.txn_hash}
                  onChange={handleInputChange}
                  placeholder="Enter transaction hash"
                  required
                  className="w-full"
                />
              </div>

              {/* Type Field */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="fiat">Fiat</option>
                  <option value="crypto">Crypto</option>
                </select>
              </div>

              {/* File Upload Field */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>
                  Attachment (Receipt)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="attachment"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                    required
                  />
                  <label
                    htmlFor="attachment"
                    className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-4 w-4 inline mr-2" />
                    Choose file
                  </label>
                  <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                    {fileName}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            </form>
          </div>
        </Card>

        {/* Right Panel - Bank Details */}
        <Card>
          <div className="p-6">
            <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-6`}>
              Demo Bank Details
            </h2>
            
            {bankData && (
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Bank:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>{bankData.data.bankInfo.bank_name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Account Holder:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>{bankData.data.bankInfo.account_holder}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Account Number:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT} font-mono`}>{bankData.data.bankInfo.account_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>IFSC/SWIFT:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT} font-mono`}>{bankData.data.bankInfo.ifsc_code}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Address:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>{bankData.data.bankInfo.address}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    bankData.data.bankInfo.status === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {bankData.data.bankInfo.status === 1 ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className={`text-sm text-yellow-800`}>
                    Note: Please check the bank details carefully before transfer the funds.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Deposit Requests Table */}
      <TableRecord />
    </div>
  );
};

export default BankTransfer;