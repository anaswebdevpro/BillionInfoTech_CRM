
import React, { useState, useEffect } from 'react';
import { Plus, Settings, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { AccountType } from '../../types';
import { COLORS } from '../../constants/colors';
import logo from '../../assets/mt5logo.png';

const ManageAccounts: React.FC = () => {
  const [accountTypes, setAccountTypes] = useState<AccountType[]>([]);

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


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`border-b border-${COLORS.BORDER} pb-5`}>
        <h1 className={`text-3xl font-bold leading-6 text-${COLORS.SECONDARY}`}>Manage Accounts</h1>
        <p className={`mt-2 max-w-4xl text-sm text-${COLORS.SECONDARY_TEXT}`}>
          Choose from our range of trading account types and create new accounts with different configurations.
        </p>
      </div>


      {/* Account Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
            <div className="p-6">
              {/* Account Header */}
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-lg flex items-center justify-center mr-4`}>
                  {/* <TrendingUp className={`h-6 w-6 text-${COLORS.PRIMARY}`} /> */}
                  <img src={logo} alt="MT5 Logo" className="h-10" />

                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>{type.name}</h3>
                  {type.markUp === 'Zero Spread Account' && (
                    <span className={`text-${COLORS.PRIMARY} text-xs font-bold`}>Zero Spread</span>
                  )}
                  <hr></hr> 
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
      {accountTypes.length === 0 && (
        <Card className="text-center py-12">
          <TrendingUp className={`mx-auto h-12 w-12 text-${COLORS.GRAY}`} />
          <h3 className={`mt-2 text-sm font-medium text-${COLORS.SECONDARY}`}>No account types found</h3>
          <p className={`mt-1 text-sm text-${COLORS.SECONDARY_TEXT}`}>
            No account types available at the moment.
          </p>
        </Card>
      )}

    </div>
  );
};

export default ManageAccounts;