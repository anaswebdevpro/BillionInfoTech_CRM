import React, { useState } from "react";
import { Download, Calendar, Filter, TrendingUp } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const DepositHistory: React.FC = () => {
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

  const historyData = [
    {
      id: 1,
      date: "2024-03-15",
      totalDeposits: 45,
      totalAmount: "$125,000",
      avgDeposit: "$2,777",
      status: "up",
    },
    {
      id: 2,
      date: "2024-03-14",
      totalDeposits: 38,
      totalAmount: "$98,500",
      avgDeposit: "$2,592",
      status: "up",
    },
    {
      id: 3,
      date: "2024-03-13",
      totalDeposits: 52,
      totalAmount: "$142,300",
      avgDeposit: "$2,736",
      status: "down",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              Deposit History
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Historical deposit data and analytics
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Deposits (30 days)
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            1,245
          </p>
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +12.5% from last month
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Amount (30 days)
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $3,245,800
          </p>
          <p className="text-sm text-green-600 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +8.3% from last month
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Average Deposit
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $2,606
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Success Rate
          </p>
          <p className={`text-2xl font-semibold text-green-600`}>98.5%</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div
        className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}
      >
        <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY} mb-4`}>
          Deposit Trends
        </h2>
        <div
          className={`h-64 bg-${COLORS.SECONDARY_BG} rounded-lg flex items-center justify-center`}
        >
          <div className={`text-${COLORS.SECONDARY_TEXT} text-center`}>
            <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Deposit Trend Chart</p>
            <p className="text-sm">Chart visualization would appear here</p>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div
        className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
              Daily Deposit Summary
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
                  Date
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Total Deposits
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Total Amount
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Average Deposit
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((record) => (
                <tr
                  key={record.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className={`p-4 font-medium text-${COLORS.SECONDARY}`}>
                    {record.date}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {record.totalDeposits}
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>
                    {record.totalAmount}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {record.avgDeposit}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                        record.status === "up"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {record.status === "up" ? "↑" : "↓"}{" "}
                      {record.status === "up" ? "Increase" : "Decrease"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DepositHistory;
