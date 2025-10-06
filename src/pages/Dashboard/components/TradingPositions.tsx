import React, { useState, useMemo } from 'react';
import type { DashboardData } from '../../../types';

interface Position {
  srNo: number;
  orderId: string;
  account: string;
  type: string;
  openPrice: number;
  closePrice?: number;
  symbol: string;
  volume: number;
  id: string;
}

interface TradingPositionsProps {
  dashboardData: DashboardData | null;
}

const TradingPositions: React.FC<TradingPositionsProps> = ({ dashboardData }) => {
  const [showOpenPositions, setShowOpenPositions] = useState(true);
  
  // Transform and filter positions
  const { openPositions, closedPositions } = useMemo(() => {
    const recentTrades = dashboardData?.recent_trades || [];
    
    const allPositions: Position[] = recentTrades.map((trade, index) => ({
      srNo: index + 1,
      orderId: trade.order_id.toString(),
      account: trade.account_number.toString(),
      type: trade.side,
      openPrice: trade.open_price,
      closePrice: trade.close_price,
      symbol: trade.symbol,
      volume: trade.volume,
      id: trade.id.toString()
    }));
    
    // status: 0 = open, 1 = closed
    const open = allPositions.filter((_, idx) => recentTrades[idx].status === 0);
    const closed = allPositions.filter((_, idx) => recentTrades[idx].status === 1);
    
    return { openPositions: open, closedPositions: closed };
  }, [dashboardData]);
  
  const positions = showOpenPositions ? openPositions : closedPositions;
  return (
    <div className="w-full h-full">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
        {/* Custom Header with Title and Toggle Buttons */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Trading Positions</h3>
            <p className="text-sm text-gray-600 mt-1">Manage your trading positions</p>
          </div>
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                showOpenPositions
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setShowOpenPositions(true)}
            >
              Open ({openPositions.length})
            </button>
            <button
              className={`px-4 py-2 rounded text-sm font-medium transition ${
                !showOpenPositions
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={() => setShowOpenPositions(false)}
            >
              Closed ({closedPositions.length})
            </button>
          </div>
        </div>
        
        {/* Card Content with Scroll */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Sr No.</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Order ID</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Account</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Type</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">
                    {showOpenPositions ? "Open Price" : "Close Price"}
                  </th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Symbol</th>
                  <th className="px-2 py-2 text-left font-semibold text-gray-700">Volume</th>
                </tr>
              </thead>
              <tbody>
                {positions.length > 0 ? (
                  positions.map((pos) => (
                    <tr key={pos.id} className="">
                      <td className="px-2 py-2">{pos.srNo}</td>
                      <td className="px-2 py-2">{pos.orderId}</td>
                      <td className="px-2 py-2">{pos.account}</td>
                      <td className="px-2 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            pos.type === "Buy" || pos.type === "buy"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {pos.type}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        {showOpenPositions ? pos.openPrice : pos.closePrice}
                      </td>
                      <td className="px-2 py-2 font-bold">{pos.symbol}</td>
                      <td className="px-2 py-2">{pos.volume}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-2 py-4 text-center text-gray-500">
                      No {showOpenPositions ? "open" : "closed"} positions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer outside scroll area */}
          <div className="flex justify-between items-center mt-2 text-sm text-gray-600 flex-shrink-0">
            <span>
              Showing {positions.length} {showOpenPositions ? "open" : "closed"} positions
            </span>
            {showOpenPositions && (
              <span>
                Total:{" "}
                <span className="font-bold text-lg text-gray-900">
                  $0.00
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPositions;
