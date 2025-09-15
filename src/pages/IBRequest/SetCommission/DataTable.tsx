import React from 'react';
import { COLORS } from '../../../constants/colors';
import { DataTableProps, Group, Platform, Category } from './types';

// Helper function to get status badge
const getStatusBadge = (status: number) => {
  return status === 1 ? (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
      Active
    </span>
  ) : (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
      Inactive
    </span>
  );
};

const DataTable: React.FC<DataTableProps> = ({ data, activeTab }) => {
  const renderGroupsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b border-${COLORS.BORDER}`}>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>ID</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Group Name</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Symbol</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Currency ID</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const group = item as Group;
            return (
              <tr
                key={group.id}
                className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
              >
                <td className={`p-4 text-${COLORS.SECONDARY}`}>
                  <span className="font-medium">#{group.id}</span>
                </td>
                <td className={`p-4 text-${COLORS.SECONDARY}`}>
                  <div className="font-medium">{group.name}</div>
                </td>
                <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY} font-semibold text-sm`}>
                    {group.symbol}
                  </span>
                </td>
                <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                  <span className="font-medium">{group.curid}</span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className={`px-3 py-1 text-xs bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY} rounded-md hover:bg-${COLORS.PRIMARY} hover:text-white transition-colors`}>
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderPlatformsTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b border-${COLORS.BORDER}`}>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>ID</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Platform Name</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Slug</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const platform = item as Platform;
            return (
              <tr
                key={platform.id}
                className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
              >
                <td className={`p-4 text-${COLORS.SECONDARY}`}>
                  <span className="font-medium">#{platform.id}</span>
                </td>
                <td className={`p-4 text-${COLORS.SECONDARY}`}>
                  <div className="font-medium">{platform.name}</div>
                </td>
                <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {platform.slug}
                  </span>
                </td>
                <td className="p-4">
                  {getStatusBadge(platform.status)}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className={`px-3 py-1 text-xs bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY} rounded-md hover:bg-${COLORS.PRIMARY} hover:text-white transition-colors`}>
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderCategoriesTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b border-${COLORS.BORDER}`}>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>ID</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Category Name</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Slug</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
            <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const category = item as Category;
            return (
              <tr
                key={category.id}
                className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
              >
                <td className={`p-4 text-${COLORS.SECONDARY}`}>
                  <span className="font-medium">#{category.id}</span>
                </td>
                <td className={`p-4 text-${COLORS.SECONDARY}`}>
                  <div className="font-medium">{category.name}</div>
                </td>
                <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                  <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                    {category.slug}
                  </span>
                </td>
                <td className="p-4">
                  {getStatusBadge(category.status)}
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className={`px-3 py-1 text-xs bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY} rounded-md hover:bg-${COLORS.PRIMARY} hover:text-white transition-colors`}>
                      Edit
                    </button>
                    <button className="px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
      {activeTab === 'groups' && renderGroupsTable()}
      {activeTab === 'platforms' && renderPlatformsTable()}
      {activeTab === 'categories' && renderCategoriesTable()}
    </div>
  );
};

export default DataTable;
