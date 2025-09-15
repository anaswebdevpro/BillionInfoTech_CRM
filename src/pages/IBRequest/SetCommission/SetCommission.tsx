import React, { useState, useMemo } from 'react';
import { COLORS } from '../../../constants/colors';

// Dummy data structure as specified
const dummyData = {
  "draw": null,
  "recordsTotal": 0,
  "recordsFiltered": 0,
  "data": [{ id: 1, name: "TEST", email: "test@example.com", type: "IB", status: 1, joined: "16 Jul, 2025 04:09 pm" },
    { id: 2, name: "Meta Trader 5", email: "metatrader5@example.com", type: "CLIENT", status: 1, joined: "16 Jul, 2025 04:11 pm" },
    { id: 3, name: "Forex", email: "forex@example.com", type: "CLIENT", status: 1, joined: "16 Jul, 2025 04:17 pm" },
    { id: 4, name: "Forex Majors", email: "forexmajors@example.com", type: "IB", status: 1, joined: "17 Jul, 2025 09:46 am" },
    { id: 5, name: "Metals", email: "metals@example.com", type: "CLIENT", status: 1, joined: "09 Sep, 2025 08:32 am" },
    { id: 6, name: "Energies", email: "energies@example.com", type: "CLIENT", status: 1, joined: "12 Feb, 2025 11:39 am" },
    { id: 7, name: "Indices", email: "indices@example.com", type: "IB", status: 1, joined: "16 Jul, 2025 04:09 pm" },
    { id: 8, name: "Crypto", email: "crypto@example.com", type: "CLIENT", status: 1, joined: "16 Jul, 2025 04:11 pm" },{ id: 1, name: "TEST", email: "test@example.com", type: "IB", status: 1, joined: "16 Jul, 2025 04:09 pm" },
    { id: 2, name: "Meta Trader 5", email: "metatrader5@example.com", type: "CLIENT", status: 1, joined: "16 Jul, 2025 04:11 pm" },
    { id: 3, name: "Forex", email: "forex@example.com", type: "CLIENT", status: 1, joined: "16 Jul, 2025 04:17 pm" },
    { id: 4, name: "Forex Majors", email: "forexmajors@example.com", type: "IB", status: 1, joined: "17 Jul, 2025 09:46 am" },
    { id: 5, name: "Metals", email: "metals@example.com", type: "CLIENT", status: 1, joined: "09 Sep, 2025 08:32 am" },
    { id: 6, name: "Energies", email: "energies@example.com", type: "CLIENT", status: 1, joined: "12 Feb, 2025 11:39 am" },
    { id: 7, name: "Indices", email: "indices@example.com", type: "IB", status: 1, joined: "16 Jul, 2025 04:09 pm" },
    { id: 8, name: "Crypto", email: "crypto@example.com", type: "CLIENT", status: 1, joined: "16 Jul, 2025 04:11 pm" }]
};



const SetCommission: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Use dummy data structure but with sample data for demo
  const data = dummyData.data;

  const filteredData = useMemo(() => 
    data.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
    ), [data, searchTerm]
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const activeCount = filteredData.filter(item => item.status === 1).length;
  const inactiveCount = filteredData.filter(item => item.status === 0).length;

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
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>Entries per page</label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value={5}>5 entries</option>
              <option value={10}>10 entries</option>
              <option value={25}>25 entries</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSearchTerm('')}
              className={`px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors`}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-green-600`}>{filteredData.length}</div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Filtered Results</div>
        </div>
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-green-600`}>{activeCount}</div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Active Items</div>
        </div>
        <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-4`}>
          <div className={`text-2xl font-bold text-red-600`}>{inactiveCount}</div>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Inactive Items</div>
        </div>
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
              {paginatedData.map((item, index) => (
                <tr key={item.id} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className={`p-4 text-${COLORS.SECONDARY}`}>
                    <span className="font-medium">{(currentPage - 1) * entriesPerPage + index + 1}</span>
                  </td>
                  <td className="p-4 text-orange-600">
                    <div className="text-sm">{item.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.type === 'IB' ? 'bg-purple-100 text-purple-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ACTIVE
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      MT5
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="text-sm">{item.joined}</div>
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
              Showing {paginatedData.length > 0 ? (currentPage - 1) * entriesPerPage + 1 : 0} to {Math.min(currentPage * entriesPerPage, filteredData.length)} of {filteredData.length} entries
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 border border-${COLORS.BORDER} rounded-md hover:bg-${COLORS.SECONDARY_BG} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Previous
              </button>

              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
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

export default SetCommission;
