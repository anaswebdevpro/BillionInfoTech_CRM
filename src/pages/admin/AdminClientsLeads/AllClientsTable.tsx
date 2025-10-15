import useAdminAuth from "@/Hook/useAdminAuth";
import { apiRequest } from "@/services";
import { ADMIN_GET_ALL_CLIENT } from "../../../../api/api-variable";
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

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  country: string;
  franchise: string;
  institute: string;
  sponsor: string;
  status: number;
  ib_status: number | null;
  withdrawal_status: number;
  created_on: string;
}

interface ApiResponse {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Client[];
}

const AllClientsTable = () => {
  const { adminToken } = useAdminAuth();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const fetchData = useCallback(
    (
      page = currentPage,
      search = debouncedSearchValue,
      length = entriesPerPage
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const requestBody = {
          start: page * length,
          length,
          search,
        };
        console.log("Request Body:", requestBody);

        apiRequest({
          endpoint: ADMIN_GET_ALL_CLIENT,
          method: "POST",
          headers: { Authorization: `Bearer ${adminToken}` },
          data: requestBody,
        })
          .then((response: unknown) => {
            console.log("All Clients Response:", response);

            // Check if response indicates success or failure
            const responseData = response as {
              response?: boolean;
              message?: string;
            };

            if (responseData.response === false) {
              enqueueSnackbar(
                responseData.message || "Failed to fetch clients data!",
                { variant: "error" }
              );
            } else {
              setData(response as ApiResponse);
            }
          })

          .catch((error) => {
            console.error("Error fetching clients data:", error);
            const errorMessage =
              error?.message ||
              error?.response?.data?.message ||
              "Failed to fetch clients data";
            enqueueSnackbar(errorMessage, { variant: "error" });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Failed to fetch clients data:", error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to load data. Please try again later.";
        enqueueSnackbar(errorMessage, { variant: "error" });
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    },
    [adminToken, currentPage, debouncedSearchValue, entriesPerPage]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pagination handlers
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

  const handleAction = (action: string, client: Client) => {
    console.log(`${action} action for client:`, client);
    enqueueSnackbar(`${action} action for ${client.name}`, { variant: "info" });
  };

  // Define export columns configuration
  const exportColumns: ExportColumn[] = [
    { header: "#", key: "serial" },
    { header: "Client ID", key: "id" },
    { header: "Client Email", key: "email" },
    { header: "Password", key: "password" },
    { header: "Name", key: "name" },
    { header: "Sponsor", key: "sponsor" },
    { header: "Country", key: "country" },
    { header: "Phone", key: "phone" },
    { header: "User Type", key: "franchise" },
    { header: "City", key: "institute" },
    {
      header: "Withdrawal Status",
      key: "withdrawal_status",
      formatter: (value) => (value === 1 ? "Enabled" : "Disabled"),
    },
    { header: "Joined On", key: "created_on" },
    {
      header: "Status",
      key: "status",
      formatter: (value) => (value === 1 ? "Active" : "Inactive"),
    },
  ];

  // Prepare export data with serial numbers
  const getExportData = () => {
    if (!data || data.data.length === 0) return [];

    return data.data.map((client, index) => ({
      serial: currentPage * entriesPerPage + index + 1,
      ...client,
    }));
  };

  // Export handlers using utility functions
  const handleCopy = () => {
    handleCopyToClipboard({
      columns: exportColumns,
      data: getExportData(),
    });
  };

  const handleCSV = () => {
    handleExportToCSV({
      filename: "clients",
      columns: exportColumns,
      data: getExportData(),
    });
  };

  const handleExcel = () => {
    handleExportToExcel({
      filename: "clients",
      columns: exportColumns,
      data: getExportData(),
    });
  };

  const handlePrint = () => {
    handlePrintTable({
      title: "Clients and Leads Report",
      columns: exportColumns,
      data: getExportData(),
    });
  };

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Clients Table */}
        <Card className="p-4 sm:p-6 w-full">
          {/* Header with Search and Export Buttons */}
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
                    placeholder="Search clients and leads..."
                    className={`border border-${COLORS.GRAY_BORDER} rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm w-full focus:ring-2 focus:ring-${COLORS.PRIMARY} focus:border-${COLORS.PRIMARY} transition-all duration-200`}
                  />
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-${COLORS.BORDER} bg-${COLORS.PRIMARY} text-${COLORS.WHITE} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-black transition-all duration-200`}
                  >
                    Copy
                  </button>
                  <button
                    onClick={handleCSV}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-${COLORS.BORDER} bg-${COLORS.PRIMARY} text-${COLORS.WHITE} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-black transition-all duration-200`}
                  >
                    CSV
                  </button>
                  <button
                    onClick={handleExcel}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-${COLORS.BORDER} bg-${COLORS.PRIMARY} text-${COLORS.WHITE} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-black transition-all duration-200`}
                  >
                    Excel
                  </button>
                  <button
                    onClick={handlePrint}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg border border-${COLORS.BORDER} bg-${COLORS.PRIMARY} text-${COLORS.WHITE} hover:bg-${COLORS.PRIMARY_BG_LIGHT} hover:text-black transition-all duration-200`}
                  >
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table Content with Conditional Shimmer */}
          {isLoading ? (
            <div className="w-full">
              <ShimmerLoader variant="table" width={1200} height={400} />
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-red-500 text-sm sm:text-base">{error}</p>
            </div>
          ) : !data || data.data.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <p className="text-gray-500 text-sm sm:text-base">
                No clients found
              </p>
            </div>
          ) : (
            <div className="w-full">
              <div className="overflow-auto max-h-[500px] sm:max-h-[600px] border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client ID
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Client Email
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Password
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Sponsor
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Country
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        User Type
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden xl:table-cell">
                        City
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Withdrawal Status
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined On
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.data.map((client, index) => (
                      <tr
                        key={client.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-medium">
                          {currentPage * entriesPerPage + index + 1}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-900 font-medium">
                          {client.id}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-900">
                          <div className="max-w-[150px] sm:max-w-none truncate">
                            {client.email}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                          {client.password}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-blue-900 font-medium">
                          {client.name}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                          <div className="max-w-[150px] truncate">
                            {client.sponsor}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden lg:table-cell">
                          {client.country}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {client.phone}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden md:table-cell">
                          {client.franchise}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 hidden xl:table-cell">
                          {client.institute}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap hidden md:table-cell">
                          <span
                            className={`inline-flex px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${
                              client.withdrawal_status === 1
                                ? "bg-green-100 text-green-800"
                                : client.withdrawal_status === 0
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {client.withdrawal_status === 1
                              ? "Enabled"
                              : client.withdrawal_status === 0
                              ? "Disabled"
                              : "Unknown"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                          {client.created_on}
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-0.5 sm:py-1 text-xs font-semibold rounded-full ${
                              client.status === 1
                                ? "bg-green-100 text-green-800"
                                : client.status === 0
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {client.status === 1
                              ? "Active"
                              : client.status === 0
                              ? "Inactive"
                              : "Unknown"}
                          </span>
                        </td>
                        <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAction("View", client)}
                              className="text-green-600 hover:text-green-700 transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction("Edit", client)}
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction("Delete", client)}
                              className="text-red-600 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
        {/* Pagination Controls at Bottom */}
        <Card
          className={`mt-2  sm:p-1 bg-${COLORS.WHITE} border border-${COLORS.BORDER} ${COLORS.SHADOW} rounded-xl`}
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
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span
                className={`text-xs sm:text-sm text-${COLORS.SECONDARY_TEXT}`}
              >
                entries
              </span>
            </div>

            {/* Pagination Navigation - Center */}
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

            {/* Page Info - Right side */}
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
    </div>
  );
};

export default AllClientsTable;
