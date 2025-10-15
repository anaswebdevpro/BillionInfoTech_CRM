import React, { useState } from "react";
import { Download, Calendar, Filter, Users } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const ClientWiseIBCommission: React.FC = () => {
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <ShimmerLoader variant="dashboard" width={1000} height={600} />
      </div>
    );
  }

  const clientCommissions = [
    {
      id: 1,
      clientName: "David Chen",
      clientEmail: "david@example.com",
      ibName: "Alex Johnson",
      ibEmail: "alex@ib.com",
      trades: 45,
      volume: "$245,000",
      commission: "$6,125",
      date: "2024-03-15",
    },
    {
      id: 2,
      clientName: "Emma Watson",
      clientEmail: "emma@example.com",
      ibName: "Sarah Williams",
      ibEmail: "sarah@ib.com",
      trades: 32,
      volume: "$178,000",
      commission: "$3,560",
      date: "2024-03-15",
    },
    {
      id: 3,
      clientName: "Ryan Cooper",
      clientEmail: "ryan@example.com",
      ibName: "Michael Brown",
      ibEmail: "michael@ib.com",
      trades: 58,
      volume: "$312,000",
      commission: "$9,360",
      date: "2024-03-15",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              Client Wise IB Commission
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Detailed commission breakdown by individual clients
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
                Total Clients
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                {clientCommissions.length}
              </p>
            </div>
            <Users className={`h-8 w-8 text-${COLORS.PRIMARY}`} />
          </div>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Trades
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            135
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Volume
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $735,000
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Commission
          </p>
          <p className={`text-2xl font-semibold text-green-600`}>$19,045</p>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`bg-${COLORS.WHITE} p-4 rounded-lg border border-${COLORS.BORDER} mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}
            >
              Select IB
            </label>
            <select
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="">All IBs</option>
              <option value="ib1">Alex Johnson</option>
              <option value="ib2">Sarah Williams</option>
              <option value="ib3">Michael Brown</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}
            >
              Select Client
            </label>
            <select
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="">All Clients</option>
              <option value="client1">David Chen</option>
              <option value="client2">Emma Watson</option>
              <option value="client3">Ryan Cooper</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}
            >
              Date Range
            </label>
            <input
              type="date"
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
              Client-wise Commission Breakdown
            </h2>
            <div className="flex gap-2">
              <button
                className={`px-3 py-1 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-1 text-sm`}
              >
                <Calendar className="h-3 w-3" />
                Date Range
              </button>
              <button
                className={`px-3 py-1 border border-${COLORS.BORDER} rounded-lg hover:bg-${COLORS.SECONDARY_BG} transition-colors flex items-center gap-1 text-sm`}
              >
                <Filter className="h-3 w-3" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b border-${COLORS.BORDER}`}>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Client Details
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  IB Details
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Trades
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Volume
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Commission
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {clientCommissions.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {item.clientName}
                    </div>
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      {item.clientEmail}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {item.ibName}
                    </div>
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      {item.ibEmail}
                    </div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {item.trades}
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>
                    {item.volume}
                  </td>
                  <td className={`p-4 font-semibold text-green-600`}>
                    {item.commission}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {item.date}
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
            Showing 1-3 of 78 records
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
              2
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

export default ClientWiseIBCommission;
