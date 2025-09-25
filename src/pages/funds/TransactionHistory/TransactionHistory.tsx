import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../../components/ui/Card';
import { ShimmerLoader } from '../../../components/ui';
// import Input from '../../../components/ui/Input';
import { apiRequest } from '../../../services/api';
import { GET_BROKERAGE_REPORTS } from '../../../../api/api-variable';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useDebounce } from '@/Hook/useDebounce';
import { COLORS } from '@/constants';
import { enqueueSnackbar } from 'notistack';

interface Transaction {
  id: number;
  account: string;
  account_type: string;
  category: string;
  commision: string;
  create_on: string;
  email: string;
  level: string;
  symbol: string;
  ticket: string;
  volume: number;
}

interface ApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Transaction[];
  custom_data: {
    total: string;
  };
}

const TransactionHistory: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<ApiResponse | null>(null);
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
        endpoint: GET_BROKERAGE_REPORTS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: requestBody
      })
      .then((response: unknown) => {
        console.log('Transaction History:', response);
        
        // Check if response indicates success or failure
        const responseData = response as { response?: boolean; message?: string };
        
        if (responseData.response === false) {
          enqueueSnackbar(responseData.message || 'Failed to fetch transaction history!', { variant: 'error' });
        } else {
          setData(response as ApiResponse);
        }
      })
      
     .catch((error) => {
        console.error('Error fetching transaction history:', error);
        const errorMessage = error?.message || error?.response?.data?.message || 'Failed to fetch transaction history';
        enqueueSnackbar(errorMessage, { variant: 'error' });
      })
      .finally(() => {
        setIsLoading(false);
      });
     
    } catch (error) {
      console.error("Failed to fetch transaction history:", error);
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

  

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">View all your financial transactions</p>
        </div>

        {/* Search and Controls */}
       <Card className={`p-6 mb-6 bg-${COLORS.WHITE} border border-${COLORS.BORDER} ${COLORS.SHADOW} rounded-xl`}>
       
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
          
          {/* Search Bar */}
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-lg`}>
              <svg className={`w-5 h-5 text-${COLORS.PRIMARY}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search trades..."
              className={`border border-${COLORS.GRAY_BORDER} rounded-lg px-4 py-2 text-sm w-80 focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-${COLORS.PRIMARY} transition-all duration-200`}
            />
          </div>

          {/* Small Stats Grid */}
          <div className="flex items-center gap-3">
            <div className={`px-4 py-3 bg-green-50 border border-green-200 rounded-lg`}>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">10</div>
                <div className="text-xs text-green-600 font-medium">Open</div>
              </div>
            </div>
            <div className={`px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg`}>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">42</div>
                <div className="text-xs text-gray-600 font-medium">Closed</div>
              </div>
            </div>
            {/* <div className={`px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg`}>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{data?.recordsFiltered || 0}</div>
                <div className="text-xs text-blue-600 font-medium">Total</div>
              </div>
            </div> */}
          </div>
        </div>
      </Card>

        {/* Transactions Table */}
        <Card className="p-6">
          {isLoading ? (
            <ShimmerLoader variant="table" width={1000} height={400} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.map((transaction, index) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {currentPage * entriesPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.account}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.level}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {transaction.account_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.symbol}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.ticket}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.volume}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${parseFloat(transaction.commision).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.create_on}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              
              
            </>
          )}
        </Card>
         {/* Pagination Controls at Bottom */}
      <Card className={`p-6 bg-${COLORS.WHITE} border border-${COLORS.BORDER} ${COLORS.SHADOW} rounded-xl`}>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Entries Per Page */}
          <div className="flex items-center gap-3">
            <label className={`text-sm font-medium text-${COLORS.SECONDARY}`}>Show:</label>
            <select
              value={entriesPerPage}
              onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
              className={`border border-${COLORS.GRAY_BORDER} rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-${COLORS.PRIMARY} transition-all duration-200`}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>entries</span>
          </div>

          {/* Pagination Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePagination('prev')}
              disabled={currentPage === 0}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage === 0
                  ? `bg-${COLORS.GRAY_LIGHT} text-${COLORS.GRAY} cursor-not-allowed`
                  : `bg-${COLORS.WHITE} text-${COLORS.SECONDARY} border border-${COLORS.BORDER} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-${COLORS.PRIMARY} hover:border-${COLORS.PRIMARY}`
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className={`px-3 py-1 bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT} rounded-lg font-medium text-sm`}>
              Page {currentPage + 1} of {Math.ceil((data?.recordsFiltered || 0) / entriesPerPage)}
            </div>

            <button
              onClick={() => handlePagination('next')}
              disabled={!data || (currentPage + 1) * entriesPerPage >= data.recordsFiltered}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                !data || (currentPage + 1) * entriesPerPage >= data.recordsFiltered
                  ? `bg-${COLORS.GRAY_LIGHT} text-${COLORS.GRAY} cursor-not-allowed`
                  : `bg-${COLORS.WHITE} text-${COLORS.SECONDARY} border border-${COLORS.BORDER} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-${COLORS.PRIMARY} hover:border-${COLORS.PRIMARY}`
              }`}
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Page Info */}
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Showing {currentPage * entriesPerPage + 1} to {Math.min((currentPage + 1) * entriesPerPage, data?.recordsFiltered || 0)} of {data?.recordsFiltered || 0} entries
          </div>
        </div>
      </Card>

      </div>




      
    </div>
  );
};

export default TransactionHistory;
