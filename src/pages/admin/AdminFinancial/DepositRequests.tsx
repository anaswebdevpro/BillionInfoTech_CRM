import React, { useState } from "react";
import { Download, Calendar, Filter, Check, X, Eye } from "lucide-react";
import { COLORS } from "../../../constants/colors";
import { ShimmerLoader } from "../../../components/ui";

const DepositRequests: React.FC = () => {
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

  const depositRequests = [
    {
      id: 1,
      transactionId: "DEP001234",
      userName: "John Doe",
      email: "john@example.com",
      amount: "$5,000",
      method: "Bank Transfer",
      status: "Pending",
      date: "2024-03-15 10:30 AM",
    },
    {
      id: 2,
      transactionId: "DEP001235",
      userName: "Jane Smith",
      email: "jane@example.com",
      amount: "$10,000",
      method: "USDT TRC20",
      status: "Pending",
      date: "2024-03-15 09:15 AM",
    },
    {
      id: 3,
      transactionId: "DEP001236",
      userName: "Mike Johnson",
      email: "mike@example.com",
      amount: "$3,500",
      method: "USDT BEP20",
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
              Deposit Requests
            </h1>
            <p className={`text-${COLORS.SECONDARY_TEXT} mt-1`}>
              Review and approve pending deposit requests
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Pending Requests
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            {depositRequests.length}
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Total Amount
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            $18,500
          </p>
        </div>
        <div
          className={`bg-${COLORS.WHITE} p-6 rounded-lg border border-${COLORS.BORDER}`}
        >
          <p className={`text-${COLORS.SECONDARY_TEXT} text-sm mb-1`}>
            Avg. Processing Time
          </p>
          <p className={`text-2xl font-semibold text-${COLORS.SECONDARY}`}>
            2.5 hrs
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
              Pending Deposit Requests
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
                <th
                  className={`text-left p-4 font-semibold text-${COLORS.SECONDARY_TEXT}`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {depositRequests.map((request) => (
                <tr
                  key={request.id}
                  className={`border-b border-${COLORS.BORDER} hover:bg-${COLORS.SECONDARY_BG} transition-colors`}
                >
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {request.transactionId}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">
                      {request.userName}
                    </div>
                    <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>
                      {request.email}
                    </div>
                  </td>
                  <td className={`p-4 font-semibold text-${COLORS.SECONDARY}`}>
                    {request.amount}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {request.method}
                  </td>
                  <td className={`p-4 text-${COLORS.SECONDARY_TEXT}`}>
                    {request.date}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full bg-${COLORS.YELLOW_BG} text-${COLORS.YELLOW_TEXT}`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        className={`p-1 text-${COLORS.PRIMARY} hover:bg-${COLORS.PRIMARY_BG_LIGHT} rounded transition-colors`}
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Reject"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
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

export default DepositRequests;
