/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { COLORS } from '../../../constants/colors';
import { apiRequest } from '../../../services';
import { GET_PARTNER_BUSINESS } from '../../../../api/api-variable';
import { useAuth } from '../../../context/AuthContext/AuthContext';

interface PartnerData {
  no: number;
  name: string;
  email: string;
  total_lots: string;
  level: number;
  total: string;
}

interface ApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: PartnerData[];
  custom_data: {
    total_users: number;
    total: string;
  };
}

const IBBusiness = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [partnerData, setPartnerData] = useState<ApiResponse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const fetchPartnerData = useCallback(() => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: GET_PARTNER_BUSINESS,
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).then((response: any) => {
        setLoading(false);
        setPartnerData(response);
        console.log(response);
      })
        .catch((error: any) => {
          console.error("Failed to fetch partner data:", error);
        });
    } catch (error) {
      console.error("Failed to fetch partner data:", error);
    } 
  }, [token]);

  useEffect(() => {
    fetchPartnerData();
  }, [fetchPartnerData]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredData = partnerData?.data?.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil((partnerData?.recordsFiltered || 0) / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className={`p-6 bg-${COLORS.SECONDARY_BG} min-h-screen`}>
      {/* Header with Total Amount */}
      <div className={`bg-${COLORS.WHITE} rounded-lg ${COLORS.SHADOW} p-6 mb-6`}>
        <div className="flex items-center">
          <div className={`w-12 h-12 bg-${COLORS.PRIMARY} rounded-lg flex items-center justify-center mr-4`}>
            <span className="text-white text-xl font-bold">$</span>
          </div>
          <div>
            <div className={`text-3xl font-bold text-${COLORS.PRIMARY}`}>
              $ {partnerData?.custom_data?.total || '0.000'}
            </div>
            <div className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Amount</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`bg-${COLORS.WHITE} rounded-lg ${COLORS.SHADOW}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Partner Reporting</h1>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <label className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Date Range:</label>
                <input
                  type="text"
                  value="09/18/2025 - 09/18/2025"
                  className={`px-3 py-2 border border-${COLORS.BORDER} rounded-md text-sm`}
                  readOnly
                />
              </div>
              
              <div className="flex items-center gap-2">
                <label className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Group:</label>
                <select className={`px-3 py-2 border border-${COLORS.BORDER} rounded-md text-sm`}>
                  <option>All</option>
                  <option>Trader</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Network Level:</label>
                <select className={`px-3 py-2 border border-${COLORS.BORDER} rounded-md text-sm`}>
                  <option>All</option>
                  <option>Level 1</option>
                  <option>Level 2</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Search:</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`px-3 py-2 border border-${COLORS.BORDER} rounded-md text-sm`}
                  placeholder="Search partners..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Table Controls */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Show</span>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className={`px-2 py-1 border border-${COLORS.BORDER} rounded text-sm`}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>entries</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`bg-${COLORS.SECONDARY_BG}`}>
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('no')}
                >
                  <div className="flex items-center gap-1">
                    #
                    <div className="flex flex-col">
                      <span className="text-xs">▲</span>
                      <span className="text-xs">▼</span>
                    </div>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    <div className="flex flex-col">
                      <span className="text-xs">▲</span>
                      <span className="text-xs">▼</span>
                    </div>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  <div className="flex items-center gap-1">
                    Email
                    <div className="flex flex-col">
                      <span className="text-xs">▲</span>
                      <span className="text-xs">▼</span>
                    </div>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('level')}
                >
                  <div className="flex items-center gap-1">
                    Level
                    <div className="flex flex-col">
                      <span className="text-xs">▲</span>
                      <span className="text-xs">▼</span>
                    </div>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total_lots')}
                >
                  <div className="flex items-center gap-1">
                    Total Lots
                    <div className="flex flex-col">
                      <span className="text-xs">▲</span>
                      <span className="text-xs">▼</span>
                    </div>
                  </div>
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total')}
                >
                  <div className="flex items-center gap-1">
                    Total
                    <div className="flex flex-col">
                      <span className="text-xs">▲</span>
                      <span className="text-xs">▼</span>
                    </div>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item.no} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {startIndex + index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.total_lots}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${item.total}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Showing {startIndex + 1} to {Math.min(endIndex, partnerData?.recordsFiltered || 0)} of {partnerData?.recordsFiltered || 0} entries
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm border border-${COLORS.BORDER} rounded ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 text-sm border rounded ${
                    currentPage === pageNum
                      ? `bg-${COLORS.PRIMARY} text-white border-${COLORS.PRIMARY}`
                      : `border-${COLORS.BORDER} hover:bg-gray-50`
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                <span className="px-2">...</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`px-3 py-1 text-sm border border-${COLORS.BORDER} rounded hover:bg-gray-50`}
                >
                  {totalPages}
                </button>
              </>
            )}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm border border-${COLORS.BORDER} rounded ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IBBusiness;