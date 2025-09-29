import React, { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { ShimmerLoader } from '../../../../components/ui';
import { COLORS } from '../../../../constants/colors';
import { apiRequest } from '@/services';
import { useAuth } from '@/context';
import { GET_CRYPTO_DEPOSIT_LIST } from '../../../../../api/api-variable';
import { enqueueSnackbar } from 'notistack';
import { useDebounce } from '@/Hook/useDebounce';

// TypeScript interfaces
interface DepositRequest {
  no: number;
  amount: number;
  transaction_id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_on: string;
}

interface DepositApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: DepositRequest[];
  custom_data?: {
    total: string;
  };
}

const HistoryTable: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<DepositApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const fetchData = useCallback((page = currentPage, search = debouncedSearchValue, length = entriesPerPage) => {
    setIsLoading(true);
    try {
      const requestBody = {
        start: page * length,
        length: length,
        search: search
      };     
        
      apiRequest({
        endpoint: GET_CRYPTO_DEPOSIT_LIST,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: requestBody
      })
      .then((response: unknown) => {
        console.log('Deposit History:', response);
        
        // Check if response indicates success or failure
        const responseData = response as { response?: boolean; message?: string };
        
        if (responseData.response === false) {
          enqueueSnackbar(responseData.message || 'Failed to fetch deposit history!', { variant: 'error' });
        } else {
          setData(response as DepositApiResponse);
        }
      })
      
     .catch((error) => {
        console.error('Error fetching deposit history:', error);
        const errorMessage = error?.message || error?.response?.data?.message || 'Failed to fetch deposit history';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      })
      .finally(() => {
        setIsLoading(false);
      });
     
    } catch (error) {
      console.error("Failed to fetch deposit history:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load data. Please try again later.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setError('Failed to load data. Please try again later.');
      setIsLoading(false);
    }
  }, [token, currentPage, debouncedSearchValue, entriesPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pagination handlers
  const handlePagination = (direction: 'next' | 'prev') => {
    const newPage = direction === 'next' ? currentPage + 1 : Math.max(0, currentPage - 1);
    setCurrentPage(newPage);
    fetchData(newPage, searchValue, entriesPerPage);
  };

  // Entries per page handler
  const handleEntriesPerPageChange = (newEntriesPerPage: number) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(0);
    fetchData(0, searchValue, newEntriesPerPage);
  };


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

  if (isLoading) {
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
          <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>Deposit History</h2>
          <div className="flex items-center gap-2">
            <select
              value={entriesPerPage}
              onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
              className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-sm`}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>entries</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <label className="text-sm">Search:</label>
            <Input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        {/* Table */}
        {error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No deposit history found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`border-b border-${COLORS.BORDER}`}>
                    <th className="text-left py-3 px-4">Sr.No.</th>
                    <th className="text-left py-3 px-4">Amount</th>
                    <th className="text-left py-3 px-4">transaction_id</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((item, index) => (
                    <tr key={index} className={`border-b border-${COLORS.BORDER} hover:bg-gray-50`}>
                      <td className="py-3 px-4">{currentPage * entriesPerPage + index + 1}</td>
                      <td className="py-3 px-4 font-medium">₹{item.amount.toLocaleString()}</td>
                      <td className="py-3 px-4 font-mono text-sm">{item.transaction_id || (item.transaction_id === null ? 'null' : 'N/A')}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">{item.created_on}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                Showing {currentPage * entriesPerPage + 1} to {Math.min((currentPage + 1) * entriesPerPage, data?.recordsFiltered || 0)} of {data?.recordsFiltered || 0} entries
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePagination('prev')}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePagination('next')}
                  disabled={!data || (currentPage + 1) * entriesPerPage >= data.recordsFiltered}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default HistoryTable;
