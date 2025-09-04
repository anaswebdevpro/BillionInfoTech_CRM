import React from 'react';
import { Image, Monitor, Smartphone, Calendar, Plus, Search, Filter, Eye, Edit, Trash2, Upload } from 'lucide-react';
import { COLORS } from '../../constants/colors';

const AdminPromotionalBanners: React.FC = () => {
  const bannerData = [
    { 
      id: 1, 
      title: 'Welcome Bonus Campaign', 
      position: 'Homepage Hero', 
      size: '1920x600', 
      type: 'Image',
      status: 'Active',
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      clicks: 15420,
      impressions: 89560
    },
    { 
      id: 2, 
      title: 'Trading Contest Banner', 
      position: 'Dashboard Sidebar', 
      size: '300x250', 
      type: 'Animated',
      status: 'Active',
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      clicks: 8920,
      impressions: 45230
    },
    { 
      id: 3, 
      title: 'Mobile App Promotion', 
      position: 'Mobile Header', 
      size: '375x150', 
      type: 'Image',
      status: 'Draft',
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      clicks: 0,
      impressions: 0
    },
    { 
      id: 4, 
      title: 'VIP Program Banner', 
      position: 'Footer', 
      size: '1200x200', 
      type: 'Video',
      status: 'Paused',
      startDate: '2024-02-01',
      endDate: '2024-05-31',
      clicks: 3450,
      impressions: 12890
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>Promotional Banners</h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage marketing banners and promotional content
            </p>
          </div>
          <button className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}>
            <Plus className="h-4 w-4" />
            Create New Banner
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <Image className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Banners</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>24</p>
            </div>
          </div>
        </div>
        
        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Monitor className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Impressions</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>147K</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className={`bg-${COLORS.YELLOW_BG} p-3 rounded-lg`}>
              <Smartphone className={`h-6 w-6 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>Total Clicks</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>27.8K</p>
            </div>
          </div>
        </div>

        <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}>
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Image className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>CTR Rate</p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>18.9%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Management Tools */}
      <div className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-${COLORS.GRAY} h-4 w-4`} />
              <input
                type="text"
                placeholder="Search banners..."
                className={`w-full pl-10 pr-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Positions</option>
              <option value="homepage">Homepage</option>
              <option value="dashboard">Dashboard</option>
              <option value="mobile">Mobile</option>
              <option value="footer">Footer</option>
            </select>
            <select className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}>
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
            <button className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-2`}>
              <Upload className="h-4 w-4" />
              Bulk Upload
            </button>
            <button className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-2`}>
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Banners Table */}
      <div className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Banner</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Position</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Size</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Type</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Performance</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Status</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Period</th>
                <th className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bannerData.map((banner) => (
                <tr key={banner.id} className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}>
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className={`w-16 h-10 bg-${COLORS.SECONDARY_BG} rounded border border-${COLORS.BORDER} flex items-center justify-center mr-3`}>
                        <Image className={`h-4 w-4 text-${COLORS.GRAY}`} />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{banner.title}</div>
                        <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>ID: BAN{banner.id.toString().padStart(3, '0')}</div>
                      </div>
                    </div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{banner.position}</td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>{banner.size}</td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      banner.type === 'Image' ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}` :
                      banner.type === 'Animated' ? 'bg-blue-50 text-blue-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {banner.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      <div>{banner.impressions.toLocaleString()} views</div>
                      <div>{banner.clicks.toLocaleString()} clicks</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      banner.status === 'Active' ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}` :
                      banner.status === 'Draft' ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}` :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {banner.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span className="text-xs">{banner.startDate} - {banner.endDate}</span>
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
            Showing 1-4 of 24 banners
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

export default AdminPromotionalBanners;
