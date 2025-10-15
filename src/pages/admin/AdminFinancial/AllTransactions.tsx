import React, { useState } from "react";
import { Download, Calendar, Filter, List } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const AllTransactions: React.FC = () => {
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

  const transactions = [
    {
      id: 1,
      transactionId: "TXN001250",
      type: "Deposit",
      userName: "John Doe",
      email: "john@example.com",
      amount: "$5,000",
      method: "Bank Transfer",
      status: "Completed",
      date: "2024-03-15 10:30 AM",
    },
    {
      id: 2,
      transactionId: "TXN001251",
      type: "Withdrawal",
      userName: "Sarah Wilson",
      email: "sarah@example.com",
      amount: "$3,000",
      method: "USDT TRC20",
      status: "Pending",
      date: "2024-03-15 09:45 AM",
    },
    {
      id: 3,
      transactionId: "TXN001252",
      type: "Transfer",
      userName: "Mark Thompson",
      email: "mark@example.com",
      amount: "$1,500",
      method: "Internal",
      status: "Completed",
      date: "2024-03-14 04:20 PM",
    },
    {
      id: 4,
      transactionId: "TXN001253",
      type: "Commission",
      userName: "Alex Johnson",
      email: "alex@ib.com",
      amount: "$850",
      method: "IB Commission",
      status: "Completed",
      date: "2024-03-14 02:15 PM",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              All Transactions
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Complete overview of all financial transactions
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className={`bg-${COLORS.PRIMARY} text-${COLORS.WHITE} px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2`}
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
                All Transactions
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                {transactions.length}
              </p>
            </div>
            <List className={`h-8 w-8 text-${COLORS.PRIMARY}`} />
          </div>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Deposits
          </p>
          <p className={`text-2xl font-semibold text-blue-600`}>1</p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Withdrawals
          </p>
          <p className={`text-2xl font-semibold text-red-600`}>1</p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Transfers
          </p>
          <p className={`text-2xl font-semibold text-purple-600`}>1</p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Commissions
          </p>
          <p className={`text-2xl font-semibold text-green-600`}>1</p>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`bg-${COLORS.WHITE} p-4 rounded-lg border border-${COLORS.BORDER} mb-6`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label
              className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}
            >
              Transaction Type
            </label>
            <select
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
              <option value="commission">Commission</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}
            >
              Status
            </label>
            <select
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}
            >
              From Date
            </label>
            <input
              type="date"
              className={`w-full px-3 py-2 border border-${COLORS.BORDER} rounded-lg focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-transparent`}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium text-${COLORS.SECONDARY_TEXT} mb-2`}
            >
              To Date
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
              Transaction List
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
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {txn.transactionId}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        txn.type === "Deposit"
                          ? "bg-blue-50 text-blue-700"
                          : txn.type === "Withdrawal"
                          ? "bg-red-50 text-red-700"
                          : txn.type === "Transfer"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {txn.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {txn.userName}
                    </div>
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      {txn.email}
                    </div>
                  </td>
                  <td
                    className={`p-4 font-semibold ${
                      txn.type === "Withdrawal"
                        ? "text-red-600"
                        : `text-${COLORS.SECONDARY}`
                    }`}
                  >
                    {txn.amount}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {txn.method}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {txn.date}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        txn.status === "Completed"
                          ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                          : txn.status === "Pending"
                          ? `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}`
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {txn.status}
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
            Showing 1-4 of 425 transactions
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

export default AllTransactions;
