import { useAuth } from "@/context";
import { apiRequest } from "@/services";
import { GET_TRADES_HISTORY } from "../../../../api/api-variable";
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui";
import { useDebounce } from "../../../Hook/useDebounce";
import { COLORS } from "@/constants/colors";

interface TradeData {
  order_id: number;
  account_number: number;
  symbol: string;
  side: string;
  open_price: number;
  volume: number;
  status: number;
  close_price: number;
  profit: number;
  created_on: string;
  closed_on: string;
}

interface TableData {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Array<TradeData>;
}


const IBtradeHistory = () => {
  const { token } = useAuth();
  const [data, setData] = useState<TableData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  //  page = currentPage, search = searchValue, length = entriesPerPage

  const fetchData = useCallback((page = currentPage, search = debouncedSearchValue, length = entriesPerPage) => {
   setLoading(true);
    try {
      const requestBody = {
        start: page * length,
        length: length,
        search: search
      };     
        
      apiRequest({
        endpoint: GET_TRADES_HISTORY,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data: requestBody
      })
      .then((response: unknown) => {
         setData(response as TableData);
        console.log('Trade History:', response);
      })
      
     .catch((error) => {
        console.error('Error fetching trade history:', error);
      })
      .finally(() => {
        setLoading(false);
      });
     
    } catch (error) {
      console.error("Failed to fetch trade history:", error);
      setLoading(false);
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

  // Separate trades based on status
  const openPositions = data?.data?.filter(trade => trade.status !== 1) || [];
  const closedPositions = data?.data?.filter(trade => trade.status === 1) || [];

  const renderTable = (trades: TradeData[], tableTitle: string) => (
    <Card className={`p-6 mb-8 bg-${COLORS.WHITE} border border-${COLORS.BORDER} ${COLORS.SHADOW} rounded-xl`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold text-${COLORS.SECONDARY} flex items-center gap-3`}>
          <div className={`p-2 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-lg`}>
            <svg className={`w-6 h-6 text-${COLORS.PRIMARY}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          {tableTitle}
        </h2>
        <div className={`px-3 py-1 bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT} rounded-full text-sm font-semibold`}>
          {trades.length} trades
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className={`inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-${COLORS.PRIMARY} bg-${COLORS.PRIMARY_BG_LIGHT} transition ease-in-out duration-150`}>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading trades...
          </div>
        </div>
      ) : trades.length === 0 ? (
        <div className="text-center py-12">
          <div className={`mx-auto h-24 w-24 text-${COLORS.GRAY} mb-4`}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className={`text-lg font-medium text-${COLORS.SECONDARY} mb-2`}>No {tableTitle.toLowerCase()} found</h3>
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>There are no trades matching your criteria.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={`bg-${COLORS.SECONDARY_BG}`}>
              <tr>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>S.No</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Account</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Order ID</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Symbol</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Side</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Volume</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Open Price</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Close Price</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Created</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Closed</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Profit</th>
                <th className={`px-6 py-4 text-left text-xs font-semibold text-${COLORS.SECONDARY} uppercase tracking-wider`}>Status</th>
              </tr>
            </thead>
            <tbody className={`bg-${COLORS.WHITE} divide-y divide-gray-200`}>
              {trades.map((trade, index) => (
                <tr key={trade.order_id || index} className={`hover:bg-${COLORS.SECONDARY_BG} transition-colors duration-150`}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-${COLORS.SECONDARY}`}>
                    {currentPage * entriesPerPage + index + 1}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-${COLORS.SECONDARY}`}>
                    {trade.account_number}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${COLORS.SECONDARY_TEXT} font-mono`}>
                    {trade.order_id}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold text-${COLORS.SECONDARY}`}>
                    {trade.symbol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      trade.side?.toLowerCase() === 'buy' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        trade.side?.toLowerCase() === 'buy' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      {trade.side}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${COLORS.SECONDARY_TEXT} font-mono`}>
                    {trade.volume}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${COLORS.SECONDARY_TEXT} font-mono`}>
                    {trade.open_price}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${COLORS.SECONDARY_TEXT} font-mono`}>
                    {trade.close_price}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${COLORS.SECONDARY_TEXT}`}>
                    {trade.created_on}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-${COLORS.SECONDARY_TEXT}`}>
                    {trade.closed_on}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                      trade.profit >= 0 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {trade.profit >= 0 ? '+' : ''}{trade.profit}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      trade.status === 1 
                        ? `bg-${COLORS.GRAY_LIGHT} text-${COLORS.SECONDARY_TEXT} border border-${COLORS.BORDER}`
                        : `bg-blue-100 text-blue-800 border border-blue-200`
                    }`}>
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        trade.status === 1 ? 'bg-gray-400' : 'bg-blue-500'
                      }`}></div>
                      {trade.status === 1 ? 'Closed' : 'Open'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Simple Header with Search and Stats */}
      <Card className={`p-6 mb-6 bg-${COLORS.WHITE} border border-${COLORS.BORDER} ${COLORS.SHADOW} rounded-xl`}>
       
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          
           <div className={`text-3xl font-bold text-${COLORS.SECONDARY} mb-4 flex items-center gap-3`}>
          <h1>Trade History</h1>
        </div>
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
                <div className="text-lg font-bold text-green-600">{openPositions.length}</div>
                <div className="text-xs text-green-600 font-medium">Open</div>
              </div>
            </div>
            <div className={`px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg`}>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">{closedPositions.length}</div>
                <div className="text-xs text-gray-600 font-medium">Closed</div>
              </div>
            </div>
            <div className={`px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg`}>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{data?.recordsFiltered || 0}</div>
                <div className="text-xs text-blue-600 font-medium">Total</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Open Positions Table */}
      {renderTable(openPositions, "Open Positions")}

      {/* Closed Positions Table */}
      {renderTable(closedPositions, "Closed Positions")}

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
  );
}

export default IBtradeHistory