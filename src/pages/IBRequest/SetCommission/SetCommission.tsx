import React, { useState, useMemo, useCallback } from 'react';
import { COLORS } from '../../../constants/colors';
import { NetworkIncomeSettings, TabType } from './types';
import SearchAndFilterControls from './SearchAndFilterControls';
import SummaryCards from './SummaryCards';
import TabNavigation from './TabNavigation';
import DataTable from './DataTable';
import PaginationControls from './PaginationControls';

const SetCommission: React.FC = () => {
  // State for pagination, search, and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<TabType>('groups');

  // Sample data - replace with actual API call
  const networkIncomeData: NetworkIncomeSettings = useMemo(() => ({
    "title": "My Network Income Settings",
    "groups": [
      {
        "id": 1,
        "name": "TEST",
        "symbol": "USD",
        "curid": 1
      }
    ],
    "platforms": [
      {
        "id": 1,
        "name": "Meta Trader 5",
        "slug": "mt5",
        "status": 1
      }
    ],
    "categories": [
      {
        "id": 1,
        "name": "Forex",
        "slug": "forex",
        "status": 1
      },
      {
        "id": 2,
        "name": "Forex Majors",
        "slug": "forex_majors",
        "status": 1
      },
      {
        "id": 3,
        "name": "Metals",
        "slug": "Metals",
        "status": 1
      },
      {
        "id": 4,
        "name": "Energies",
        "slug": "Energies",
        "status": 1
      },
      {
        "id": 5,
        "name": "Indices",
        "slug": "Indices",
        "status": 1
      },
      {
        "id": 6,
        "name": "Crypto",
        "slug": "Crypto",
        "status": 1
      }
    ]
  }), []);

  // Get current data based on active tab
  const getCurrentData = useCallback(() => {
    switch (activeTab) {
      case 'groups':
        return networkIncomeData.groups;
      case 'platforms':
        return networkIncomeData.platforms;
      case 'categories':
        return networkIncomeData.categories;
      default:
        return [];
    }
  }, [activeTab, networkIncomeData]);

  // Filter and search logic
  const filteredData = useMemo(() => {
    const currentData = getCurrentData();
    return currentData.filter((item) => {
      // Search filter - works for all data types
      const matchesSearch = searchTerm === '' || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toString().includes(searchTerm) ||
        ('slug' in item && item.slug.toLowerCase().includes(searchTerm.toLowerCase())) ||
        ('symbol' in item && item.symbol.toLowerCase().includes(searchTerm.toLowerCase()));

      // Status filter - only applies to platforms and categories
      const matchesStatus = statusFilter === 'all' || 
        !('status' in item) || // Groups don't have status
        (statusFilter === 'active' && 'status' in item && item.status === 1) ||
        (statusFilter === 'inactive' && 'status' in item && item.status === 0);

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, getCurrentData]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = startIndex + entriesPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, activeTab, entriesPerPage]);

  // Clear filters handler
  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>{networkIncomeData.title}</h1>
          <p className={`text-${COLORS.SECONDARY_TEXT}`}>Manage your network income settings and configurations</p>
        </div>
        <button className={`px-4 py-2 bg-${COLORS.PRIMARY} text-white rounded-lg hover:bg-${COLORS.PRIMARY_BG} transition-colors`}>
          Add New
        </button>
      </div>

      {/* Search and Filter Controls */}
      <SearchAndFilterControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        entriesPerPage={entriesPerPage}
        setEntriesPerPage={setEntriesPerPage}
        activeTab={activeTab}
        onClearFilters={handleClearFilters}
      />

      {/* Summary Cards */}
      <SummaryCards
        filteredData={filteredData}
      />

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        groupsCount={networkIncomeData.groups.length}
        platformsCount={networkIncomeData.platforms.length}
        categoriesCount={networkIncomeData.categories.length}
      />

      {/* Data Table */}
      <div className="p-6">
        <DataTable
          data={paginatedData}
          activeTab={activeTab}
        />
        
        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          filteredDataLength={filteredData.length}
          totalDataLength={getCurrentData().length}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default SetCommission;