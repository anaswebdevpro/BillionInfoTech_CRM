import React from 'react';
import { COLORS } from '../../../constants/colors';
import { SearchAndFilterProps } from './types';

const SearchAndFilterControls: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  entriesPerPage,
  setEntriesPerPage,
  activeTab,
  onClearFilters,
}) => {
  return (
    <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER} p-6`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search Bar */}
        <div>
          <label className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}>
            Search
          </label>
          <input
            type="text"
            placeholder="Search by name, ID, slug, or symbol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-md focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
          />
        </div>

        {/* Status Filter - Only show for platforms and categories */}
        {(activeTab === 'platforms' || activeTab === 'categories') && (
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
        )}

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
          onClick={onClearFilters}
          className={`px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors`}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilterControls;
