import React, { useState } from "react";
import { Download, Calendar, Filter, Percent } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const IBCommission: React.FC = () => {
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

  const commissions = [
    {
      id: 1,
      ibName: "Alex Johnson",
      email: "alex@ib.com",
      totalTrades: 245,
      totalVolume: "$1,245,000",
      commissionRate: "2.5%",
      commissionEarned: "$31,125",
      status: "Active",
      date: "2024-03-15",
    },
    {
      id: 2,
      ibName: "Sarah Williams",
      email: "sarah@ib.com",
      totalTrades: 189,
      totalVolume: "$892,000",
      commissionRate: "2.0%",
      commissionEarned: "$17,840",
      status: "Active",
      date: "2024-03-15",
    },
    {
      id: 3,
      ibName: "Michael Brown",
      email: "michael@ib.com",
      totalTrades: 312,
      totalVolume: "$1,567,000",
      commissionRate: "3.0%",
      commissionEarned: "$47,010",
      status: "Active",
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
              IB Commission
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Introducing Broker commission management and tracking
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
                Total IBs
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                {commissions.length}
              </p>
            </div>
            <Percent className={`h-8 w-8 text-${COLORS.PRIMARY}`} />
          </div>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Volume
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $3,704,000
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Commission Paid
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $95,975
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Avg. Commission Rate
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            2.5%
          </p>
        </div>
      </div>

      {/* Table */}
      <div
        className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
              IB Commission Details
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
                  IB Details
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Total Trades
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Total Volume
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Commission Rate
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Commission Earned
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Status
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {commissions.map((commission) => (
                <tr
                  key={commission.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {commission.ibName}
                    </div>
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      {commission.email}
                    </div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {commission.totalTrades}
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>
                    {commission.totalVolume}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {commission.commissionRate}
                  </td>
                  <td className={`p-4 font-semibold text-green-600`}>
                    {commission.commissionEarned}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`}
                    >
                      {commission.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {commission.date}
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
            Showing 1-3 of 45 IBs
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

export default IBCommission;
