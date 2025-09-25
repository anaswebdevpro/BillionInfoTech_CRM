
import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Copy, Download, FileSpreadsheet, Printer, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../../components/ui/Card';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { ShimmerLoader } from '../../../../components/ui';
import { COLORS } from '../../../../constants/colors';
import { apiRequest } from '@/services';
import { DEPOSIT_METHODS_TRC20 } from '../../../../../api/api-variable';
import { useAuth } from '@/context';

// TypeScript interfaces
interface Currency {
  id: number;
  symbol: string;
}

interface TRC20Response {
  response: boolean;
  address: string;
  chain: string;
  currency: Currency;
  min_deposit: number;
  qrimage: string;
  title: string;
}

interface DepositHistoryItem {
  sr_no: number;
  amount: string;
  txn_hash: string;
  status: 'Pending' | 'Completed' | 'Failed';
  date: string;
}


const TRC20: React.FC = () => {
  const { token } = useAuth();
  const [trc20Data, setTrc20Data] = useState<TRC20Response | null>(null);
  const [depositHistory, setDepositHistory] = useState<DepositHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [copied, setCopied] = useState(false);

  const fetchTRC20Data = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest({
        endpoint: DEPOSIT_METHODS_TRC20,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }) as TRC20Response;

      if (response && response.response) {
        setTrc20Data(response);
        // TODO: Add deposit history API call here
        setDepositHistory([]);
        console.log('TRC20 data loaded:', response);
      }
    } catch (error) {
      console.error("Failed to fetch TRC20 data:", error);
      setTrc20Data(null);
      setDepositHistory([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTRC20Data();
  }, [fetchTRC20Data]);

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const filteredHistory = depositHistory.filter(item => 
    item.amount.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.txn_hash.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredHistory.length / entriesPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <ShimmerLoader variant="form" width={800} height={600} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className={`text-3xl font-bold leading-6 text-${COLORS.SECONDARY}`}>
            {trc20Data ? trc20Data.title : 'USDT TRC20 Deposit'}
          </h1>
          <p className={`mt-2 max-w-4xl text-sm text-${COLORS.SECONDARY_TEXT}`}>
            {trc20Data ? `Deposit ${trc20Data.currency.symbol} using ${trc20Data.chain.toUpperCase()} network` : 'Deposit USDT using TRC20 network'}
          </p>
        </div>
      </div>

      {/* QR Code Section */}
      {trc20Data && (
        <Card>
          <div className="text-center py-8">
            {/* Network Badge */}
            <div className="inline-block mb-6">
              <span className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm">
                {trc20Data.chain.toUpperCase()}
              </span>
            </div>

            {/* QR Code */}
            <div className="mb-6">
              <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-4`}>
                Your {trc20Data.currency.symbol} Wallet Address
              </h2>
              <div className="inline-block p-4 bg-white rounded-lg border-2 border-gray-200">
                <img 
                  src={trc20Data.qrimage} 
                  alt="QR Code" 
                  className="w-64 h-64 mx-auto"
                />
              </div>
            </div>

            {/* Wallet Address */}
            <div className="mb-4">
              <p className={`text-lg font-mono text-${COLORS.SECONDARY} break-all`}>
                {trc20Data.address}
              </p>
              <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mt-2`}>
                Note: This address is <strong>{trc20Data.chain.toUpperCase()}</strong> compliant
              </p>
            </div>

            {/* Copy Button */}
            <Button
              onClick={() => copyToClipboard(trc20Data.address)}
              className="mb-6"
            >
              <Copy className="h-4 w-4 mr-2" />
              {copied ? 'Copied!' : 'Copy Address'}
            </Button>

            {/* Warning Notes */}
            <div className="text-left max-w-md mx-auto space-y-2">
              <p className="text-red-600 text-sm">
                Note:- Scan above QR code to transfer funds to your Demo wallet.
              </p>
              <p className="text-red-600 text-sm">
                • Funds deposited less than Min. Deposit Limit i.e. {trc20Data.currency.symbol} {trc20Data.min_deposit} will not be considered & credited
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Deposit History Table */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>Deposit History</h2>
          <div className="flex items-center gap-2">
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-sm`}
            >
              <option value={10}>Show 10 entries</option>
              <option value={25}>Show 25 entries</option>
              <option value={50}>Show 50 entries</option>
              <option value={100}>Show 100 entries</option>
            </select>
          </div>
        </div>

        {/* Export/Print Buttons */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button variant="outline" size="sm">
              <FileSpreadsheet className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Excel
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm">Search:</label>
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('sr_no')}
                >
                  <div className="flex items-center gap-1">
                    Sr.No. {getSortIcon('sr_no')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount {getSortIcon('amount')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('txn_hash')}
                >
                  <div className="flex items-center gap-1">
                    Txn Hash {getSortIcon('txn_hash')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status {getSortIcon('status')}
                  </div>
                </th>
                <th 
                  className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date {getSortIcon('date')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {depositHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No deposit history available
                  </td>
                </tr>
              ) : paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No matching records found
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((item, index) => (
                  <tr key={index} className={`border-b border-${COLORS.BORDER} hover:bg-gray-50`}>
                    <td className="py-3 px-4">{item.sr_no}</td>
                    <td className="py-3 px-4 font-medium">{item.amount}</td>
                    <td className="py-3 px-4 font-mono text-sm">
                      <span className="truncate block max-w-xs" title={item.txn_hash}>
                        {item.txn_hash}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{item.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Showing {paginatedHistory.length === 0 ? 0 : 1} to {paginatedHistory.length} of {filteredHistory.length} entries
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TRC20;