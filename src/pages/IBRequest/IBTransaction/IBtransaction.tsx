import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button } from '../../../components/ui';
import { COLORS } from '../../../constants/colors';
import { DollarSign, BarChart3 } from 'lucide-react';
import { useAuth } from '@/context';
import { apiRequest } from '@/services';
import { IB_TRANSACTION, GET_LOT_WISE_TRANSACTIONS } from '../../../../api/api-variable';

interface TableRow {
  [key: string]: string | number;
}

interface TableData {
  draw: null;
  recordsTotal: number;
  recordsFiltered: number;
  data: TableRow[];
}

const IBTransaction: React.FC = () => {
  // State for data and loading
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [partnerCommissionsData, setPartnerCommissionsData] = useState<TableData | null>(null);
  const [lotWiseCommissionData, setLotWiseCommissionData] = useState<TableData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Fetch partner commissions data
  const fetchPartnerCommissions = useCallback(async () => {
    try {
      const response = await apiRequest({
        endpoint: IB_TRANSACTION,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response) {
        setPartnerCommissionsData(response as TableData);
        console.log('Partner Commissions Response:', response);
      }
    } catch (error) {
      console.error("Failed to fetch partner commissions:", error);
      setError("Failed to fetch partner commissions data");
    }
  }, [token]);

  // Fetch lot-wise commission data
  const fetchLotWiseCommissions = useCallback(async () => {
    try {
      const response = await apiRequest({
        endpoint: GET_LOT_WISE_TRANSACTIONS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response) {
        setLotWiseCommissionData(response as TableData);
        console.log('Lot-wise Commissions Response:', response);
      }
    } catch (error) {
      console.error("Failed to fetch lot-wise commissions:", error);
      setError("Failed to fetch lot-wise commission data");
    }
  }, [token]);

  // Fetch all data
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchPartnerCommissions(),
        fetchLotWiseCommissions()
      ]);
    } catch (error) {
      console.error("Failed to fetch transaction data:", error);
      setError("Failed to fetch transaction data");
    } finally {
      setIsLoading(false);
    }
  }, [fetchPartnerCommissions, fetchLotWiseCommissions]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);










  const handleRefresh = () => {
    console.log('Refreshing data...');
    fetchAllData();
  };

  const TableComponent: React.FC<{ title: string; headers: string[]; data: TableData | null; isLoading?: boolean }> = ({ title, headers, data, isLoading = false }) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`px-6 py-4 border-b border-${COLORS.BORDER}`}>
        <h3 className={`text-xl font-bold text-${COLORS.SECONDARY} flex items-center gap-2`}>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {title}
        </h3>
        <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mt-1`}>
          {isLoading ? 'Loading...' : `${data?.recordsTotal || 0} total transactions`}
        </p>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <label className={`text-sm font-semibold text-${COLORS.SECONDARY_TEXT}`}>Show</label>
            <select 
              value={entriesPerPage} 
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
                    {Object.values(row).map((cell: string | number, cellIndex: number) => (
                      <td key={cellIndex} className={`py-4 px-6 text-sm font-medium ${cellIndex === 0 ? `text-${COLORS.SECONDARY} font-bold` : `text-${COLORS.SECONDARY_TEXT}`}`}>
                        {typeof cell === 'string' && cell.startsWith('$') ? (
                          <span className="font-bold text-green-600">{cell}</span>
                        ) : cell}
                      </td>
                    ))}
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
                Showing <span className="text-green-600 font-bold">{data?.recordsFiltered === 0 ? 0 : 1}</span> to <span className="text-green-600 font-bold">{Math.min(entriesPerPage, data?.recordsFiltered || 0)}</span> of <span className="text-green-600 font-bold">{data?.recordsTotal || 0}</span> entries
              </>
            )}
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isLoading || (data?.recordsTotal || 0) <= entriesPerPage}
              className="px-4 py-2 font-semibold rounded-lg border-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={isLoading || (data?.recordsTotal || 0) <= entriesPerPage}
              className="px-4 py-2 font-semibold rounded-lg border-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY} tracking-tight`}>
            IB Transaction
          </h1>
          <p className={`text-base text-${COLORS.SECONDARY_TEXT} mt-2 font-medium`}>
            Monitor and manage IB transactions with real-time insights
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className={`text-4xl font-bold text-${COLORS.SECONDARY} mb-1`}>$1,642.95</div>
              <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT} uppercase tracking-wide`}>
                Total Earned Commission
              </div>
              <div className={`text-sm text-green-600 font-medium mt-1`}>
                ↗ +12.5% from last month
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className={`text-4xl font-bold text-${COLORS.SECONDARY} mb-1`}>24.7</div>
              <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT} uppercase tracking-wide`}>
                Total Lots Traded
              </div>
              <div className={`text-sm text-green-600 font-medium mt-1`}>
                ↗ +8.2% from last month
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Error State */}
      {error && (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-4 mb-6`}>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className={`text-red-700 font-medium`}>{error}</span>
          </div>
        </div>
      )}

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableComponent 
          title="Partner Commissions" 
          headers={["#", "Account", "Ticket", "Amount", "Date"]} 
          data={partnerCommissionsData} 
          isLoading={isLoading}
        />
        <TableComponent 
          title="Lot Wise Commission" 
          headers={["#", "Account", "Lots", "Amount", "Date"]} 
          data={lotWiseCommissionData} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default IBTransaction;
