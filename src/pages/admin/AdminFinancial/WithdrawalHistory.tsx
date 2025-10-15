import React, { useState } from "react";
import { Download, Calendar, Filter, TrendingDown } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const WithdrawalHistory: React.FC = () => {
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

  const withdrawalData = [
    {
      id: 1,
      transactionId: "WDR001230",
      userName: "Robert Taylor",
      email: "robert@example.com",
      amount: "$4,500",
      method: "Bank Transfer",
      status: "Completed",
      date: "2024-03-14 03:20 PM",
    },
    {
      id: 2,
      transactionId: "WDR001231",
      userName: "Patricia Moore",
      email: "patricia@example.com",
      amount: "$6,200",
      method: "USDT TRC20",
      status: "Completed",
      date: "2024-03-13 12:45 PM",
    },
    {
      id: 3,
      transactionId: "WDR001232",
      userName: "William Clark",
      email: "william@example.com",
      amount: "$3,800",
      method: "Bank Transfer",
      status: "Completed",
      date: "2024-03-12 10:30 AM",
    },
    {
      id: 4,
      transactionId: "WDR001233",
      userName: "Jennifer Lewis",
      email: "jennifer@example.com",
      amount: "$2,100",
      method: "USDT BEP20",
      status: "Rejected",
      date: "2024-03-11 02:15 PM",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              Withdrawal History
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Complete withdrawal transaction history
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
            Total Withdrawals (30 days)
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            892
          </p>
          <p className="text-sm text-red-600 flex items-center mt-1">
            <TrendingDown className="h-3 w-3 mr-1" />
            -5.2% from last month
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Amount (30 days)
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $2,145,600
          </p>
          <p className="text-sm text-red-600 flex items-center mt-1">
            <TrendingDown className="h-3 w-3 mr-1" />
            -3.1% from last month
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Average Withdrawal
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $2,405
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Success Rate
          </p>
          <p className={`text-2xl font-semibold text-green-600`}>96.8%</p>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div
        className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}
      >
        <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY} mb-4`}>
          Withdrawal Trends
        </h2>
        <div
          className={`h-64 bg-${COLORS.SECONDARY_BG} rounded-lg flex items-center justify-center`}
        >
          <div className={`text-${COLORS.SECONDARY_TEXT} text-center`}>
            <TrendingDown className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Withdrawal Trend Chart</p>
            <p className="text-sm">Chart visualization would appear here</p>
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
              Withdrawal Transactions
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
                  Transaction ID
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  User Details
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Amount
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Method
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Date & Time
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {withdrawalData.map((withdrawal) => (
                <tr
                  key={withdrawal.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {withdrawal.transactionId}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {withdrawal.userName}
                    </div>
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      {withdrawal.email}
                    </div>
                  </td>
                  <td className={`p-4 font-semibold text-red-600`}>
                    {withdrawal.amount}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {withdrawal.method}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {withdrawal.date}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        withdrawal.status === "Completed"
                          ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {withdrawal.status}
                    </span>
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
            Showing 1-4 of 120 withdrawals
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
              3
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

export default WithdrawalHistory;
