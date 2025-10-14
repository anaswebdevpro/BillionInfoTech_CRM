import React from 'react';
import { Building, MapPin, Users, TrendingUp, Plus, Search, Filter, Eye, Edit, Trash2, Globe } from 'lucide-react';
import { COLORS } from '../../../constants/colors';

const AdminManageFranchise: React.FC = () => {
  const franchiseData = [
    { 
      id: 1, 
      name: 'Trading Solutions Europe', 
      location: 'London, UK', 
      manager: 'James Wilson', 
      email: 'james@tradingeu.com',
      phone: '+44 20 7946 0958',
      clients: 2456, 
      revenue: '$1,245,000', 
      status: 'Active',
      joinDate: '2022-03-15',
      region: 'Europe'
    },
    { 
      id: 2, 
      name: 'Pacific Trading Hub', 
      location: 'Sydney, Australia', 
      manager: 'Sarah Chen', 
      email: 'sarah@pacifictrade.com',
      phone: '+61 2 9374 4000',
      clients: 1823, 
      revenue: '$987,500', 
      status: 'Active',
      joinDate: '2022-07-22',
      region: 'Asia Pacific'
    },
    { 
      id: 3, 
      name: 'American Forex Partners', 
      location: 'New York, USA', 
      manager: 'Michael Rodriguez', 
      email: 'michael@afpartners.com',
      phone: '+1 212 555 0123',
      clients: 3245, 
      revenue: '$1,567,890', 
      status: 'Active',
      joinDate: '2021-11-08',
      region: 'North America'
    },
    { 
      id: 4, 
      name: 'Dubai Financial Group', 
      location: 'Dubai, UAE', 
      manager: 'Ahmed Al-Rashid', 
      email: 'ahmed@dubaifingroup.com',
      phone: '+971 4 423 4567',
      clients: 987, 
      revenue: '$456,789', 
      status: 'Pending',
      joinDate: '2024-01-12',
      region: 'Middle East'
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Manage Franchise</h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Oversee franchise partners and regional operations
            </p>
          </div>
          <button className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}>
            <Plus className="h-4 w-4" />
            Add New Franchise
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <Building className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Franchises</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>27</p>
            </div>
          </div>
        </div>
        
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Active Regions</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>12</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.YELLOW_BG} p-3 rounded-lg`}>
              <Users className={`h-6 w-6 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Clients</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>8,511</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Revenue</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>$4.26M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Regional Performance */}
      <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}>
        <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY} mb-4`}>Regional Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className={`text-2xl font-bold text-${COLORS.PRIMARY}`}>8</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Europe</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">6</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Asia Pacific</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">7</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>North America</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className={`text-2xl font-bold text-${COLORS.YELLOW_TEXT}`}>6</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Others</div>
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
                placeholder="Search franchises..."
                className={`w-full pl-10 pr-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Regions</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia Pacific</option>
              <option value="america">North America</option>
              <option value="middle-east">Middle East</option>
            </select>
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-2`}>
              <Filter className="h-4 w-4" />
              Advanced Filter
            </button>
          </div>
        </div>
      </div>

      {/* Franchise Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Franchise</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Manager</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Contact</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Clients</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Revenue</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Join Date</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {franchiseData.map((franchise) => (
                <tr key={franchise.id} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{franchise.name}</div>
                      <div className={`text-sm text-${COLORS.SECONDARY_TEXT} flex items-center mt-1`}>
                        <MapPin className="h-3 w-3 mr-1" />
                        {franchise.location}
                      </div>
                    </div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{franchise.manager}</td>
                  <td className="p-4">
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      <div>{franchise.email}</div>
                      <div>{franchise.phone}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Users className={`h-4 w-4 text-${COLORS.GRAY} mr-1`} />
                      <span className="font-medium">{franchise.clients.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600">{franchise.revenue}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      franchise.status === 'Active' ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}` :
                      franchise.status === 'Pending' ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}` :
                      'bg-red-50 text-red-700'
                    }`}>
                      {franchise.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{franchise.joinDate}</td>
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
            Showing 1-4 of 27 franchises
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

export default AdminManageFranchise;
