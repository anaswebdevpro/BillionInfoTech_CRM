// Types for SetCommission components

export interface Group {
  id: number;
  name: string;
  symbol: string;
  curid: number;
}

export interface Platform {
  id: number;
  name: string;
  slug: string;
  status: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  status: number;
}

export interface NetworkIncomeSettings {
  title: string;
  groups: Group[];
  platforms: Platform[];
  categories: Category[];
}

export type TabType = 'groups' | 'platforms' | 'categories';

export interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  entriesPerPage: number;
  setEntriesPerPage: (count: number) => void;
  activeTab: TabType;
  onClearFilters: () => void;
}

export interface SummaryCardsProps {
  filteredData: (Group | Platform | Category)[];
}

export interface TabNavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  groupsCount: number;
  platformsCount: number;
  categoriesCount: number;
}

export interface DataTableProps {
  data: (Group | Platform | Category)[];
  activeTab: TabType;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  filteredDataLength: number;
  totalDataLength: number;
  onPageChange: (page: number) => void;
}
