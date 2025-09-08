import React from 'react';
import { User, Lock, FileText, CreditCard } from 'lucide-react';

type TabType = 'profile' | 'password' | 'kyc' | 'bank';

interface ProfileTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'profile' as TabType, label: 'Profile Info', icon: User },
    { id: 'password' as TabType, label: 'Change Password', icon: Lock },
    { id: 'kyc' as TabType, label: 'KYC Verification', icon: FileText },
    { id: 'bank' as TabType, label: 'Bank Details', icon: CreditCard },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                isActive
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default ProfileTabs;
