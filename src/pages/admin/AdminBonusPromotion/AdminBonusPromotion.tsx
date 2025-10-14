import React from 'react';
import { Gift, TrendingUp, Users, Calendar, Plus, Search, Filter, Eye, Edit, Trash2, Target } from 'lucide-react';
import { COLORS } from '../../../constants/colors';

const AdminBonusPromotion: React.FC = () => {
  const bonusData = [
    { 
      id: 1, 
      name: 'Welcome Bonus', 
      type: 'Deposit Bonus', 
      value: '100%', 
      maxAmount: '$5,000', 
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      claims: 1247
    },
    { 
      id: 2, 
      name: 'Trading Contest', 
      type: 'Contest', 
      value: '$50,000', 
      maxAmount: '$10,000', 
      status: 'Active',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      claims: 892
    },
    { 
      id: 3, 
      name: 'Loyalty Reward', 
      type: 'Cashback', 
      value: '5%', 
      maxAmount: '$1,000', 
      status: 'Draft',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      claims: 0
    },
    { 
      id: 4, 
      name: 'Referral Bonus', 
      type: 'Referral', 
      value: '$100', 
      maxAmount: '$500', 
      status: 'Expired',
      startDate: '2024-01-01',
      endDate: '2024-02-29',
      claims: 567
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Bonus & Promotion</h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage bonuses, promotions, and marketing campaigns
            </p>
          </div>
          <button className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}>
            <Plus className="h-4 w-4" />
            Create New Promotion
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <Gift className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Active Promotions</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>12</p>
            </div>
          </div>
        </div>
        
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Claims</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>2,706</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.YELLOW_BG} p-3 rounded-lg`}>
              <TrendingUp className={`h-6 w-6 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Conversion Rate</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>23.5%</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Target className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Value</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>$167K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-${COLORS.GRAY} h-4 w-4`} />
              <input
                type="text"
                placeholder="Search promotions..."
                className={`w-full pl-10 pr-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Types</option>
              <option value="deposit">Deposit Bonus</option>
              <option value="contest">Contest</option>
              <option value="cashback">Cashback</option>
              <option value="referral">Referral</option>
            </select>
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
            </select>
            <button className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-2`}>
              <Filter className="h-4 w-4" />
              Advanced Filter
            </button>
          </div>
        </div>
      </div>

      {/* Promotions Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Promotion Name</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Type</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Value</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Max Amount</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Claims</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Period</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bonusData.map((bonus) => (
                <tr key={bonus.id} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{bonus.name}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      bonus.type === 'Deposit Bonus' ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}` :
                      bonus.type === 'Contest' ? 'bg-blue-50 text-blue-700' :
                      bonus.type === 'Cashback' ? 'bg-purple-50 text-purple-700' :
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {bonus.type}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>{bonus.value}</td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{bonus.maxAmount}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Users className={`h-4 w-4 text-${COLORS.GRAY} mr-1`} />
                      <span className="font-medium">{bonus.claims}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      bonus.status === 'Active' ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}` :
                      bonus.status === 'Draft' ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}` :
                      'bg-red-50 text-red-700'
                    }`}>
                      {bonus.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{bonus.startDate} - {bonus.endDate}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className={`text-${COLORS.PRIMARY} hover:text-green-700 transition-colors`}>
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className={`text-blue-600 hover:text-blue-700 transition-colors`}>
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-700 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className={`px-6 py-4 border-t border-${COLORS.BORDER} flex items-center justify-between`}>
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Showing 1-4 of 12 promotions
          </div>
          <div className="flex space-x-1">
            <button className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-${COLORS.SECONDARY_TEXT} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
              Previous
            </button>
            <button className={`px-3 py-1 bg-${COLORS.PRIMARY} text-${COLORS.WHITE} rounded`}>
              1
            </button>
            <button className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-${COLORS.SECONDARY_TEXT} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBonusPromotion;
