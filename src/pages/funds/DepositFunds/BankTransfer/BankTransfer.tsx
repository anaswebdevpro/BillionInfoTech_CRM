import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Upload, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { COLORS } from '../../../../constants/colors';
import { apiRequest } from '@/services';
import { useAuth } from '@/context';
import { GET_DEPOSIT_REPORT, DEMO_BANK_DETAILS, SUBMIT_DEPOSIT_REQUEST } from '../../../../../api/api-variable'; 

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

interface DepositRequest {
  no: number;
  amount: number;
  hash: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_on: string;
}

interface DepositApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: DepositRequest[];
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
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    txn_hash: '',
    type: 'fiat',
    attachment: null as File | null
  });
  
  // Table state
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [fileName, setFileName] = useState('No file chosen');

  // API call to fetch deposit requests
  const fetchDepositeRequest = useCallback(() => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: GET_DEPOSIT_REPORT,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: unknown) => {
        const depositResponse = response as DepositApiResponse;
        setDepositRequests(depositResponse.data || []);
        console.log('Deposit requests:', depositResponse);
      })
        .catch((error: Error) => {
          console.error("Failed to fetch deposit requests:", error);
          setDepositRequests([]);
        });
    } catch (error) {
      console.error("Failed to fetch deposit requests:", error);
      setDepositRequests([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

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
        .catch((error: Error) => {
          console.error("Failed to fetch bank data:", error);
          setBankData(null);
        });
    } catch (error) {
      console.error("Failed to fetch bank data:", error);
      setBankData(null);
    }
  }, [token]);

  useEffect(() => {
    fetchBankData();
    fetchDepositeRequest();
  }, [fetchBankData, fetchDepositeRequest]);

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
      alert('Deposit request submitted successfully!');
      
      // Reset form
      setFormData({
        amount: '',
        txn_hash: '',
        type: 'fiat',
        attachment: null
      });
      setFileName('No file chosen');
      
      // Refresh the deposit requests after successful submission
      fetchDepositeRequest();
    } catch (error) {
      console.error('Failed to submit deposit request:', error);
      alert('Failed to submit deposit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  // Updated filtering to match API response structure
  const filteredRequests = depositRequests.filter(item => 
    item.amount.toString().includes(searchTerm.toLowerCase()) ||
    item.hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.created_on.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Updated sorting to match API response structure
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: string | number = a[sortField as keyof DepositRequest];
    let bValue: string | number = b[sortField as keyof DepositRequest];
    
    // Handle different data types
    if (sortField === 'amount' || sortField === 'no') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedRequests.length / entriesPerPage);
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Rejected':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center py-8">
          <div className={`text-${COLORS.SECONDARY_TEXT}`}>Loading bank transfer data...</div>
        </div>
      </div>
    );
  }

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
      <Card>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>Deposit Requests</h2>
            <div className="flex items-center gap-2">
              <select
                value={entriesPerPage}
                onChange={(e) => setEntriesPerPage(Number(e.target.value))}
                className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-sm`}
              >
                <option value={10}>Show 10 entries</option>
                <option value={25}>Show 25 entries</option>
                <option value={50}>Show 50 entries</option>
                <option value={100}>Show 100 entries</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Search:</label>
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-48"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b border-${COLORS.BORDER}`}>
                  <th 
                    className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('no')}
                  >
                    <div className="flex items-center gap-1">
                      Sr.No. {getSortIcon('no')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('amount')}
                  >
                    <div className="flex items-center gap-1">
                      Amount {getSortIcon('amount')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('hash')}
                  >
                    <div className="flex items-center gap-1">
                      Hash {getSortIcon('hash')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-1">
                      Status {getSortIcon('status')}
                    </div>
                  </th>
                  <th 
                    className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('created_on')}
                  >
                    <div className="flex items-center gap-1">
                      Date {getSortIcon('created_on')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {depositRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No data available in table
                    </td>
                  </tr>
                ) : paginatedRequests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No matching records found
                    </td>
                  </tr>
                ) : (
                  paginatedRequests.map((item, index) => (
                    <tr key={index} className={`border-b border-${COLORS.BORDER} hover:bg-gray-50`}>
                      <td className="py-3 px-4">{item.no}</td>
                      <td className="py-3 px-4 font-medium">₹{item.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-sm">{item.hash}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.created_on}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
              Showing {paginatedRequests.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, sortedRequests.length)} of {sortedRequests.length} entries
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BankTransfer;