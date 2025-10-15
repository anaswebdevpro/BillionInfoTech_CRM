# Export Utilities Documentation

## Overview

Reusable utility functions for exporting table data to different formats (Copy, CSV, Excel, Print).

## Installation

```typescript
import {
  handleCopyToClipboard,
  handleExportToCSV,
  handleExportToExcel,
  handlePrintTable,
  type ExportColumn,
  type ExportOptions,
} from "@/utils/exportUtils";
```

## Types

### `ExportColumn`

Defines a column configuration for export.

```typescript
interface ExportColumn {
  header: string; // Column header text
  key: string; // Key to extract value from data object
  formatter?: (value: unknown) => string; // Optional formatter function
}
```

### `ExportOptions`

Configuration for export operations.

```typescript
interface ExportOptions {
  filename?: string; // Output filename (without extension)
  columns: ExportColumn[]; // Column definitions
  data: Record<string, unknown>[]; // Data array to export
}
```

## Functions

### 1. `handleCopyToClipboard(options: ExportOptions)`

Copies table data to clipboard in tab-separated format.

**Example:**

```typescript
const columns: ExportColumn[] = [
  { header: "#", key: "id" },
  { header: "Name", key: "name" },
  { header: "Email", key: "email" },
  {
    header: "Status",
    key: "status",
    formatter: (value) => (value === 1 ? "Active" : "Inactive"),
  },
];

const data = [
  { id: 1, name: "John Doe", email: "john@example.com", status: 1 },
  { id: 2, name: "Jane Smith", email: "jane@example.com", status: 0 },
];

handleCopyToClipboard({ columns, data });
```

### 2. `handleExportToCSV(options: ExportOptions)`

Exports table data as CSV file.

**Example:**

```typescript
handleExportToCSV({
  filename: "clients",
  columns: columns,
  data: data,
});
// Downloads: clients_2025-10-15.csv
```

### 3. `handleExportToExcel(options: ExportOptions)`

Exports table data as Excel file (.xls).

**Example:**

```typescript
handleExportToExcel({
  filename: "clients_report",
  columns: columns,
  data: data,
});
// Downloads: clients_report_2025-10-15.xls
```

### 4. `handlePrintTable(options: ExportOptions & { title?: string })`

Opens print dialog with formatted table.

**Example:**

```typescript
handlePrintTable({
  title: "Clients Report",
  columns: columns,
  data: data,
});
```

## Complete Usage Example

```typescript
import { useState } from "react";
import {
  handleCopyToClipboard,
  handleExportToCSV,
  handleExportToExcel,
  handlePrintTable,
  type ExportColumn,
} from "@/utils/exportUtils";

const MyTableComponent = () => {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: 1 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: 0 },
  ]);

  // Define columns once
  const exportColumns: ExportColumn[] = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    {
      header: "Status",
      key: "status",
      formatter: (value) => (value === 1 ? "Active" : "Inactive"),
    },
  ];

  return (
    <div>
      <div className="export-buttons">
        <button
          onClick={() =>
            handleCopyToClipboard({ columns: exportColumns, data })
          }
        >
          Copy
        </button>
        <button
          onClick={() =>
            handleExportToCSV({
              filename: "users",
              columns: exportColumns,
              data,
            })
          }
        >
          CSV
        </button>
        <button
          onClick={() =>
            handleExportToExcel({
              filename: "users",
              columns: exportColumns,
              data,
            })
          }
        >
          Excel
        </button>
        <button
          onClick={() =>
            handlePrintTable({
              title: "Users Report",
              columns: exportColumns,
              data,
            })
          }
        >
          Print
        </button>
      </div>

      {/* Your table here */}
    </div>
  );
};
```

## Advanced: Custom Formatters

You can use custom formatters to transform data before export:

```typescript
const columns: ExportColumn[] = [
  { header: "Serial", key: "serial" },
  {
    header: "Full Name",
    key: "name",
    formatter: (value) => String(value).toUpperCase(),
  },
  {
    header: "Created Date",
    key: "created_at",
    formatter: (value) => new Date(String(value)).toLocaleDateString(),
  },
  {
    header: "Price",
    key: "price",
    formatter: (value) => `$${Number(value).toFixed(2)}`,
  },
  {
    header: "Withdrawal Status",
    key: "withdrawal_status",
    formatter: (value) => (value === 1 ? "Enabled" : "Disabled"),
  },
];
```

## Features

✅ **Copy to Clipboard**: Tab-separated format (TSV) compatible with Excel/Google Sheets  
✅ **CSV Export**: Proper escaping of quotes and commas  
✅ **Excel Export**: HTML-based .xls file with table formatting  
✅ **Print**: Styled print-friendly layout with auto print dialog  
✅ **Auto Notifications**: Success/error messages via notistack  
✅ **Date Stamping**: Files named with current date (YYYY-MM-DD)  
✅ **Type Safe**: Full TypeScript support  
✅ **Reusable**: Works with any table data structure

## Notes

- All functions validate that data exists before proceeding
- Notifications are automatically shown for success/error states
- Files are automatically downloaded with timestamp
- Print window opens in new tab and auto-closes after printing
- CSV properly escapes quotes and special characters
- Excel files can be opened in Microsoft Excel, LibreOffice, etc.

## Browser Compatibility

- **Copy**: Requires Clipboard API (modern browsers)
- **CSV/Excel**: Blob API (all modern browsers)
- **Print**: window.open and print() API (all browsers)
