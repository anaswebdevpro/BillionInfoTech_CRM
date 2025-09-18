import React, { useState, useMemo, useEffect} from 'react';
import { COLORS } from '../../../constants/colors';
import { apiRequest } from '../../../services/api';
import { GET_USER_DOWNLINE } from '../../../../api/api-variable';
import { useAuth } from '../../../context/AuthContext/AuthContext';
import { useNavigate } from 'react-router-dom';



// Types
interface UserData {
  id: number | string;
  name?: string;
  email?: string;
  type?: string;
  status?: number;
  joined?: string;
  created_at?: string;
  account_type?: string;
}

// Constants
const ENTRIES_PER_PAGE_OPTIONS = [5, 10, 25] as const;
const DEFAULT_ENTRIES_PER_PAGE = 10;

// Reusable Components
const SummaryCard: React.FC<{ title: string; count: number; color: string }> = ({ title, count, color }) => (
  <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
    <div className={`text-2xl font-bold ${color}`}>{count}</div>
    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>{title}</div>
  </div>
);

const StatusBadge: React.FC<{ status: number }> = ({ status }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    {status === 1 ? 'ACTIVE' : 'INACTIVE'}
  </span>
);

const TypeBadge: React.FC<{ type: string; onEdit?: () => void }> = ({ type, onEdit }) => (
  <div className="flex items-center gap-2">
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      type === 'IB' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
    }`}>
      {type || 'N/A'}
    </span>
    {type === 'IB' && onEdit && (
      <button
        onClick={onEdit}
        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium hover:bg-blue-200 transition-colors"
        title="Edit Commission"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
    )}
  </div>
);

const AccountBadge: React.FC<{ accountType?: string }> = ({ accountType }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
    {accountType || 'MT5'}
  </span>
);

const PaginationButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  isActive?: boolean;
}> = ({ onClick, disabled, children, isActive }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-3 py-1 border rounded-md transition-colors ${
      isActive
        ? `bg-${COLORS.PRIMARY} text-white border-${COLORS.PRIMARY}`
        : `border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG}`
    } disabled:opacity-50 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

const SetCommission: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(DEFAULT_ENTRIES_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useAuth();
  const navigate = useNavigate();


  const FetchData  =() => {
    setIsLoading(true);
    try {
      apiRequest({
        endpoint: GET_USER_DOWNLINE,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        data:{
          level:1
        }
      })
      .then((response: unknown) => {         
        
        
        console.log('Data API Response:', response);


      if (Array.isArray(response)) {
          setData(response);
        } else if (response && typeof response === 'object' && 'data' in response) {
          setData((response as { data: UserData[] }).data || []);
        } else {
          setData([]);
        }
        setIsLoading(false);
      })
        .catch((error: Error) => {
          console.error('Failed to fetch user data:', error);
          setData([]);
          setIsLoading(false);
        });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      setIsLoading(false);
    }
  };  

  useEffect(() => {
    FetchData();
  }, []);

  // Handler for edit commission
  const handleEditCommission = (userItem: UserData) => {
    navigate('/dashboard/set-commission-form', { 
      state: { 
        userId: userItem.id, 
        userEmail: userItem.email,
        userName: userItem.name 
      } 
    });
  };



  

  // Data processing
  const filteredData = useMemo(() => 
    data.filter((item: UserData) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower)
      );
    }), [data, searchTerm]
  );

  const paginatedData = useMemo(() => 
    filteredData.slice(
      (currentPage - 1) * entriesPerPage,
      currentPage * entriesPerPage
    ), [filteredData, currentPage, entriesPerPage]
  );

  const stats = useMemo(() => ({
    total: filteredData.length,
    active: filteredData.filter((item: UserData) => item.status === 1).length,
    inactive: filteredData.filter((item: UserData) => item.status === 0).length,
    totalPages: Math.ceil(filteredData.length / entriesPerPage)
  }), [filteredData, entriesPerPage]);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleEntriesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing entries per page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, stats.totalPages));
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>My Network Income Settings</h1>
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>Manage your network income settings and configurations</p>
        </div>
        <button className={`px-4 py-2 bg-${COLORS.PRIMARY} text-white rounded-lg hover:bg-${COLORS.PRIMARY_BG} transition-colors`}>
          Add New
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>Search</label>
            <input
              type="text"
              placeholder="Search by name, ID, slug, or symbol..."
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>Entries per page</label>
            <select
              value={entriesPerPage}
              onChange={handleEntriesPerPageChange}
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              {ENTRIES_PER_PAGE_OPTIONS.map(option => (
                <option key={option} value={option}>{option} entries</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className={`px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors`}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard title="Filtered Results" count={stats.total} color="text-green-600" />
        <SummaryCard title="Active Items" count={stats.active} color="text-green-600" />
        <SummaryCard title="Inactive Items" count={stats.inactive} color="text-red-600" />
      </div>

      {/* Data Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                {['#', 'Email', 'Type', 'Status', 'Accounts', 'Joined On'].map(header => (
                  <th key={header} className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>
                    {header}
                    {header !== '#' && (
                      <div className="inline-flex flex-col ml-1">
                        <svg className="w-3 h-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 6l5 5 5-5z" />
                        </svg>
                        <svg className="w-3 h-2 -mt-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M15 14l-5-5-5 5z" />
                        </svg>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item: UserData, index: number) => (
                  <tr key={item.id || index} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                    <td className={`p-4 text-${COLORS.SECONDARY}`}>
                      <span className="font-medium">{(currentPage - 1) * entriesPerPage + index + 1}</span>
                    </td>
                    <td className="p-4 text-orange-600">
                      <div className="text-sm">{item.email || 'N/A'}</div>
                    </td>
                    <td className="p-4">
                      <TypeBadge 
                        type={item.type || ''} 
                        onEdit={item.type === 'IB' ? () => handleEditCommission(item) : undefined}
                      />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={item.status || 0} />
                    </td>
                    <td className="p-4">
                      <AccountBadge accountType={item.account_type} />
                    </td>
                    <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                      <div className="text-sm">{item.joined || item.created_at || 'N/A'}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className={`px-4 py-3 border-t border-${COLORS.BORDER} bg-${COLORS.SECONDARY_BG}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <div>
              Showing {paginatedData.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <PaginationButton
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </PaginationButton>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, stats.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <PaginationButton
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationButton>
                  );
                })}
              </div>

              <PaginationButton
                onClick={handleNextPage}
                disabled={currentPage === stats.totalPages}
              >
                Next
              </PaginationButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetCommission;
