import useAdminAuth from "@/Hook/useAdminAuth";
import { apiRequest } from "@/services";
import { ADMIN_ALL_TRADING_ACCOUNTS } from "../../../../api/api-variable";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState, useCallback } from "react";
import { useDebounce } from "@/Hook/useDebounce";
import { Card, COLORS, ShimmerLoader } from "@/index";
import { Eye, Edit, Trash2 } from "lucide-react";
import {
  handleCopyToClipboard,
  handleExportToCSV,
  handleExportToExcel,
  handlePrintTable,
  type ExportColumn,
} from "@/utils/exportUtils";

// Types
interface TradingAccount {
  sr_no: number;
  account_number: string;
  client_name: string;
  user_id: number;
  email: string;
  group: string;
  leverage: string;
  balance?: string | number;
  created_on: string;
}

interface ApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: TradingAccount[];
}

const AllTradingAccountTable = () => {
  const { adminToken } = useAdminAuth();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  // Fetch KYC data from API
  const fetchData = useCallback(
    (
      page = currentPage,
      search = debouncedSearchValue,
      length = entriesPerPage
    ) => {
      setIsLoading(true);
      setError(null);

      const requestBody = { start: page * length, length, search };

      apiRequest({
        endpoint: ADMIN_ALL_TRADING_ACCOUNTS,
        method: "POST",
        headers: { Authorization: `Bearer ${adminToken}` },
        data: requestBody,
      })
        .then((response: unknown) => {
          const responseData = response as {
            response?: boolean;
            message?: string;
          };
          if (responseData.response === false) {
            enqueueSnackbar(
              responseData.message || "Failed to fetch KYC data!",
              { variant: "error" }
            );
          } else {
            setData(response as ApiResponse);
          }
        })
        .catch((error) => {
          const errorMessage =
            error?.message ||
            error?.response?.data?.message ||
            "Failed to fetch KYC data";
          enqueueSnackbar(errorMessage, { variant: "error" });
        })
        .finally(() => setIsLoading(false));
    },
    [adminToken, currentPage, debouncedSearchValue, entriesPerPage]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pagination handler
  const handlePagination = (direction: "next" | "prev") => {
    const newPage =
      direction === "next" ? currentPage + 1 : Math.max(0, currentPage - 1);
    setCurrentPage(newPage);
    fetchData(newPage, searchValue, entriesPerPage);
  };

  // Entries per page handler
  const handleEntriesPerPageChange = (newEntriesPerPage: number) => {
    setEntriesPerPage(newEntriesPerPage);
    setCurrentPage(0);
    fetchData(0, searchValue, newEntriesPerPage);
  };

  // Action handler for View/Edit/Delete
  const handleAction = (action: string, record: TradingAccount) => {
    console.log(`${action} action for Trading Account:`, record);
    enqueueSnackbar(`${action} action for ${record.client_name}`, {
      variant: "info",
    });
  };

  // Export configuration
  const exportColumns: ExportColumn[] = [
    { header: "#", key: "serial" },
    { header: "Account", key: "account_number" },
    { header: "Client ID", key: "user_id" },
    { header: "Name", key: "client_name" },
    { header: "Email", key: "email" },
    { header: "Group", key: "group" },
    { header: "Leverage", key: "leverage" },
    { header: "Balance", key: "balance" },
    { header: "Opened On", key: "created_on" },
  ];

  // Prepare export data
  const getExportData = () => {
    if (!data || data.data.length === 0) return [];
    return data.data.map((record, index) => ({
      serial: currentPage * entriesPerPage + index + 1,
      ...record,
    }));
  };

  // Export handlers
  const handleCopy = () =>
    handleCopyToClipboard({ columns: exportColumns, data: getExportData() });
  const handleCSV = () =>
    handleExportToCSV({
      filename: "trading_accounts",
      columns: exportColumns,
      data: getExportData(),
    });
  const handleExcel = () =>
    handleExportToExcel({
      filename: "trading_accounts",
      columns: exportColumns,
      data: getExportData(),
    });
  const handlePrint = () =>
    handlePrintTable({
      title: "Trading Accounts Report",
      columns: exportColumns,
      data: getExportData(),
    });

  // Status badge styling
  // const getStatusColor = (status: string) => {
  //   const statusLower = status.toLowerCase();
  //   if (statusLower === "declined") return "bg-red-100 text-red-800";
  //   if (statusLower === "verified") return "bg-green-100 text-green-800";
  //   return "bg-yellow-100 text-yellow-800";
  // };

  // Export button config
  const exportButtons = [
    { label: "Copy", handler: handleCopy },
    { label: "CSV", handler: handleCSV },
    { label: "Excel", handler: handleExcel },
    { label: "Print", handler: handlePrint },
  ];

  return (
    <div className="w-full">
      <Card className="p-4 sm:p-6 w-full">
        {/* Search and Export Section */}
        <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
              {/* Search Input */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div
                  className={`p-1.5 sm:p-2 bg-${COLORS.PRIMARY_BG_LIGHT} rounded-lg flex-shrink-0`}
                >
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-${COLORS.PRIMARY}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Search trading accounts..."
                  className={`border border-${COLORS.GRAY_BORDER} rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm w-full focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-${COLORS.PRIMARY} transition-all duration-200`}
                />
              </div>

              {/* Export Buttons */}
              <div className="flex items-center gap-2">
                {exportButtons.map(({ label, handler }) => (
                  <button
                    key={label}
                    onClick={handler}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-${COLORS.BORDER} bg-${COLORS.PRIMARY} text-${COLORS.WHITE} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-black transition-all duration-200`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <ShimmerLoader variant="table" width={1200} height={400} />
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          </div>
        ) : !data || data.data.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500 text-sm sm:text-base">
              No trading accounts found
            </p>
          </div>
        ) : (
          <div className="overflow-auto max-h-[500px] sm:max-h-[600px] border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  {[
                    "#",
                    "Account",
                    "Client ID",
                    "Name",
                    "Email",
                    "Group",
                    "Leverage",
                    "Balance",
                    "Opened On",
                    "Action",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.data.map((record, index) => (
                  <tr
                    key={record.sr_no}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                      {currentPage * entriesPerPage + index + 1}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                      {record.account_number}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.user_id}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                      {record.client_name}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-900">
                      <div className="max-w-[150px] sm:max-w-none truncate">
                        {record.email}
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.group}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.leverage}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.balance || "-"}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                      {record.created_on}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {[
                          { Icon: Eye, action: "View", color: "green" },
                          { Icon: Edit, action: "Edit", color: "blue" },
                          { Icon: Trash2, action: "Delete", color: "red" },
                        ].map(({ Icon, action, color }) => (
                          <button
                            key={action}
                            onClick={() => handleAction(action, record)}
                            className={`text-${color}-600 hover:text-${color}-700 transition-colors`}
                            title={action}
                          >
                            <Icon className="h-4 w-4" />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      <Card
        className={`mt-2 sm:p-1 bg-${COLORS.WHITE} border border-${COLORS.BORDER} ${COLORS.SHADOW} rounded-xl`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2">
          {/* Entries Per Page */}
          <div className="flex items-center gap-2 sm:gap-3">
            <label
              className={`text-xs sm:text-sm font-medium text-${COLORS.SECONDARY}`}
            >
              Show:
            </label>
            <select
              value={entriesPerPage}
              onChange={(e) =>
                handleEntriesPerPageChange(Number(e.target.value))
              }
              className={`border border-${COLORS.GRAY_BORDER} rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-${COLORS.PRIMARY} transition-all duration-200`}
            >
              {[10, 25, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
            <span
              className={`text-xs sm:text-sm text-${COLORS.SECONDARY_TEXT}`}
            >
              entries
            </span>
          </div>

          {/* Pagination Navigation */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => handlePagination("prev")}
              disabled={currentPage === 0}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                currentPage === 0
                  ? `bg-${COLORS.GRAY_LIGHT} text-${COLORS.GRAY} cursor-not-allowed`
                  : `bg-${COLORS.WHITE} text-${COLORS.SECONDARY} border border-${COLORS.BORDER} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-${COLORS.PRIMARY} hover:border-${COLORS.PRIMARY}`
              }`}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            <div
              className={`px-2 sm:px-3 py-1 bg-${COLORS.PRIMARY_BG_LIGHT} text-${COLORS.PRIMARY_TEXT} rounded-lg font-medium text-xs sm:text-sm whitespace-nowrap`}
            >
              Page {currentPage + 1} of{" "}
              {Math.ceil((data?.recordsFiltered || 0) / entriesPerPage)}
            </div>

            <button
              onClick={() => handlePagination("next")}
              disabled={
                !data ||
                (currentPage + 1) * entriesPerPage >= data.recordsFiltered
              }
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                !data ||
                (currentPage + 1) * entriesPerPage >= data.recordsFiltered
                  ? `bg-${COLORS.GRAY_LIGHT} text-${COLORS.GRAY} cursor-not-allowed`
                  : `bg-${COLORS.WHITE} text-${COLORS.SECONDARY} border border-${COLORS.BORDER} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-${COLORS.PRIMARY} hover:border-${COLORS.PRIMARY}`
              }`}
            >
              Next
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Page Info */}
          <div
            className={`text-xs sm:text-sm text-${COLORS.SECONDARY_TEXT} text-center lg:text-right whitespace-nowrap`}
          >
            Showing {currentPage * entriesPerPage + 1} to{" "}
            {Math.min(
              (currentPage + 1) * entriesPerPage,
              data?.recordsFiltered || 0
            )}{" "}
            of {data?.recordsFiltered || 0} entries
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AllTradingAccountTable;
