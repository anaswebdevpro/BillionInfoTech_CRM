import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Download,
  Calendar,
  Filter,
} from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const AdminFinancial: React.FC = () => {
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
  const financialData = [
    {
      id: 1,
      type: "Deposit",
      amount: "$5,000",
      account: "ACC001",
      status: "Completed",
      date: "2024-03-15",
    },
    {
      id: 2,
      type: "Withdrawal",
      amount: "$2,500",
      account: "ACC002",
      status: "Pending",
      date: "2024-03-14",
    },
    {
      id: 3,
      type: "Transfer",
      amount: "$1,200",
      account: "ACC003",
      status: "Completed",
      date: "2024-03-13",
    },
    {
      id: 4,
      type: "Commission",
      amount: "$850",
      account: "ACC004",
      status: "Completed",
      date: "2024-03-12",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              Financial Management
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Monitor and manage all financial transactions and reports
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

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Total Revenue
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                $2,847,650
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last month
              </p>
            </div>
            <div className={`bg-${COLORS.PRIMARY_BG_LIGHT} p-3 rounded-lg`}>
              <DollarSign className={`h-6 w-6 text-${COLORS.PRIMARY}`} />
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Total Deposits
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                $1,234,567
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% from last month
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Total Withdrawals
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                $987,654
              </p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1" />
                -3.1% from last month
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm`}>
                Net Profit
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                $456,789
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15.7% from last month
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Financial Chart Section */}
      <div
        className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
            Financial Overview
          </h2>
          <div className="flex gap-2">
            <select
              className={`px-3 py-1 border border-${COLORS.BORDER} rounded-lg text-sm focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
        <div
          className={`h-64 bg-${COLORS.SECONDARY_BG} rounded-lg flex items-center justify-center`}
        >
          <div className={`text-${COLORS.SECONDARY_TEXT} text-center`}>
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Financial Chart Placeholder</p>
            <p className="text-sm">Chart component would be integrated here</p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div
        className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
              Recent Financial Transactions
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
                  Type
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Amount
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Account
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
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {financialData.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      TXN{transaction.id.toString().padStart(6, "0")}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.type === "Deposit"
                          ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                          : transaction.type === "Withdrawal"
                          ? "bg-red-50 text-red-700"
                          : transaction.type === "Transfer"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>
                    {transaction.amount}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {transaction.account}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        transaction.status === "Completed"
                          ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                          : transaction.status === "Pending"
                          ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}`
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {transaction.date}
                  </td>
                  <td className="p-4">
                    <button
                      className={`text-${COLORS.PRIMARY} hover:text-green-700 transition-colors text-sm font-medium`}
                    >
                      View Details
                    </button>
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
            Showing 1-4 of 247 transactions
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

export default AdminFinancial;
