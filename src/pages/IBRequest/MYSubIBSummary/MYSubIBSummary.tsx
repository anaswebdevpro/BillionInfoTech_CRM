
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { COLORS } from '../../../constants/colors';
import { ShimmerText } from '../../../components/ui/Shimmer';
import { apiRequest } from '@/services';
import { GET_USER_DOWNLINE } from '../../../../api/api-variable';
import { useAuth } from '@/context';

// Define the data structure based on the actual API response
interface DownlineData {
  id: number;
  first_name: string;
  email: string;
  status: number; // 1 for active, 0 for inactive
  created_on: string; // Format: "YYYY-MM-DD HH:MM:SS"
  sponsor: number;
  level: number;
}

interface DownlineResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: DownlineData[];
}

// Utility functions following DRY principle
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString; // Return original string if parsing fails
  }
};

const getMemberType = (level: number): 'IB' | 'CLIENT' => {
  // Based on business logic - you can adjust this as needed
  return level === 1 ? 'IB' : 'CLIENT';
};


const getStatusBadge = (status: number) => {
  const isActive = status === 1;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'ACTIVE' : 'IN-ACTIVE'}
    </span>
  );
};

const getTypeBadge = (type: 'IB' | 'CLIENT') => {
  const isIB = type === 'IB';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isIB ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
    }`}>
      {type}
    </span>
  );
};

const MYSubIBSummary: React.FC = () => {
  // State for pagination, search, and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [downlineData, setDownlineData] = useState<DownlineResponse | null>(null);
  const { token } = useAuth();

  // Fetch downline data from API
  const FetchDownline = useCallback(() => {
    setIsLoading(true);
    try {
      apiRequest({
        endpoint: GET_USER_DOWNLINE,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: unknown) => {
        
        const downlineResponse = response as DownlineResponse;
        console.log('Downline API Response:', downlineResponse);
        
        setDownlineData(downlineResponse || null);
        setIsLoading(false);
      })
        .catch((error: Error) => {
          console.error('Failed to fetch downline data:', error);
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Failed to fetch downline data:', error);
      setIsLoading(false);
    } 
  }, [token]);

  useEffect(() => {
    FetchDownline();
  }, [FetchDownline]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    if (!downlineData?.data) return [];
    
    return downlineData.data.filter((item) => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        item.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm);

      // Status filter
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && item.status === 1) ||
        (statusFilter === 'inactive' && item.status === 0);

      // Level filter
      const matchesLevel = levelFilter === 'all' || 
        item.level.toString() === levelFilter;

      return matchesSearch && matchesStatus && matchesLevel;
    });
  }, [downlineData?.data, searchTerm, statusFilter, levelFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, levelFilter, entriesPerPage]);

  // Get unique levels for filter dropdown
  const uniqueLevels = useMemo(() => 
    downlineData?.data ? [...new Set(downlineData.data.map(item => item.level))].sort((a, b) => a - b) : [],
    [downlineData?.data]
  );

  // Shimmer Components
  const ShimmerTableRow = () => (
    <tr className={`border-b border-${COLORS.BORDER}`}>
      {[30, 200, 40, 60, 80, 32, 60, 120].map((width, i) => (
        <td key={i} className="p-4">
          <ShimmerText width={width} height={i === 2 || i === 3 || i === 4 || i === 6 ? 24 : i === 2 ? 32 : 16} 
            className={i === 2 || i === 3 || i === 4 || i === 6 ? "rounded-full" : ""} />
        </td>
      ))}
    </tr>
  );

  const ShimmerTable = () => (
    <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b border-${COLORS.BORDER}`}>
              {['#', 'Email', 'Level', 'Type', 'Status', 'Txns', 'Accounts', 'Joined On'].map(header => (
                <th key={header} className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 10 }, (_, i) => <ShimmerTableRow key={i} />)}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <ShimmerText width={200} height={32} />
            <ShimmerText width={300} height={16} />
          </div>
          <ShimmerText width={100} height={16} />
        </div>

        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="space-y-2">
                <ShimmerText width={80} height={16} />
                <ShimmerText width="100%" height={40} />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
              <ShimmerText width={40} height={32} />
              <ShimmerText width={120} height={16} className="mt-2" />
            </div>
          ))}
        </div>

        <ShimmerTable />
      </div>
    );
  }


  // No data state
  if (!downlineData?.data || downlineData.data.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Network Downline</h1>
            <p className={`text-${COLORS.SECONDARY_TEXT}`}>Overview of your network downline and their details</p>
          </div>
        </div>
        
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-8 text-center`}>
          <div className="text-6xl mb-4">📊</div>
          <h2 className={`text-xl font-semibold text-${COLORS.SECONDARY} mb-2`}>No Downline Data</h2>
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>You don't have any downline members yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Network Downline</h1>
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>Overview of your network downline and their details</p>
        </div>
        <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
          Total Records: {downlineData?.recordsTotal || 0}
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div>
            <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Level Filter */}
          <div>
            <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="all">All Levels</option>
              {uniqueLevels.map(level => (
                <option key={level} value={level.toString()}>Level {level}</option>
              ))}
            </select>
          </div>

          {/* Entries Per Page */}
          <div>
            <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
              Entries per page
            </label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value={5}>5 entries</option>
              <option value={10}>10 entries</option>
              <option value={25}>25 entries</option>
              <option value={50}>50 entries</option>
              <option value={100}>100 entries</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setLevelFilter('all');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-${COLORS.PRIMARY}`}>{filteredData.length}</div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Filtered Results</div>
        </div>
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-green-600`}>
            {filteredData.filter(item => item.status === 1).length}
          </div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Active Members</div>
        </div>
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-red-600`}>
            {filteredData.filter(item => item.status === 0).length}
          </div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Inactive Members</div>
        </div>
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-purple-600`}>
            {filteredData.filter(item => getMemberType(item.level) === 'IB').length}
          </div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>IB Members</div>
        </div>
      </div>

      {/* Network Downline Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                {['#', 'Email', 'Level', 'Type', 'Status', 'Txns', 'Accounts', 'Joined On'].map(header => (
                  <th key={header} className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((member, index) => (
                <tr key={member.id} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className={`p-4 text-${COLORS.SECONDARY}`}>
                    <span className="font-medium">{startIndex + index + 1}</span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="text-sm">{member.email}</div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY}`}>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold text-sm">
                      L{member.level}
                    </span>
                  </td>
                  <td className="p-4">{getTypeBadge(getMemberType(member.level))}</td>
                  <td className="p-4">{getStatusBadge(member.status)}</td>
                  <td className="p-4">
                    <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </button>
                  </td>
                  <td className="p-4">
                    <button className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium hover:bg-purple-200 transition-colors">
                      MT5
                    </button>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="text-sm">{formatDate(member.created_on)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className={`px-4 py-3 border-t border-${COLORS.BORDER} bg-${COLORS.SECONDARY_BG}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>
              Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
              {filteredData.length !== downlineData?.recordsTotal && (
                <span className="ml-2 text-gray-500">
                  (filtered from {downlineData?.recordsTotal} total entries)
                </span>
              )}
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border border-${COLORS.BORDER} rounded-md hover:bg-${COLORS.SECONDARY_BG} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border rounded-md transition-colors ${
                        currentPage === pageNum
                          ? `bg-${COLORS.PRIMARY} text-white border-${COLORS.PRIMARY}`
                          : `border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG}`
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border border-${COLORS.BORDER} rounded-md hover:bg-${COLORS.SECONDARY_BG} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MYSubIBSummary;