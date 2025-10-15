import React, { useState } from "react";
import { Download, Calendar, Filter, CreditCard } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const GatewayTxns: React.FC = () => {
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

  const gatewayTransactions = [
    {
      id: 1,
      transactionId: "GTW001245",
      gateway: "Bank Transfer",
      userName: "John Smith",
      amount: "$5,000",
      fee: "$25",
      netAmount: "$4,975",
      status: "Success",
      date: "2024-03-15 10:30 AM",
    },
    {
      id: 2,
      transactionId: "GTW001246",
      gateway: "USDT TRC20",
      userName: "Emily Johnson",
      amount: "$10,000",
      fee: "$10",
      netAmount: "$9,990",
      status: "Success",
      date: "2024-03-15 09:15 AM",
    },
    {
      id: 3,
      transactionId: "GTW001247",
      gateway: "USDT BEP20",
      userName: "Michael Brown",
      amount: "$7,500",
      fee: "$15",
      netAmount: "$7,485",
      status: "Pending",
      date: "2024-03-14 05:45 PM",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              Gateway Transactions
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Monitor all payment gateway transactions
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
                Total Transactions
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                {gatewayTransactions.length}
              </p>
            </div>
            <CreditCard className={`h-8 w-8 text-${COLORS.PRIMARY}`} />
          </div>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Volume
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $22,500
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Fees
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $50
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Success Rate
          </p>
          <p className={`text-2xl font-semibold text-green-600`}>66.7%</p>
        </div>
      </div>

      {/* Gateway Breakdown */}
      <div
        className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER} mb-6`}
      >
        <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY} mb-4`}>
          Gateway Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900 font-medium">Bank Transfer</p>
            <p className="text-2xl font-bold text-blue-600">1</p>
            <p className="text-sm text-blue-600">$5,000</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-900 font-medium">USDT TRC20</p>
            <p className="text-2xl font-bold text-green-600">1</p>
            <p className="text-sm text-green-600">$10,000</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-900 font-medium">USDT BEP20</p>
            <p className="text-2xl font-bold text-purple-600">1</p>
            <p className="text-sm text-purple-600">$7,500</p>
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
              Gateway Transaction List
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
                  Gateway
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  User
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Amount
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Fee
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Net Amount
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Status
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Date & Time
                </th>
              </tr>
            </thead>
            <tbody>
              {gatewayTransactions.map((txn) => (
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
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">
                      {txn.gateway}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {txn.userName}
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>
                    {txn.amount}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {txn.fee}
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>
                    {txn.netAmount}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        txn.status === "Success"
                          ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                          : `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}`
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {txn.date}
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

export default GatewayTxns;
