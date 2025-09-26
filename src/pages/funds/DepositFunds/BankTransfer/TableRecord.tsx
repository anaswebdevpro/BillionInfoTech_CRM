import React, { useEffect, useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { ShimmerLoader } from '../../../../components/ui';
import { COLORS } from '../../../../constants/colors';
import { apiRequest } from '@/services';
import { useAuth } from '@/context';
import { GET_DEPOSIT_REPORT } from '../../../../../api/api-variable';
import { enqueueSnackbar } from 'notistack';

// TypeScript interfaces
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

const TableRecord: React.FC = () => {
  const { token } = useAuth();
  const [depositRequests, setDepositRequests] = useState<DepositRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

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
        .catch((error: unknown) => {
          // Type guard for axios error
          const isAxiosError = (err: unknown): err is { response?: { data?: { message?: string } } } => {
            return typeof err === 'object' && err !== null && 'response' in err;
          };
          
          console.log('Error message:', isAxiosError(error) ? error.response?.data?.message : 'Unknown error');
          const errorMessage = isAxiosError(error) 
            ? error.response?.data?.message || 'Failed to fetch deposit requests!'
            : 'Failed to fetch deposit requests!';
          enqueueSnackbar(errorMessage, { variant: 'error' });
          setDepositRequests([]);
        });
    } catch (error: unknown) {
      // Type guard for axios error
      const isAxiosError = (err: unknown): err is { response?: { data?: { message?: string } } } => {
        return typeof err === 'object' && err !== null && 'response' in err;
      };
      
      console.log('Error message:', isAxiosError(error) ? error.response?.data?.message : 'Unknown error');
      const errorMessage = isAxiosError(error) 
        ? error.response?.data?.message || 'Failed to fetch deposit requests!'
        : 'Failed to fetch deposit requests!';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setDepositRequests([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDepositeRequest();
  }, [fetchDepositeRequest]);

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
      <Card>
        <div className="p-8">
          <ShimmerLoader variant="table" width={800} height={400} />
        </div>
      </Card>
    );
  }

  return (
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
  );
};

export default TableRecord;
