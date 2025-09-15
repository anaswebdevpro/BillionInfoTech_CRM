
import React, { useState, useMemo } from 'react';
import { COLORS } from '../../../constants/colors';

// Define the data structure based on the provided JSON
interface SubIBData {
  id: number;
  first_name: string;
  email: string;
  status: number;
  created_on: string;
  sponsor: number;
  level: number;
}

interface SubIBResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: SubIBData[];
}

const MYSubIBSummary: React.FC = () => {
  // State for pagination, search, and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');

  // Sample data - replace with actual API call
  const subIBData: SubIBResponse = {
    "draw": 1,
    "recordsTotal": 9,
    "recordsFiltered": 9,
    "data": [
      {
        "id": 2,
        "first_name": "test",
        "email": "Test1.1@yopmail.com",
        "status": 1,
        "created_on": "2025-02-12 11:39:51",
        "sponsor": 1,
        "level": 1
      },
      {
        "id": 7,
        "first_name": "test",
        "email": "test@mail.com",
        "status": 1,
        "created_on": "2025-07-16 16:09:06",
        "sponsor": 1,
        "level": 1
      },
      {
        "id": 8,
        "first_name": "karan",
        "email": "karan@mail.com",
        "status": 1,
        "created_on": "2025-07-16 16:11:41",
        "sponsor": 1,
        "level": 1
      },
      {
        "id": 9,
        "first_name": "karan",
        "email": "karan12@mail.com",
        "status": 0,
        "created_on": "2025-07-16 16:17:44",
        "sponsor": 1,
        "level": 1
      },
      {
        "id": 10,
        "first_name": "gurpreet",
        "email": "guri@mail.com",
        "status": 1,
        "created_on": "2025-07-17 09:46:32",
        "sponsor": 1,
        "level": 1
      },
      {
        "id": 19,
        "first_name": "testfromapi",
        "email": "testfromapi@gmail.com",
        "status": 1,
        "created_on": "2025-09-01 13:14:17",
        "sponsor": 1,
        "level": 1
      },
      {
        "id": 3,
        "first_name": "test",
        "email": "Test1.2@yopmail.com",
        "status": 1,
        "created_on": "2025-02-12 11:44:14",
        "sponsor": 2,
        "level": 2
      },
      {
        "id": 4,
        "first_name": "test",
        "email": "Test1.3@yopmail.com",
        "status": 1,
        "created_on": "2025-02-12 11:45:31",
        "sponsor": 3,
        "level": 3
      },
      {
        "id": 5,
        "first_name": "test",
        "email": "Test1.4@yopmail.com",
        "status": 1,
        "created_on": "2025-02-12 12:02:13",
        "sponsor": 4,
        "level": 4
      }
    ]
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper function to get status badge
  const getStatusBadge = (status: number) => {
    return status === 1 ? (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800`}>
        Active
      </span>
    ) : (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800`}>
        Inactive
      </span>
    );
  };

  // Filter and search logic
  const filteredData = useMemo(() => {
    return subIBData.data.filter((item) => {
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
  }, [subIBData.data, searchTerm, statusFilter, levelFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, levelFilter, entriesPerPage]);

  // Get unique levels for filter dropdown
  const uniqueLevels = useMemo(() => {
    const levels = [...new Set(subIBData.data.map(item => item.level))].sort((a, b) => a - b);
    return levels;
  }, [subIBData.data]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>My Sub IB Summary</h1>
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>Overview of your sub IB partners and their details</p>
        </div>
        <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
          Total Records: {subIBData.recordsTotal}
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
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Active Sub IBs</div>
        </div>
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-red-600`}>
            {filteredData.filter(item => item.status === 0).length}
          </div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Inactive Sub IBs</div>
        </div>
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-${COLORS.PRIMARY}`}>
            {filteredData.length > 0 ? Math.max(...filteredData.map(item => item.level)) : 0}
          </div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Max Level</div>
        </div>
      </div>

      {/* Sub IB Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>ID</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Name</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Email</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Level</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Sponsor ID</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Created On</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((subIB) => (
                <tr
                  key={subIB.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className={`p-4 text-${COLORS.SECONDARY}`}>
                    <span className="font-medium">#{subIB.id}</span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY}`}>
                    <div className="font-medium">{subIB.first_name}</div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="text-sm">{subIB.email}</div>
                  </td>
                  <td className="p-4">
                    {getStatusBadge(subIB.status)}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY}`}>
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY} font-semibold text-sm`}>
                      {subIB.level}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    <span className="font-medium">#{subIB.sponsor}</span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="text-sm">{formatDate(subIB.created_on)}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <button className={`px-3 py-1 text-xs bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY} rounded-md hover:bg-${COLORS.PRIMARY} hover:text-white transition-colors`}>
                        View
                      </button>
                      <button className={`px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors`}>
                        Edit
                      </button>
                    </div>
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
              {filteredData.length !== subIBData.recordsTotal && (
                <span className="ml-2 text-gray-500">
                  (filtered from {subIBData.recordsTotal} total entries)
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