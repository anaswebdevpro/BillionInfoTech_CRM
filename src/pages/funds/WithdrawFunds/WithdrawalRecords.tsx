import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { ShimmerLoader } from '../../../components/ui';
import { COLORS } from '../../../constants/colors';
import { apiRequest } from '@/services';
import { useAuth } from '@/context';
import { GET_WITHDRAWAL_HISTORY } from '../../../../api/api-variable';
import { enqueueSnackbar } from 'notistack';
import { useDebounce } from '@/Hook/useDebounce';

// TypeScript interfaces for withdrawal records
interface WithdrawalRecord {
  id: number;
  from_wallet: string;
  amount: string;
  payment_method: string;
  status: string;
  created_on: string;
}

interface WithdrawalApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: WithdrawalRecord[];
  custom_data?: {
    total: string;
  };
}

const WithdrawalRecords: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<WithdrawalApiResponse | null>(null);
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
        endpoint: GET_WITHDRAWAL_HISTORY,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: requestBody
      })
      .then((response: unknown) => {
        console.log('Withdrawal Records:', response);
        
        // Check if response indicates success or failure
        const responseData = response as { response?: boolean; message?: string };
        
        if (responseData.response === false) {
          enqueueSnackbar(responseData.message || 'Failed to fetch withdrawal records!', { variant: 'error' });
        } else {
          setData(response as WithdrawalApiResponse);
        }
      })
      
     .catch((error) => {
        console.error('Error fetching withdrawal records:', error);
        const errorMessage = error?.message || error?.response?.data?.message || 'Failed to fetch withdrawal records';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      })
      .finally(() => {
        setIsLoading(false);
      });
     
    } catch (error) {
      console.error("Failed to fetch withdrawal records:", error);
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
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-600 text-white';
      case 'pending':
        return 'bg-orange-600 text-white';
      case 'declined':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };


  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <ShimmerLoader variant="table" width={800} height={400} />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Table Controls */}
      <div className="flex justify-between items-center mb-4">
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
          <p className="text-gray-500">No withdrawal records found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b border-${COLORS.BORDER}`}>
                  <th className="text-left py-3 px-4">Sr.No.</th>
                  <th className="text-left py-3 px-4">Source</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Payment Method</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((record, index) => (
                  <tr key={record.id} className={`border-b border-${COLORS.BORDER} hover:bg-gray-50`}>
                    <td className="py-3 px-4">{currentPage * entriesPerPage + index + 1}</td>
                    <td className="py-3 px-4">
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        {record.from_wallet}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-medium text-orange-600">
                      {record.amount}
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm">
                        {record.payment_method}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{record.created_on}</td>
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
    </Card>
  );
};

export default WithdrawalRecords;