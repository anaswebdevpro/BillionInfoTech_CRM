import React, { useState } from 'react';
import { Card, Button } from '../../../components/ui';
import { COLORS } from '../../../constants/colors';
import { DollarSign, BarChart3 } from 'lucide-react';

interface TableRow {
  [key: string]: string | number;
}

interface TableData {
  draw: null;
  recordsTotal: number;
  recordsFiltered: number;
  data: TableRow[];
}

const IBTransaction: React.FC = () => {
  // Dummy data objects
  const partnerCommissionsData: TableData = {
    draw: null,
    recordsTotal: 15,
    recordsFiltered: 15,
    data: [
      { "#": 1, "Account": "IB001234", "Ticket": "TXN789456", "Amount": "$125.50", "Date": "2024-01-15" },
      { "#": 2, "Account": "IB001235", "Ticket": "TXN789457", "Amount": "$89.75", "Date": "2024-01-15" },
      { "#": 3, "Account": "IB001236", "Ticket": "TXN789458", "Amount": "$234.20", "Date": "2024-01-14" },
      { "#": 4, "Account": "IB001237", "Ticket": "TXN789459", "Amount": "$156.80", "Date": "2024-01-14" },
      { "#": 5, "Account": "IB001238", "Ticket": "TXN789460", "Amount": "$78.90", "Date": "2024-01-13" },
      { "#": 6, "Account": "IB001239", "Ticket": "TXN789461", "Amount": "$312.45", "Date": "2024-01-13" },
      { "#": 7, "Account": "IB001240", "Ticket": "TXN789462", "Amount": "$98.30", "Date": "2024-01-12" },
      { "#": 8, "Account": "IB001241", "Ticket": "TXN789463", "Amount": "$167.25", "Date": "2024-01-12" },
      { "#": 9, "Account": "IB001242", "Ticket": "TXN789464", "Amount": "$245.60", "Date": "2024-01-11" },
      { "#": 10, "Account": "IB001243", "Ticket": "TXN789465", "Amount": "$134.70", "Date": "2024-01-11" }
    ]
  };

  const lotWiseCommissionData: TableData = {
    draw: null,
    recordsTotal: 12,
    recordsFiltered: 12,
    data: [
      { "#": 1, "Account": "IB001234", "Lots": "2.5", "Amount": "$87.50", "Date": "2024-01-15" },
      { "#": 2, "Account": "IB001235", "Lots": "1.8", "Amount": "$63.00", "Date": "2024-01-15" },
      { "#": 3, "Account": "IB001236", "Lots": "3.2", "Amount": "$112.00", "Date": "2024-01-14" },
      { "#": 4, "Account": "IB001237", "Lots": "2.1", "Amount": "$73.50", "Date": "2024-01-14" },
      { "#": 5, "Account": "IB001238", "Lots": "1.5", "Amount": "$52.50", "Date": "2024-01-13" },
      { "#": 6, "Account": "IB001239", "Lots": "4.1", "Amount": "$143.50", "Date": "2024-01-13" },
      { "#": 7, "Account": "IB001240", "Lots": "1.2", "Amount": "$42.00", "Date": "2024-01-12" },
      { "#": 8, "Account": "IB001241", "Lots": "2.8", "Amount": "$98.00", "Date": "2024-01-12" },
      { "#": 9, "Account": "IB001242", "Lots": "3.5", "Amount": "$122.50", "Date": "2024-01-11" },
      { "#": 10, "Account": "IB001243", "Lots": "2.0", "Amount": "$70.00", "Date": "2024-01-11" }
    ]
  };

  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleRefresh = () => {
    // Refresh logic here
    console.log('Refreshing data...');
  };

  const TableComponent: React.FC<{ title: string; headers: string[]; data: TableData }> = ({ title, headers, data }) => (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className={`px-6 py-4 border-b border-${COLORS.BORDER}`}>
        <h3 className={`text-xl font-bold text-${COLORS.SECONDARY} flex items-center gap-2`}>
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          {title}
        </h3>
        <p className={`text-sm text-${COLORS.SECONDARY_TEXT} mt-1`}>
          {data.recordsTotal} total transactions
        </p>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <label className={`text-sm font-semibold text-${COLORS.SECONDARY_TEXT}`}>Show</label>
            <select 
              value={entriesPerPage} 
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className={`border-2 border-${COLORS.BORDER} rounded-lg px-3 py-2 text-sm font-medium focus:border-green-500 focus:outline-none transition-colors`}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className={`text-sm font-semibold text-${COLORS.SECONDARY_TEXT}`}>entries</span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`border-2 border-${COLORS.BORDER} rounded-lg px-4 py-2 text-sm w-full sm:w-64 focus:border-green-500 focus:outline-none transition-colors placeholder-gray-400`}
            />
            <svg className="w-4 h-4 absolute right-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {headers.map((header, index) => (
                  <th key={index} className={`text-left py-4 px-6 font-bold text-sm text-${COLORS.SECONDARY} uppercase tracking-wider`}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data.length === 0 ? (
                <tr>
                  <td colSpan={headers.length} className={`text-center py-12 text-${COLORS.SECONDARY_TEXT}`}>
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT}`}>No transactions found</div>
                      <div className={`text-sm text-${COLORS.SECONDARY_TEXT}`}>Try adjusting your search or filters</div>
                    </div>
                  </td>
                </tr>
              ) : (
                data.data.map((row: TableRow, index: number) => (
                  <tr key={index} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    {Object.values(row).map((cell: string | number, cellIndex: number) => (
                      <td key={cellIndex} className={`py-4 px-6 text-sm font-medium ${cellIndex === 0 ? `text-${COLORS.SECONDARY} font-bold` : `text-${COLORS.SECONDARY_TEXT}`}`}>
                        {typeof cell === 'string' && cell.startsWith('$') ? (
                          <span className="font-bold text-green-600">{cell}</span>
                        ) : cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
          <div className={`text-sm font-semibold text-${COLORS.SECONDARY_TEXT}`}>
            Showing <span className="text-green-600 font-bold">{data.recordsFiltered === 0 ? 0 : 1}</span> to <span className="text-green-600 font-bold">{Math.min(entriesPerPage, data.recordsFiltered)}</span> of <span className="text-green-600 font-bold">{data.recordsTotal}</span> entries
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={data.recordsTotal <= entriesPerPage}
              className="px-4 py-2 font-semibold rounded-lg border-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={data.recordsTotal <= entriesPerPage}
              className="px-4 py-2 font-semibold rounded-lg border-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className={`text-3xl font-bold text-${COLORS.SECONDARY} tracking-tight`}>
            IB Transaction
          </h1>
          <p className={`text-base text-${COLORS.SECONDARY_TEXT} mt-2 font-medium`}>
            Monitor and manage IB transactions with real-time insights
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className={`text-4xl font-bold text-${COLORS.SECONDARY} mb-1`}>$1,642.95</div>
              <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT} uppercase tracking-wide`}>
                Total Earned Commission
              </div>
              <div className={`text-sm text-green-600 font-medium mt-1`}>
                ↗ +12.5% from last month
              </div>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className={`text-4xl font-bold text-${COLORS.SECONDARY} mb-1`}>24.7</div>
              <div className={`text-lg font-semibold text-${COLORS.SECONDARY_TEXT} uppercase tracking-wide`}>
                Total Lots Traded
              </div>
              <div className={`text-sm text-green-600 font-medium mt-1`}>
                ↗ +8.2% from last month
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TableComponent 
          title="Partner Commissions" 
          headers={["#", "Account", "Ticket", "Amount", "Date"]} 
          data={partnerCommissionsData} 
        />
        <TableComponent 
          title="Lot Wise Commission" 
          headers={["#", "Account", "Lots", "Amount", "Date"]} 
          data={lotWiseCommissionData} 
        />
      </div>
    </div>
  );
};

export default IBTransaction;
