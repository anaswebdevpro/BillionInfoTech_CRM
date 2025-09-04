import React from 'react';
import { Users, Target, TrendingUp, Award, Plus, Search, Filter, Eye, Edit, Trash2, User } from 'lucide-react';
import { COLORS } from '../../constants/colors';

const AdminSalesManagers: React.FC = () => {
  const managersData = [
    { 
      id: 1, 
      name: 'John Smith', 
      email: 'john.smith@company.com',
      phone: '+1 (555) 123-4567',
      team: 'Team Alpha',
      leads: 156, 
      conversions: 89,
      revenue: '$245,000', 
      status: 'Active',
      joinDate: '2023-01-15',
      region: 'North America'
    },
    { 
      id: 2, 
      name: 'Sarah Johnson', 
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 234-5678',
      team: 'Team Beta',
      leads: 203, 
      conversions: 127,
      revenue: '$315,600', 
      status: 'Active',
      joinDate: '2022-11-08',
      region: 'Europe'
    },
    { 
      id: 3, 
      name: 'Michael Chen', 
      email: 'michael.chen@company.com',
      phone: '+1 (555) 345-6789',
      team: 'Team Gamma',
      leads: 178, 
      conversions: 98,
      revenue: '$198,750', 
      status: 'Active',
      joinDate: '2023-03-22',
      region: 'Asia Pacific'
    },
    { 
      id: 4, 
      name: 'Emma Rodriguez', 
      email: 'emma.rodriguez@company.com',
      phone: '+1 (555) 456-7890',
      team: 'Team Delta',
      leads: 134, 
      conversions: 67,
      revenue: '$167,890', 
      status: 'On Leave',
      joinDate: '2022-08-14',
      region: 'Latin America'
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Sales Managers</h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage sales team leaders and their performance
            </p>
          </div>
          <button className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}>
            <Plus className="h-4 w-4" />
            Add New Manager
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <Users className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Managers</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>24</p>
            </div>
          </div>
        </div>
        
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Leads</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>671</p>
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
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>57.2%</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Revenue</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>$927K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>Team Performance Overview</h2>
          <select className={`px-3 py-1 border border-${COLORS.BORDER} rounded-lg text-sm focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        <div className={`h-64 bg-${COLORS.SECONDARY_BG} rounded-lg flex items-center justify-center`}>
          <div className={`text-${COLORS.SECONDARY_TEXT} text-center`}>
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Performance Chart Placeholder</p>
            <p className="text-sm">Chart component would be integrated here</p>
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
                placeholder="Search managers..."
                className={`w-full pl-10 pr-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Teams</option>
              <option value="alpha">Team Alpha</option>
              <option value="beta">Team Beta</option>
              <option value="gamma">Team Gamma</option>
              <option value="delta">Team Delta</option>
            </select>
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Regions</option>
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="ap">Asia Pacific</option>
              <option value="la">Latin America</option>
            </select>
            <button className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-2`}>
              <Filter className="h-4 w-4" />
              Advanced Filter
            </button>
          </div>
        </div>
      </div>

      {/* Managers Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Manager</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Contact</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Team</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Leads</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Conversions</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Revenue</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {managersData.map((manager) => (
                <tr key={manager.id} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-full flex items-center justify-center mr-3`}>
                        <User className={`h-5 w-5 text-${COLORS.PRIMARY}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{manager.name}</div>
                        <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>{manager.region}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      <div>{manager.email}</div>
                      <div>{manager.phone}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700`}>
                      {manager.team}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Target className={`h-4 w-4 text-${COLORS.GRAY} mr-1`} />
                      <span className="font-medium">{manager.leads}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <TrendingUp className={`h-4 w-4 text-${COLORS.PRIMARY} mr-1`} />
                      <span className="font-medium">{manager.conversions}</span>
                      <span className={`text-sm text-${COLORS.SECONDARY_TEXT} ml-1`}>
                        ({Math.round((manager.conversions / manager.leads) * 100)}%)
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600">{manager.revenue}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      manager.status === 'Active' ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}` :
                      manager.status === 'On Leave' ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}` :
                      'bg-red-50 text-red-700'
                    }`}>
                      {manager.status}
                    </span>
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
            Showing 1-4 of 24 managers
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

export default AdminSalesManagers;
