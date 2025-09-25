/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { Plus, Settings, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { ShimmerLoader } from '../../components/ui';
// import { AccountType } from '../../types';
import { COLORS } from '../../constants/colors';
import logo from '../../assets/mt5logo.png';
import { apiRequest } from '@/services';
import { MANAGE_ACCOUNTS } from '../../../api/api-variable';
import { useAuth } from '@/context';

export interface AccountType {
  success: boolean;
  data: {
    id: number;
    name: string;
    type: number;
    group_slug: string;
    bonus: number;
    created_on: string;
    currency_id: number;
    income_copied: number | null;
    income_type: number;
    is_dedicated: number;
    is_visible: number;
    leverage: string;
    master_ids: number | null;
    min_deposit: number;
    platform_id: number;
    status: number;
    updated_on: string;
  }[];}

const ManageAccounts: React.FC = () => {
  const [accountTypes, setAccountTypes] = useState<AccountType['data']>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const {token}= useAuth();



  const fetchAccount = () => {
    setLoading(true);
    try {
      apiRequest({
        endpoint: MANAGE_ACCOUNTS,
        method: 'POST',

        headers: { Authorization: `Bearer ${token}` },
      }).then((response: unknown) => {
        setLoading(false);
        const res = response as AccountType;
        setAccountTypes(res.data);
      })
        .catch((error: unknown) => {
          console.error("Failed:", error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAccount();
  }, []);




 console.log(accountTypes);

  if (loading) {
    return (
      <div >
          <div className={`p-6 bg-${COLORS.SECONDARY_BG} min-h-screen`}>
        <ShimmerLoader variant="dashboard" width={1200} height={400} />
      </div>
       
        
      </div>
    );
  }

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
          <Card key={type.id } className="hover:shadow-lg transition-all duration-200 hover:scale-105">
            <div className="p-6">
              {/* Account Header */}
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-lg flex items-center justify-center mr-4`}>
                  {/* <TrendingUp className={`h-6 w-6 text-${COLORS.PRIMARY}`} /> */}
                  <img src={logo} alt="MT5 Logo" className="h-10" />

                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>{type.name}</h3>
                  {/* {type.markUp === 'Zero Spread Account' && (
                    <span className={`text-${COLORS.PRIMARY} text-xs font-bold`}>Zero Spread</span>
                  )} */}
                  <hr></hr> 
                </div>
              </div>


              {/* Account Details */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>Mark up:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>0.8 pips</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>Commission:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>$5 per lot</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>Swap:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>Reduced</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>IB Commission:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>35%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-${COLORS.SECONDARY_TEXT}`}>Min Deposit:</span>
                  <span className={`font-medium text-${COLORS.SECONDARY}`}>{type.min_deposit}</span>
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