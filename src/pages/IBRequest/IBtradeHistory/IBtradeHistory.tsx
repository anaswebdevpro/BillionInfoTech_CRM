
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, Search, Scale, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { COLORS } from '../../../constants/colors';

interface TradePosition {
  ticket: string;
  account: string;
  level: number;
  symbol: string;
  type: 'BUY' | 'SELL';
  openPrice: string;
  closePrice?: string;
  volume: string;
  openedOn: string;
  closedOn?: string;
}

const IBtradeHistory: React.FC = () => {
  const [openPositions] = useState<TradePosition[]>([]);
  const [closedPositions, setClosedPositions] = useState<TradePosition[]>([]);
  const [openLots, setOpenLots] = useState(0);
  const [closedLots, setClosedLots] = useState(0);
  const [openEntriesPerPage, setOpenEntriesPerPage] = useState(10);
  const [closedEntriesPerPage, setClosedEntriesPerPage] = useState(10);
  const [openCurrentPage, setOpenCurrentPage] = useState(1);
  const [closedCurrentPage, setClosedCurrentPage] = useState(1);
  const [openNetworkLevel, setOpenNetworkLevel] = useState('All');
  const [closedNetworkLevel, setClosedNetworkLevel] = useState('All');
  const [openSearchTerm, setOpenSearchTerm] = useState('');
  const [closedSearchTerm, setClosedSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Mock data for closed positions
    const mockClosedPositions: TradePosition[] = [
      {
        ticket: '162836138',
        account: '2132630027',
        level: 1,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.11',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836164',
        account: '2132630053',
        level: 2,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.01',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836165',
        account: '2132630054',
        level: 3,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.02',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836166',
        account: '2132630055',
        level: 4,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.03',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836167',
        account: '2132630056',
        level: 1,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.05',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836168',
        account: '2132630057',
        level: 2,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.06',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836169',
        account: '2132630058',
        level: 3,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.07',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836170',
        account: '2132630059',
        level: 4,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.08',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836171',
        account: '2132630060',
        level: 1,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.09',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      },
      {
        ticket: '162836172',
        account: '2132630061',
        level: 2,
        symbol: 'EURUSD',
        type: 'SELL',
        openPrice: '1.17053',
        closePrice: '1.17016',
        volume: '0.10',
        openedOn: '16 Aug, 2025 12:53 am',
        closedOn: '16 Aug, 2025 12:53 am'
      }
    ];

    // Set mock data
    setClosedPositions(mockClosedPositions);
    setOpenLots(0);
    setClosedLots(10);
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 text-gray-600" /> : 
      <ChevronDown className="h-4 w-4 text-gray-600" />;
  };

  const filteredClosedPositions = closedPositions.filter(position => {
    const matchesSearch = position.ticket.includes(closedSearchTerm) || 
                         position.account.includes(closedSearchTerm) ||
                         position.symbol.includes(closedSearchTerm);
    const matchesLevel = closedNetworkLevel === 'All' || position.level.toString() === closedNetworkLevel;
    return matchesSearch && matchesLevel;
  });

  const filteredOpenPositions = openPositions.filter(position => {
    const matchesSearch = position.ticket.includes(openSearchTerm) || 
                         position.account.includes(openSearchTerm) ||
                         position.symbol.includes(openSearchTerm);
    const matchesLevel = openNetworkLevel === 'All' || position.level.toString() === openNetworkLevel;
    return matchesSearch && matchesLevel;
  });

  const totalClosedPages = Math.ceil(filteredClosedPositions.length / closedEntriesPerPage);
  const totalOpenPages = Math.ceil(filteredOpenPositions.length / openEntriesPerPage);

  const paginatedClosedPositions = filteredClosedPositions.slice(
    (closedCurrentPage - 1) * closedEntriesPerPage,
    closedCurrentPage * closedEntriesPerPage
  );

  const paginatedOpenPositions = filteredOpenPositions.slice(
    (openCurrentPage - 1) * openEntriesPerPage,
    openCurrentPage * openEntriesPerPage
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="flex gap-4">
        <div className={`w-16 h-16 bg-${COLORS.PRIMARY_BG} rounded-lg flex items-center justify-center`}>
          <Scale className={`h-8 w-8 text-${COLORS.PRIMARY}`} />
        </div>
        <Card className="flex-1">
          <div className="text-center">
            <div className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>{openLots}</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Open Lots</div>
          </div>
        </Card>
        
        <div className={`w-16 h-16 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-lg flex items-center justify-center`}>
          <Scale className={`h-8 w-8 text-${COLORS.PRIMARY}`} />
        </div>
        <Card className="flex-1">
          <div className="text-center">
            <div className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>{closedLots}</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Closed Lots</div>
          </div>
        </Card>
      </div>

      {/* Open Positions Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>Open Positions</h2>
          <div className="flex items-center gap-2">
            <select
              value={openEntriesPerPage}
              onChange={(e) => setOpenEntriesPerPage(Number(e.target.value))}
              className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-sm`}
            >
              <option value={10}>Show 10 entries</option>
              <option value={25}>Show 25 entries</option>
              <option value={50}>Show 50 entries</option>
              <option value={100}>Show 100 entries</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('ticket')}
                >
                  <div className="flex items-center gap-1">
                    Ticket {getSortIcon('ticket')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('account')}
                >
                  <div className="flex items-center gap-1">
                    Account {getSortIcon('account')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('level')}
                >
                  <div className="flex items-center gap-1">
                    Level {getSortIcon('level')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center gap-1">
                    Symbol {getSortIcon('symbol')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-1">
                    Type {getSortIcon('type')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('openPrice')}
                >
                  <div className="flex items-center gap-1">
                    Open Price {getSortIcon('openPrice')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('volume')}
                >
                  <div className="flex items-center gap-1">
                    Volume {getSortIcon('volume')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('openedOn')}
                >
                  <div className="flex items-center gap-1">
                    Opened On {getSortIcon('openedOn')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOpenPositions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No matching records found
                  </td>
                </tr>
              ) : (
                paginatedOpenPositions.map((position, index) => (
                  <tr key={index} className={`border-b border-${COLORS.BORDER} hover:bg-gray-50`}>
                    <td className="py-3 px-4">{position.ticket}</td>
                    <td className="py-3 px-4">
                      <span className="text-orange-600">{position.account}</span>
                    </td>
                    <td className="py-3 px-4">{position.level}</td>
                    <td className="py-3 px-4">
                      <span className={`bg-${COLORS.PRIMARY_BG} text-${COLORS.PRIMARY} px-2 py-1 rounded-full text-xs`}>
                        {position.symbol}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs`}>
                        {position.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">{position.openPrice}</td>
                    <td className="py-3 px-4">{position.volume}</td>
                    <td className="py-3 px-4">{position.openedOn}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Showing {paginatedOpenPositions.length === 0 ? 0 : 1} to {paginatedOpenPositions.length} of {filteredOpenPositions.length} entries (filtered from 180 total entries)
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Network Level:</label>
              <select
                value={openNetworkLevel}
                onChange={(e) => setOpenNetworkLevel(e.target.value)}
                className={`px-2 py-1 border border-${COLORS.BORDER} rounded text-sm`}
              >
                <option value="All">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={openSearchTerm}
                onChange={(e) => setOpenSearchTerm(e.target.value)}
                className="w-32"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenCurrentPage(Math.max(1, openCurrentPage - 1))}
                disabled={openCurrentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenCurrentPage(Math.min(totalOpenPages, openCurrentPage + 1))}
                disabled={openCurrentPage === totalOpenPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Closed Positions Section */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>Closed Positions</h2>
          <div className="flex items-center gap-2">
            <select
              value={closedEntriesPerPage}
              onChange={(e) => setClosedEntriesPerPage(Number(e.target.value))}
              className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-sm`}
            >
              <option value={10}>Show 10 entries</option>
              <option value={25}>Show 25 entries</option>
              <option value={50}>Show 50 entries</option>
              <option value={100}>Show 100 entries</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('ticket')}
                >
                  <div className="flex items-center gap-1">
                    Ticket {getSortIcon('ticket')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('account')}
                >
                  <div className="flex items-center gap-1">
                    Account {getSortIcon('account')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('level')}
                >
                  <div className="flex items-center gap-1">
                    Level {getSortIcon('level')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center gap-1">
                    Symbol {getSortIcon('symbol')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-1">
                    Type {getSortIcon('type')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('openPrice')}
                >
                  <div className="flex items-center gap-1">
                    Open Price {getSortIcon('openPrice')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('closePrice')}
                >
                  <div className="flex items-center gap-1">
                    Close Price {getSortIcon('closePrice')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('volume')}
                >
                  <div className="flex items-center gap-1">
                    Volume {getSortIcon('volume')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('closedOn')}
                >
                  <div className="flex items-center gap-1">
                    Closed On {getSortIcon('closedOn')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedClosedPositions.map((position, index) => (
                <tr key={index} className={`border-b border-${COLORS.BORDER} hover:bg-gray-50`}>
                  <td className="py-3 px-4">{position.ticket}</td>
                  <td className="py-3 px-4">
                    <span className="text-orange-600">{position.account}</span>
                  </td>
                  <td className="py-3 px-4">{position.level}</td>
                  <td className="py-3 px-4">
                    <span className={`bg-${COLORS.PRIMARY_BG} text-${COLORS.PRIMARY} px-2 py-1 rounded-full text-xs`}>
                      {position.symbol}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs`}>
                      {position.type}
                    </span>
                  </td>
                  <td className="py-3 px-4">{position.openPrice}</td>
                  <td className="py-3 px-4">{position.closePrice}</td>
                  <td className="py-3 px-4">{position.volume}</td>
                  <td className="py-3 px-4">{position.closedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Showing {paginatedClosedPositions.length === 0 ? 0 : 1} to {paginatedClosedPositions.length} of {filteredClosedPositions.length} entries (filtered from 180 total entries)
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Network Level:</label>
              <select
                value={closedNetworkLevel}
                onChange={(e) => setClosedNetworkLevel(e.target.value)}
                className={`px-2 py-1 border border-${COLORS.BORDER} rounded text-sm`}
              >
                <option value="All">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={closedSearchTerm}
                onChange={(e) => setClosedSearchTerm(e.target.value)}
                className="w-32"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setClosedCurrentPage(Math.max(1, closedCurrentPage - 1))}
                disabled={closedCurrentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalClosedPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={closedCurrentPage === pageNum ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setClosedCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {totalClosedPages > 5 && (
                  <>
                    <span className="px-2">...</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setClosedCurrentPage(totalClosedPages)}
                    >
                      {totalClosedPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setClosedCurrentPage(Math.min(totalClosedPages, closedCurrentPage + 1))}
                disabled={closedCurrentPage === totalClosedPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default IBtradeHistory;