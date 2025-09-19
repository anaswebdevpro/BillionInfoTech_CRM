
import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Upload, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { COLORS } from '../../../../constants/colors';
// import { apiRequest } from '@/services';
// import { useAuth } from '@/context';

// TypeScript interfaces
interface BankDetails {
  bank: string;
  account_holder: string;
  account_number: string;
  ifsc_swift: string;
  address: string;
}

interface DepositRequest {
  sr_no: number;
  amount: string;
  txn_id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

interface BankTransferResponse {
  response: boolean;
  bank_details: BankDetails;
  title: string;
}

const BankTransfer: React.FC = () => {
  // const { token } = useAuth();
  const [bankData, setBankData] = useState<BankTransferResponse | null>(null);
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    amount: '',
    transaction_id: '',
    receipt: null as File | null
  });
  
  // Table state
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [fileName, setFileName] = useState('No file chosen');

  const fetchBankData = useCallback(async () => {
    setLoading(true);
    try {
      // Mock bank details (replace with API call)
      const mockBankDetails: BankDetails = {
        bank: 'IDBI',
        account_holder: 'SAMARTH ONLINE SHOPPY',
        account_number: '1792102000012926',
        ifsc_swift: 'IBKL0001792',
        address: 'KHARADI'
      };

      const mockDepositRequests: DepositRequest[] = [
        {
          sr_no: 1,
          amount: '₹10,000.00',
          txn_id: 'TXN123456789',
          status: 'Pending',
          date: '2025-01-15 14:30:25'
        },
        {
          sr_no: 2,
          amount: '₹5,000.00',
          txn_id: 'TXN987654321',
          status: 'Approved',
          date: '2025-01-14 10:15:30'
        },
        {
          sr_no: 3,
          amount: '₹15,000.00',
          txn_id: 'TXN456789123',
          status: 'Rejected',
          date: '2025-01-13 16:45:15'
        }
      ];

      // Mock response
      const response: BankTransferResponse = {
        response: true,
        bank_details: mockBankDetails,
        title: 'INR Deposit Request'
      };
      
      setBankData(response);
      setDepositRequests(mockDepositRequests);
      console.log('Bank data loaded:', response);
    } catch (error) {
      console.error("Failed to fetch bank data:", error);
      setBankData(null);
      setDepositRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

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
      receipt: file
    }));
    setFileName(file ? file.name : 'No file chosen');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      console.log('Form submitted:', formData);
      alert('Deposit request submitted successfully!');
      setFormData({
        amount: '',
        transaction_id: '',
        receipt: null
      });
      setFileName('No file chosen');
    } catch (error) {
      console.error('Failed to submit deposit request:', error);
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

  const filteredRequests = depositRequests.filter(item => 
    item.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.txn_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRequests.length / entriesPerPage);
  const paginatedRequests = filteredRequests.slice(
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
            {bankData ? bankData.title : 'INR Deposit Request'}
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

              {/* Transaction ID Field */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>
                  Transaction ID
                </label>
                <Input
                  type="text"
                  name="transaction_id"
                  value={formData.transaction_id}
                  onChange={handleInputChange}
                  placeholder="Enter transaction ID"
                  required
                  className="w-full"
                />
              </div>

              {/* File Upload Field */}
              <div>
                <label className={`block text-sm font-medium text-${COLORS.SECONDARY} mb-2`}>
                  Attachment (Receipt)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    id="receipt"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                  />
                  <label
                    htmlFor="receipt"
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
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>{bankData.bank_details.bank}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Account Holder:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>{bankData.bank_details.account_holder}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Account Number:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT} font-mono`}>{bankData.bank_details.account_number}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>IFSC/SWIFT:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT} font-mono`}>{bankData.bank_details.ifsc_swift}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Address:</span>
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>{bankData.bank_details.address}</span>
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
                    onClick={() => handleSort('sr_no')}
                  >
                    <div className="flex items-center gap-1">
                      Sr.No. {getSortIcon('sr_no')}
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
                    onClick={() => handleSort('txn_id')}
                  >
                    <div className="flex items-center gap-1">
                      Txn ID {getSortIcon('txn_id')}
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
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-1">
                      Date {getSortIcon('date')}
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
                      <td className="py-3 px-4">{item.sr_no}</td>
                      <td className="py-3 px-4 font-medium">{item.amount}</td>
                      <td className="py-3 px-4 font-mono text-sm">{item.txn_id}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
              Showing {paginatedRequests.length === 0 ? 0 : 1} to {paginatedRequests.length} of {filteredRequests.length} entries
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