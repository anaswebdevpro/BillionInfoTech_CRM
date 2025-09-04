
import React, { useState, useEffect } from 'react';
import { Plus, Settings, TrendingUp, Eye, Filter, Search } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { AccountType } from '../types';
import { COLORS } from '../constants/colors';

const ManageAccounts: React.FC = () => {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    // Dummy data for account types
    const dummyAccountTypes: AccountType[] = [
      {
        id: '1',
        name: 'Standard Account',
        markUp: '1.5 pips',
        commission: '$7 per lot',
        swap: 'Standard',
        ib: '30%',
        minDeposit: '$100'
      },
      {
        id: '2',
        name: 'ECN Account',
        markUp: 'Zero Spread Account',
        commission: '$3 per lot',
        swap: 'Standard',
        ib: '40%',
        minDeposit: '$500'
      },
      {
        id: '3',
        name: 'Pro Account',
        markUp: '0.8 pips',
        commission: '$5 per lot',
        swap: 'Reduced',
        ib: '35%',
        minDeposit: '$1000'
      },
      {
        id: '4',
        name: 'VIP Account',
        markUp: '0.5 pips',
        commission: '$2 per lot',
        swap: 'Minimal',
        ib: '50%',
        minDeposit: '$5000'
      },
      {
        id: '5',
        name: 'Islamic Account',
        markUp: '1.2 pips',
        commission: '$6 per lot',
        swap: 'No Swap',
        ib: '25%',
        minDeposit: '$200'
      },
      {
        id: '6',
        name: 'Micro Account',
        markUp: '2.0 pips',
        commission: '$10 per lot',
        swap: 'Standard',
        ib: '20%',
        minDeposit: '$50'
      }
    ];
    
    setAccountTypes(dummyAccountTypes);
  }, []);

  const filteredAccountTypes = accountTypes.filter(accountType => {
    const matchesSearch = accountType.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
      (selectedFilter === 'premium' && ['Pro Account', 'VIP Account'].includes(accountType.name)) ||
      (selectedFilter === 'standard' && ['Standard Account', 'ECN Account'].includes(accountType.name)) ||
      (selectedFilter === 'special' && ['Islamic Account', 'Micro Account'].includes(accountType.name));
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`border-b border-${COLORS.BORDER} pb-5`}>
        <h1 className={`text-3xl font-bold leading-6 text-${COLORS.SECONDARY}`}>Manage Accounts</h1>
        <p className={`mt-2 max-w-4xl text-sm text-${COLORS.SECONDARY_TEXT}`}>
          Choose from our range of trading account types and create new accounts with different configurations.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-${COLORS.GRAY} h-4 w-4`} />
            <Input
              type="text"
              placeholder="Search account types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 bg-${COLORS.WHITE} border-${COLORS.BORDER} text-${COLORS.SECONDARY}`}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className={`px-3 py-2 border border-${COLORS.BORDER} rounded-md bg-${COLORS.WHITE} text-${COLORS.SECONDARY} focus:outline-none focus:ring-2 focus:ring-${COLORS.PRIMARY}`}
          >
            <option value="all">All Types</option>
            <option value="premium">Premium</option>
            <option value="standard">Standard</option>
            <option value="special">Special</option>
          </select>
          <Button className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Account Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccountTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
            <div className="p-6">
              {/* Account Header */}
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-lg flex items-center justify-center mr-4`}>
                  <TrendingUp className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>{type.name}</h3>
                  {type.markUp === 'Zero Spread Account' && (
                    <span className={`text-${COLORS.PRIMARY} text-xs font-bold`}>Zero Spread</span>
                  )}
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>Mark up:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>{type.markUp}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>Commission:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>{type.commission}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>Swap:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>{type.swap}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>IB Commission:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>{type.ib}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>Min Deposit:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>{type.minDeposit}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className={`flex-1 bg-${COLORS.PRIMARY_BG} hover:bg-${COLORS.PRIMARY_TEXT} text-${COLORS.WHITE}`}
                  onClick={() => window.location.href = '/dashboard/trading-account'}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Open Account
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="px-3"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAccountTypes.length === 0 && (
        <Card className="text-center py-12">
          <TrendingUp className={`mx-auto h-12 w-12 text-${COLORS.GRAY}`} />
          <h3 className={`mt-2 text-sm font-medium text-${COLORS.SECONDARY}`}>No account types found</h3>
          <p className={`mt-1 text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Try adjusting your search or filter criteria.
          </p>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <Card className="p-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-lg flex items-center justify-center mr-3`}>
              <TrendingUp className={`h-4 w-4 text-${COLORS.PRIMARY}`} />
            </div>
            <div>
              <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Total Account Types</p>
              <p className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>{accountTypes.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 bg-${COLORS.SECONDARY_BG} rounded-lg flex items-center justify-center mr-3`}>
              <Settings className={`h-4 w-4 text-${COLORS.SECONDARY_TEXT}`} />
            </div>
            <div>
              <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Available Now</p>
              <p className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>{filteredAccountTypes.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center">
            <div className={`w-8 h-8 bg-${COLORS.YELLOW_BG} rounded-lg flex items-center justify-center mr-3`}>
              <Eye className={`h-4 w-4 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div>
              <p className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Premium Options</p>
              <p className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>2</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManageAccounts;
