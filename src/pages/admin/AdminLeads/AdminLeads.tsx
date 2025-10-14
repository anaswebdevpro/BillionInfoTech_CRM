import React from 'react';
import { Target, UserPlus, Phone, Mail, Plus, Search, Filter, Eye, Edit, Trash2, TrendingUp, Calendar } from 'lucide-react';
import { COLORS } from '../../../constants/colors';

const AdminLeads: React.FC = () => {
  const leadsData = [
    { 
      id: 1, 
      name: 'David Wilson', 
      email: 'david.wilson@email.com',
      phone: '+1 (555) 987-6543',
      source: 'Website Form',
      manager: 'John Smith',
      score: 85,
      status: 'Hot',
      created: '2024-03-15',
      lastContact: '2024-03-16'
    },
    { 
      id: 2, 
      name: 'Lisa Anderson', 
      email: 'lisa.anderson@email.com',
      phone: '+1 (555) 876-5432',
      source: 'Social Media',
      manager: 'Sarah Johnson',
      score: 72,
      status: 'Warm',
      created: '2024-03-14',
      lastContact: '2024-03-15'
    },
    { 
      id: 3, 
      name: 'Robert Garcia', 
      email: 'robert.garcia@email.com',
      phone: '+1 (555) 765-4321',
      source: 'Referral',
      manager: 'Michael Chen',
      score: 91,
      status: 'Hot',
      created: '2024-03-13',
      lastContact: '2024-03-16'
    },
    { 
      id: 4, 
      name: 'Jennifer Lee', 
      email: 'jennifer.lee@email.com',
      phone: '+1 (555) 654-3210',
      source: 'Advertisement',
      manager: 'Emma Rodriguez',
      score: 45,
      status: 'Cold',
      created: '2024-03-12',
      lastContact: '2024-03-13'
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return `text-${COLORS.YELLOW_TEXT} bg-${COLORS.YELLOW_BG}`;
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Leads Management</h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Track and manage sales leads and prospects
            </p>
          </div>
          <button className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}>
            <Plus className="h-4 w-4" />
            Add New Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <Target className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Leads</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>1,247</p>
            </div>
          </div>
        </div>
        
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-red-50 p-3 rounded-lg">
              <Target className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Hot Leads</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>342</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.YELLOW_BG} p-3 rounded-lg`}>
              <Target className={`h-6 w-6 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Warm Leads</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>578</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Conversion Rate</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>23.8%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Sources Chart */}
      <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>Lead Sources Distribution</h2>
          <select className={`px-3 py-1 border border-${COLORS.BORDER} rounded-lg text-sm focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className={`text-2xl font-bold text-${COLORS.PRIMARY}`}>456</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Website Form</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">321</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Social Media</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">287</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Referrals</div>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className={`text-2xl font-bold text-${COLORS.YELLOW_TEXT}`}>183</div>
            <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Advertisement</div>
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
                placeholder="Search leads..."
                className={`w-full pl-10 pr-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Sources</option>
              <option value="website">Website Form</option>
              <option value="social">Social Media</option>
              <option value="referral">Referral</option>
              <option value="ad">Advertisement</option>
            </select>
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Status</option>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </select>
            <button className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-2`}>
              <Filter className="h-4 w-4" />
              Advanced Filter
            </button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Lead</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Contact</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Source</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Manager</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Score</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Last Contact</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leadsData.map((lead) => (
                <tr key={lead.id} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-full flex items-center justify-center mr-3`}>
                        <UserPlus className={`h-5 w-5 text-${COLORS.PRIMARY}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className={`text-sm text-${COLORS.SECONDARY_TEXT} flex items-center mt-1`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {lead.created}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      <div className="flex items-center mb-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {lead.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      lead.source === 'Website Form' ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}` :
                      lead.source === 'Social Media' ? 'bg-blue-50 text-blue-700' :
                      lead.source === 'Referral' ? 'bg-purple-50 text-purple-700' :
                      'bg-orange-50 text-orange-700'
                    }`}>
                      {lead.source}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{lead.manager}</td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      lead.status === 'Hot' ? 'bg-red-50 text-red-700' :
                      lead.status === 'Warm' ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}` :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{lead.lastContact}</td>
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
            Showing 1-4 of 1,247 leads
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

export default AdminLeads;
