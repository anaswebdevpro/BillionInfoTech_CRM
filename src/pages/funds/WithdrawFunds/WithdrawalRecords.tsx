import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

// TypeScript interfaces for withdrawal records
interface WithdrawalRecord {
  id: number;
  source: string;
  amount: number;
  bank: string;
  account: string;
  accountHolder: string;
  ifsc: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  date: string;
}

const WithdrawalRecords: React.FC = () => {
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'pending' | 'approved' | 'declined'>('pending');
  
  // Table state
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockData: WithdrawalRecord[] = [
      {
        id: 1,
        source: 'wallet',
        amount: 460,
        bank: 'STATE BANK OF INDIA',
        account: '30832209094',
        accountHolder: 'SANJAY KUMAR CHANDRA',
        ifsc: 'SBIN0005772',
        status: 'DECLINED',
        date: '07 Jun, 2025 06:54 am'
      },
      {
        id: 2,
        source: 'wallet',
        amount: 405,
        bank: 'STATE BANK OF INDIA',
        account: '30832209094',
        accountHolder: 'SANJAY KUMAR CHANDRA',
        ifsc: 'SBIN0005772',
        status: 'APPROVED',
        date: '06 May, 2025 10:20 am'
      },
      {
        id: 3,
        source: 'wallet',
        amount: 234,
        bank: 'STATE BANK OF INDIA',
        account: '30832209094',
        accountHolder: 'SANJAY KUMAR CHANDRA',
        ifsc: 'SBIN0005772',
        status: 'APPROVED',
        date: '06 Mar, 2025 11:57 am'
      },
      {
        id: 4,
        source: 'wallet',
        amount: 308,
        bank: 'STATE BANK OF INDIA',
        account: '30832209094',
        accountHolder: 'SANJAY KUMAR CHANDRA',
        ifsc: 'SBIN0005772',
        status: 'APPROVED',
        date: '07 Feb, 2025 07:31 am'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setRecords(mockData);
      setLoading(false);
    }, 1000);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-600 text-white';
      case 'PENDING':
        return 'bg-orange-600 text-white';
      case 'DECLINED':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // Filter records based on active filter
  const filteredByStatus = records.filter(record => {
    switch (activeFilter) {
      case 'pending':
        return record.status === 'PENDING';
      case 'approved':
        return record.status === 'APPROVED';
      case 'declined':
        return record.status === 'DECLINED';
      default:
        return true;
    }
  });

  // Apply search filter
  const filteredRecords = filteredByStatus.filter(record => 
    record.amount.toString().includes(searchTerm.toLowerCase()) ||
    record.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.accountHolder.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.ifsc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Apply sorting
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: string | number = a[sortField as keyof WithdrawalRecord];
    let bValue: string | number = b[sortField as keyof WithdrawalRecord];
    
    // Handle different data types
    if (sortField === 'amount' || sortField === 'id') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    } else {
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedRecords.length / entriesPerPage);
  const paginatedRecords = sortedRecords.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const getFilterCount = (status: 'pending' | 'approved' | 'declined') => {
    return records.filter(record => {
      switch (status) {
        case 'pending':
          return record.status === 'PENDING';
        case 'approved':
          return record.status === 'APPROVED';
        case 'declined':
          return record.status === 'DECLINED';
        default:
          return false;
      }
    }).length;
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading withdrawal records...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {/* Status Filter Buttons */}
      <div className="flex gap-2 mb-6">
        <Button
          onClick={() => setActiveFilter('pending')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === 'pending'
              ? 'bg-orange-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="w-2 h-2 bg-white rounded-full inline-block mr-2"></span>
          Pending ({getFilterCount('pending')})
        </Button>
        <Button
          onClick={() => setActiveFilter('approved')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === 'approved'
              ? 'bg-gray-800 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="w-2 h-2 bg-white rounded-full inline-block mr-2"></span>
          Approved ({getFilterCount('approved')})
        </Button>
        <Button
          onClick={() => setActiveFilter('declined')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeFilter === 'declined'
              ? 'bg-gray-200 text-gray-700'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="w-2 h-2 bg-white rounded-full inline-block mr-2"></span>
          Decline ({getFilterCount('declined')})
        </Button>
      </div>

      {/* Active Filter Display */}
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 capitalize">{activeFilter}</h3>
      </div>

      {/* Table Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={10}>Show 10 entries</option>
            <option value={25}>Show 25 entries</option>
            <option value={50}>Show 50 entries</option>
            <option value={100}>Show 100 entries</option>
          </select>
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
            <tr className="border-b border-gray-200">
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center gap-1">
                  Sr.No. {getSortIcon('id')}
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort('source')}
              >
                <div className="flex items-center gap-1">
                  Source {getSortIcon('source')}
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
                onClick={() => handleSort('bank')}
              >
                <div className="flex items-center gap-1">
                  Details {getSortIcon('bank')}
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
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No data available in table
                </td>
              </tr>
            ) : paginatedRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No matching records found
                </td>
              </tr>
            ) : (
              paginatedRecords.map((record, index) => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{(currentPage - 1) * entriesPerPage + index + 1}</td>
                  <td className="py-3 px-4">
                    <span className="text-blue-600 hover:underline cursor-pointer">
                      {record.source}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-orange-600">
                    $ {record.amount}
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <div>Bank - {record.bank}</div>
                      <div>Account - {record.account}</div>
                      <div>A/C Holder - {record.accountHolder}</div>
                      <div>IFSC - {record.ifsc}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{record.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-600">
          Showing {paginatedRecords.length === 0 ? 0 : (currentPage - 1) * entriesPerPage + 1} to {Math.min(currentPage * entriesPerPage, sortedRecords.length)} of {sortedRecords.length} entries
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
  );
};

export default WithdrawalRecords;