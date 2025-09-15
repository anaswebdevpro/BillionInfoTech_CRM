import React from 'react';
import { COLORS } from '../../../constants/colors';
import { TabNavigationProps } from './types';

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  setActiveTab,
  groupsCount,
  platformsCount,
  categoriesCount,
}) => {
  return (
    <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('groups')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'groups'
                ? `border-${COLORS.PRIMARY} text-${COLORS.PRIMARY}`
                : `border-transparent text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.SECONDARY} hover:border-gray-300`
            }`}
          >
            Groups ({groupsCount})
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'platforms'
                ? `border-${COLORS.PRIMARY} text-${COLORS.PRIMARY}`
                : `border-transparent text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.SECONDARY} hover:border-gray-300`
            }`}
          >
            Platforms ({platformsCount})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'categories'
                ? `border-${COLORS.PRIMARY} text-${COLORS.PRIMARY}`
                : `border-transparent text-${COLORS.SECONDARY_TEXT} hover:text-${COLORS.SECONDARY} hover:border-gray-300`
            }`}
          >
            Categories ({categoriesCount})
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
