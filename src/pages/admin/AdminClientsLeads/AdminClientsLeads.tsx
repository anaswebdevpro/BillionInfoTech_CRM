import React, { useState } from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const AdminClientsLeads: React.FC = () => {
  const [loading, setLoading] = useState(true);

  // Simulate loading for demonstration
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <ShimmerLoader variant="dashboard" width={1000} height={600} />
      </div>
    );
  }
  const clientsData = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      status: "Active",
      type: "Client",
      joined: "2024-01-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891",
      status: "Pending",
      type: "Lead",
      joined: "2024-02-10",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1234567892",
      status: "Active",
      type: "Client",
      joined: "2024-01-20",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "+1234567893",
      status: "Inactive",
      type: "Lead",
      joined: "2024-02-05",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              Clients & Leads
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Manage your clients and potential leads
            </p>
          </div>
          <button
            className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}
          >
            <UserPlus className="h-4 w-4" />
            Add New Client
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <Users className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Total Clients
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                2,847
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className={`bg-blue-50 p-3 rounded-lg`}>
              <UserPlus className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                New Leads
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                1,234
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className={`bg-${COLORS.YELLOW_BG} p-3 rounded-lg`}>
              <Users className={`h-6 w-6 text-${COLORS.YELLOW_TEXT}`} />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Active Clients
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                2,156
              </p>
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center">
            <div className="bg-purple-50 p-3 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Conversion Rate
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                68%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-${COLORS.GRAY} h-4 w-4`}
              />
              <input
                type="text"
                placeholder="Search clients and leads..."
                className={`w-full pl-10 pr-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="">All Types</option>
              <option value="client">Clients</option>
              <option value="lead">Leads</option>
            </select>
            <select
              className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              className={`px-4 py-2 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-2`}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              className={`px-4 py-2 bg-${COLORS.PRIMARY} text-${COLORS.WHITE} rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div
        className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Name
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Email
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Phone
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Type
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Status
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Joined
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {clientsData.map((client) => (
                <tr
                  key={client.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {client.name}
                    </div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {client.email}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {client.phone}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        client.type === "Client"
                          ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {client.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        client.status === "Active"
                          ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                          : client.status === "Pending"
                          ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}`
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {client.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {client.joined}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        className={`text-${COLORS.PRIMARY} hover:text-green-700 transition-colors`}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className={`text-blue-600 hover:text-blue-700 transition-colors`}
                      >
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
        <div
          className={`px-6 py-4 border-t border-${COLORS.BORDER} flex items-center justify-between`}
        >
          <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
            Showing 1-4 of 4 results
          </div>
          <div className="flex space-x-1">
            <button
              className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-${COLORS.SECONDARY_TEXT} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
            >
              Previous
            </button>
            <button
              className={`px-3 py-1 bg-${COLORS.PRIMARY} text-${COLORS.WHITE} rounded`}
            >
              1
            </button>
            <button
              className={`px-3 py-1 border border-${COLORS.BORDER} rounded text-${COLORS.SECONDARY_TEXT} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClientsLeads;
