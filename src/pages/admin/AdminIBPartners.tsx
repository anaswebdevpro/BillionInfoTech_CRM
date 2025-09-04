import React from 'react';
import { UserCheck, Users, DollarSign, TrendingUp, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { COLORS } from '../../constants/colors';

const AdminIBPartners: React.FC = () => {
  const ibPartnersData = [
    { 
      id: 1, 
      name: 'Global Trading Solutions', 
      contact: 'John Smith', 
      email: 'john@globaltrade.com', 
      phone: '+1234567890', 
      clients: 156, 
      commission: '$12,450', 
      status: 'Active',
      joinDate: '2023-06-15'
    },
    { 
      id: 2, 
      name: 'Prime Investment Partners', 
      contact: 'Sarah Johnson', 
      email: 'sarah@primeinvest.com', 
      phone: '+1234567891', 
      clients: 89, 
      commission: '$8,750', 
      status: 'Active',
      joinDate: '2023-08-22'
    },
    { 
      id: 3, 
      name: 'Elite Forex Network', 
      contact: 'Michael Brown', 
      email: 'michael@eliteforex.com', 
      phone: '+1234567892', 
      clients: 203, 
      commission: '$15,890', 
      status: 'Pending',
      joinDate: '2023-09-10'
    },
    { 
      id: 4, 
      name: 'Capital Bridges Inc', 
      contact: 'Emma Wilson', 
      email: 'emma@capitalbridges.com', 
      phone: '+1234567893', 
      clients: 67, 
      commission: '$5,230', 
      status: 'Inactive',
      joinDate: '2023-05-03'
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Manage IB Partners</h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage Introducing Broker partnerships and commissions
            </p>
          </div>
          <button className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}>
            <Plus className="h-4 w-4" />
            Add New IB Partner
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <UserCheck className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total IB Partners</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>247</p>
            </div>
          </div>
        </div>
        
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-blue-50 p-3 rounded-lg`}>
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Referred Clients</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>3,847</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.YELLOW_BG} p-3 rounded-lg`}>
              <DollarSign className={`h-6 w-6 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Commissions</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>$156,450</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Monthly Growth</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>+18%</p>
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
                placeholder="Search IB partners..."
                className={`w-full pl-10 pr-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Regions</option>
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="asia">Asia</option>
            </select>
            <button className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-2`}>
              <Filter className="h-4 w-4" />
              Advanced Filter
            </button>
          </div>
        </div>
      </div>

      {/* IB Partners Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Partner Name</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Contact Person</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Email</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Clients</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Commission</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Join Date</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ibPartnersData.map((partner) => (
                <tr key={partner.id} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{partner.name}</div>
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>{partner.phone}</div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{partner.contact}</td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{partner.email}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Users className={`h-4 w-4 text-${COLORS.GRAY} mr-1`} />
                      <span className="font-medium">{partner.clients}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-green-600">{partner.commission}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      partner.status === 'Active' ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}` :
                      partner.status === 'Pending' ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}` :
                      'bg-red-50 text-red-700'
                    }`}>
                      {partner.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{partner.joinDate}</td>
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
            Showing 1-4 of 247 partners
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

export default AdminIBPartners;
