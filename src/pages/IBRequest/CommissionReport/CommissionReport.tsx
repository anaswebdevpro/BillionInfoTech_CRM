import React, { useState, useEffect, useCallback } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import { ShimmerLoader } from '../../../components/ui';
import { apiRequest } from '../../../services/api';
import { GET_BROKERAGE_REPORTS } from '../../../../api/api-variable';
import { useAuth } from '../../../context/AuthContext/AuthContext';

interface BrokerageRecord {
  id: number;
  email: string;
  level: string;
  account: string;
  account_type: string;
  ticket: string;
  symbol: string;
  category: string;
  volume: number;
  commision: string;
  create_on: string;
}

interface ApiResponse {
  response: boolean;
  recordsTotal: number;
  recordsFiltered: number;
  custom_data: {
    total: string;
  };
  data: BrokerageRecord[];
}

const CommissionReport: React.FC = () => {
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
        endpoint: GET_BROKERAGE_REPORTS,
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
      console.error("Failed to fetch brokerage reports:", error);
      setError("Failed to fetch brokerage reports");
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, searchValue, entriesPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'forex':
        return 'bg-blue-100 text-blue-800';
      case 'crypto':
        return 'bg-purple-100 text-purple-800';
      case 'commodities':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'self':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-orange-100 text-orange-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Commission Report</h1>
          <p className="text-gray-600">View all your brokerage commission details</p>
        </div>

        {/* Search and Controls */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div>
                <Input
                  label="Search Reports"
                  type="text"
                  value={searchValue}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search by email, symbol, ticket, or account..."
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
                Total Commission: <span className="font-semibold text-green-600">${data.custom_data.total}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Brokerage Reports Table */}
        <Card className="p-6">
          {isLoading ? (
            <ShimmerLoader variant="table" width={1000} height={400} />
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500">{error}</p>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No commission reports found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        S.No
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Account Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ticket
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Symbol
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Volume
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.map((record, index) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {currentPage * entriesPerPage + index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.email}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(record.level)}`}>
                            {record.level}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.account}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.account_type}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                          {record.ticket}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {record.symbol}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(record.category)}`}>
                            {record.category.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.volume}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${record.commision}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.create_on}
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

export default CommissionReport;
