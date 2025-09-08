import React from 'react';
import Card from '../../../components/ui/Card';

interface SupportFiltersProps {
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterDepartment: string;
  setFilterDepartment: (department: string) => void;
  departments: Array<{ id: string; name: string }>;
}

const SupportFilters: React.FC<SupportFiltersProps> = ({
  filterStatus,
  setFilterStatus,
  filterDepartment,
  setFilterDepartment,
  departments,
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'closed', label: 'Closed' },
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...departments.map(dept => ({
      value: dept.id,
      label: dept.name,
    })),
  ];

  return (
    <Card title="Filters" subtitle="Filter your support tickets">
      <div className="space-y-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department
          </label>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {departmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={() => {
            setFilterStatus('all');
            setFilterDepartment('all');
          }}
          className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </Card>
  );
};

export default SupportFilters;
