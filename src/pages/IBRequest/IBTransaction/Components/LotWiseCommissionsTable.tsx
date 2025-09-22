import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button } from '../../../../components/ui';
import { COLORS } from '../../../../constants/colors';
import { useAuth } from '@/context';
import { apiRequest } from '@/services';
import { GET_LOT_WISE_TRANSACTIONS } from '../../../../../api/api-variable';

interface TableRow {
  [key: string]: string | number | null;
}

interface TableData {
  draw: null;
  recordsTotal: number;
  recordsFiltered: number;
  data: TableRow[];
}

const LotWiseCommissionsTable: React.FC = () => {
  // State for Lot Wise Commission table
  const [data, setData] = useState<TableData | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { token } = useAuth();

  // Fetch lot-wise commission data
  const fetchData = useCallback(async (page = currentPage, search = searchValue, length = entriesPerPage) => {
    setIsLoading(true);
    setError(null);
    try {
      const requestBody = {
        start: page * length,
        length: length,
        search: { value: search }  // Object format for Lot Wise API
      };
      
      console.log('Lot Wise Commissions Request:', {
        endpoint: GET_LOT_WISE_TRANSACTIONS,
        requestBody,
        token: token ? 'Present' : 'Missing'
      });
      
      const response = await apiRequest({
        endpoint: GET_LOT_WISE_TRANSACTIONS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: requestBody
      });
      
      console.log('Lot Wise Commissions Response:', response);
      
      if (response) {
        setData(response as TableData);
        console.log('Lot Wise Commissions Data Set Successfully');
      } else {
        console.warn('Lot Wise Commissions: No response received');
        setError("No data received from Lot Wise Commissions API");
      }
    } catch (error) {
      console.error("Failed to fetch lot-wise commissions:", error);
      setError("Failed to fetch lot-wise commission data");
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage, searchValue, entriesPerPage]);

  // Pagination handler
  const handlePagination = (direction: 'next' | 'prev') => {
    const newPage = direction === 'next' ? currentPage + 1 : Math.max(0, currentPage - 1);
    setCurrentPage(newPage);
    fetchData(newPage, searchValue, entriesPerPage);
  };

  // Search handler
  const handleSearch = useCallback((newSearchValue: string) => {
    setSearchValue(newSearchValue);
    setCurrentPage(0);
    fetchData(0, newSearchValue, entriesPerPage);
  }, [fetchData, entriesPerPage]);

  // Entries per page handler
  const handleEntriesPerPageChange = useCallback((newEntriesPerPage: number) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(0);
    fetchData(0, searchValue, newEntriesPerPage);
  }, [fetchData, searchValue]);

  // Load data on component mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Format cell values
  const formatCellValue = (value: string | number | null, columnIndex: number) => {
    if (value === null || value === undefined) {
      return '-';
    }
    
    if (columnIndex === 3 && typeof value === 'number') {
      return `$${value.toFixed(2)}`;
    }
    
    if (columnIndex === 4 && typeof value === 'string') {
      try {
        const date = new Date(value);
        return date.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return value;
      }
    }
    
    return value;
  };

  const headers = ["#", "Account", "Lots", "Amount", "Date"];

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`px-6 py-4 border-b border-${COLORS.BORDER}`}>
        <h3 className={`text-xl font-bold text-${COLORS.SECONDARY} flex items-center gap-2`}>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          Lot Wise Commission
        </h3>
        <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mt-1`}>
          {isLoading ? 'Loading...' : `${data?.recordsTotal || 0} total transactions`}
        </p>
      </div>
      
      <div className="p-6">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-700 text-sm font-medium">{error}</span>
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <label className={`text-sm font-semibold text-${COLORS.SECONDARY_TEXT}`}>Show</label>
            <select 
              value={entriesPerPage} 
              onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
              className={`border-2 border-${COLORS.BORDER} rounded-lg px-3 py-2 text-sm font-medium focus:border-green-500 focus:outline-none transition-colors`}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className={`text-sm font-semibold text-${COLORS.SECONDARY_TEXT}`}>entries</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className={`border-2 border-${COLORS.BORDER} rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:border-green-500 focus:outline-none transition-colors placeholder-gray-400`}
            />
            <svg className="w-4 h-4 absolute right-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className={`text-left py-4 px-6 font-bold text-sm text-${COLORS.SECONDARY} uppercase tracking-wider`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={headers.length} className={`text-center py-12 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                      <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT}`}>Loading transactions...</div>
                    </div>
                  </td>
                </tr>
              ) : !data || data.data?.length === 0 ? ( 
                <tr>
                  <td colSpan={headers.length} className={`text-center py-12 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT}`}>No transactions found</div>
                      <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Try adjusting your search or filters</div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.data?.map((row: TableRow, index: number) => (
                  <tr key={index} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {Object.values(row).map((cell: string | number | null, cellIndex: number) => {
                      const formattedValue = formatCellValue(cell, cellIndex);
                      return (
                        <td key={cellIndex} className={`py-4 px-6 text-sm font-medium ${cellIndex === 0 ? `text-${COLORS.SECONDARY} font-bold` : `text-${COLORS.SECONDARY_TEXT}`}`}>
                          {cellIndex === 3 ? (
                            <span className="font-bold text-green-600">{formattedValue}</span>
                          ) : (
                            formattedValue
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className={`text-sm font-semibold text-${COLORS.SECONDARY_TEXT}`}>
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                Showing <span className="text-green-600 font-bold">{data?.recordsFiltered === 0 ? 0 : (currentPage * entriesPerPage + 1)}</span> to <span className="text-green-600 font-bold">{Math.min((currentPage + 1) * entriesPerPage, data?.recordsFiltered || 0)}</span> of <span className="text-green-600 font-bold">{data?.recordsTotal || 0}</span> entries
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isLoading || currentPage === 0}
              onClick={() => handlePagination('prev')}
              className="px-4 py-2 font-semibold rounded-lg border-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isLoading || (data ? (currentPage + 1) * entriesPerPage >= (data.recordsTotal || 0) : false)}
              onClick={() => handlePagination('next')}
              className="px-4 py-2 font-semibold rounded-lg border-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default LotWiseCommissionsTable;