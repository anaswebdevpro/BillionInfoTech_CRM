import { useAuth } from "@/context";
import { apiRequest } from "@/services";
import { GET_TRADES_HISTORY } from "../../../../api/api-variable";
import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui";
import { useDebounce } from "../../../Hook/useDebounce";

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
    <Card className="p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">{tableTitle}</h2>
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : trades.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No {tableTitle.toLowerCase()} found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-left">Account Number</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Order ID</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Symbol</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Side</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Volume</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Open Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Close Price</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Created On</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Closed On</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Profit</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade, index) => (
                <tr key={trade.order_id || index} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2">{trade.account_number}</td>
                  <td className="border border-gray-300 px-4 py-2">{trade.order_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{trade.symbol}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      trade.side?.toLowerCase() === 'buy' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{trade.volume}</td>
                  <td className="border border-gray-300 px-4 py-2">{trade.open_price}</td>
                  <td className="border border-gray-300 px-4 py-2">{trade.close_price}</td>
                  <td className="border border-gray-300 px-4 py-2">{trade.created_on}</td>
                  <td className="border border-gray-300 px-4 py-2">{trade.closed_on}</td>
                  <td className={`border border-gray-300 px-4 py-2 font-medium ${
                    trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trade.profit >= 0 ? '+' : ''}{trade.profit}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      trade.status === 1 
                        ? 'bg-gray-100 text-gray-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
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
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Trade History</h1>
        <p className="text-gray-600 mt-2">
          View your open and closed trading positions
        </p>
      </div>

      {/* Search and Controls */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Search:</label>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search trades..."
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>

          {/* Entries Per Page */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Show:</label>
            <select
              value={entriesPerPage}
              onChange={(e) => handleEntriesPerPageChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm">entries</span>
          </div>

          {/* Pagination Info */}
          <div className="text-sm text-gray-600">
            Showing {currentPage * entriesPerPage + 1} to {Math.min((currentPage + 1) * entriesPerPage, data?.recordsFiltered || 0)} of {data?.recordsFiltered || 0} entries
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => handlePagination('prev')}
            disabled={currentPage === 0}
            className="px-4 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage + 1} of {Math.ceil((data?.recordsFiltered || 0) / entriesPerPage)}
          </span>

          <button
            onClick={() => handlePagination('next')}
            disabled={!data || (currentPage + 1) * entriesPerPage >= data.recordsFiltered}
            className="px-4 py-2 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </Card>

      {/* Open Positions Table */}
      {renderTable(openPositions, "Open Positions")}

      {/* Closed Positions Table */}
      {renderTable(closedPositions, "Closed Positions")}
    </div>
  );
}

export default IBtradeHistory