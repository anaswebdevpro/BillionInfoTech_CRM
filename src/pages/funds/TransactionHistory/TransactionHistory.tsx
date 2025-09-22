import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import { apiRequest } from '../../../services/api';
import { GET_WALLET_TRANSACTION_REPORT } from '../../../../api/api-variable';
import { useAuth } from '../../../context/AuthContext/AuthContext';

interface Transaction {
  id: number;
  transaction_id: string;
  amount: string;
  type: 'credit' | 'debit';
  txn_type: string;
  remarks: string;
  created_on: string;
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

  const fetchData = useCallback(async (page = currentPage, search = searchValue, length = entriesPerPage) => {
    setIsLoading(true);
    setError(null);
    try {
      const requestBody = {
        start: page * length,
        length: length,
        search: search
      };
      
      const response = await apiRequest<ApiResponse>({
        endpoint: GET_WALLET_TRANSACTION_REPORT,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: requestBody
      });
      
      if (response) {
        setData(response);
      } else {
        setError("No data received from API");
      }
    } catch (error) {
      console.error("Failed to fetch wallet transactions:", error);
      setError("Failed to fetch wallet transactions");
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, searchValue, entriesPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'text-green-600';
      case 'debit':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handlePagination = (direction: 'next' | 'prev') => {
    const newPage = direction === 'next' ? currentPage + 1 : Math.max(0, currentPage - 1);
    setCurrentPage(newPage);
    fetchData(newPage, searchValue, entriesPerPage);
  };

  const handleSearch = useCallback((newSearchValue: string) => {
    setSearchValue(newSearchValue);
    setCurrentPage(0);
    fetchData(0, newSearchValue, entriesPerPage);
  }, [fetchData, entriesPerPage]);

  const handleEntriesPerPageChange = useCallback((newEntriesPerPage: number) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(0);
    fetchData(0, searchValue, newEntriesPerPage);
  }, [fetchData, searchValue]);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">View all your financial transactions</p>
        </div>

        {/* Search and Controls */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div>
                <Input
                  label="Search Transactions"
                  type="text"
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by remarks, amount, or transaction type..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entries per page
                </label>
                <select
                  value={entriesPerPage}
                  onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
            {data && (
              <div className="text-sm text-gray-600">
                Total Balance: <span className="font-semibold">${data.custom_data.total}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Transactions Table */}
        <Card className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading transactions...</p>
            </div>
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
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Remarks
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
                          {transaction.transaction_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${getTypeColor(transaction.type)}`}>
                            {transaction.type === 'debit' ? '-' : '+'}{transaction.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.type === 'credit' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.txn_type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {transaction.remarks}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.created_on}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing {currentPage * entriesPerPage + 1} to {Math.min((currentPage + 1) * entriesPerPage, data.recordsTotal)} of {data.recordsTotal} entries
                  {data.recordsFiltered !== data.recordsTotal && (
                    <span> (filtered from {data.recordsFiltered} total entries)</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePagination('prev')}
                    disabled={currentPage === 0}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => handlePagination('next')}
                    disabled={(currentPage + 1) * entriesPerPage >= data.recordsTotal}
                    className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TransactionHistory;
