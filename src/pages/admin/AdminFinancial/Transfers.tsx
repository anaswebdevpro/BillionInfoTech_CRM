import React, { useState } from "react";
import { Download, Calendar, Filter, ArrowLeftRight } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const Transfers: React.FC = () => {
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

  const transfers = [
    {
      id: 1,
      transactionId: "TRF001234",
      userName: "Mark Thompson",
      email: "mark@example.com",
      fromAccount: "ACC001",
      toAccount: "ACC002",
      amount: "$1,500",
      status: "Completed",
      date: "2024-03-15 09:45 AM",
    },
    {
      id: 2,
      transactionId: "TRF001235",
      userName: "Nancy White",
      email: "nancy@example.com",
      fromAccount: "ACC003",
      toAccount: "ACC004",
      amount: "$2,800",
      status: "Completed",
      date: "2024-03-14 02:30 PM",
    },
    {
      id: 3,
      transactionId: "TRF001236",
      userName: "Kevin Harris",
      email: "kevin@example.com",
      fromAccount: "ACC005",
      toAccount: "ACC006",
      amount: "$950",
      status: "Pending",
      date: "2024-03-13 11:20 AM",
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold text-${COLORS.SECONDARY}`}>
              Internal Transfers
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Monitor all internal account transfers
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
                Total Transfers
              </p>
              <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
                {transfers.length}
              </p>
            </div>
            <ArrowLeftRight className={`h-8 w-8 text-${COLORS.PRIMARY}`} />
          </div>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Volume
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $5,250
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Completed
          </p>
          <p className={`text-2xl font-semibold text-green-600`}>2</p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Pending
          </p>
          <p className={`text-2xl font-semibold text-yellow-600`}>1</p>
        </div>
      </div>

      {/* Table */}
      <div
        className={`bg-${COLORS.WHITE} rounded-lg border border-${COLORS.BORDER}`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-semibold text-${COLORS.SECONDARY}`}>
              Transfer Transactions
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
                  From Account
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  To Account
                </th>
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Amount
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
              {transfers.map((transfer) => (
                <tr
                  key={transfer.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {transfer.transactionId}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {transfer.userName}
                    </div>
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      {transfer.email}
                    </div>
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {transfer.fromAccount}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {transfer.toAccount}
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>
                    {transfer.amount}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {transfer.date}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        transfer.status === "Completed"
                          ? `bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT}`
                          : `bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}`
                      }`}
                    >
                      {transfer.status}
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
            Showing 1-3 of 85 transfers
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

export default Transfers;
