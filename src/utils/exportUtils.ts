import { enqueueSnackbar } from "notistack";

/**
 * Export utility functions for exporting table data to different formats
 */

export interface ExportColumn {
  header: string;
  key: string;
  formatter?: (value: unknown) => string;
}

export interface ExportOptions {
  filename?: string;
  columns: ExportColumn[];
  data: Record<string, unknown>[];
}

/**
 * Copy table data to clipboard in tab-separated format
 */
export const handleCopyToClipboard = (options: ExportOptions): void => {
  const { columns, data } = options;

  if (!data || data.length === 0) {
    enqueueSnackbar("No data to copy", { variant: "warning" });
    return;
  }

  const headers = columns.map((col) => col.header);

  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      return col.formatter ? col.formatter(value) : String(value);
    })
  );

  const textContent = [
    headers.join("\t"),
    ...rows.map((row) => row.join("\t")),
  ].join("\n");

  navigator.clipboard
    .writeText(textContent)
    .then(() => {
      enqueueSnackbar("Data copied to clipboard!", { variant: "success" });
    })
    .catch(() => {
      enqueueSnackbar("Failed to copy data", { variant: "error" });
    });
};

/**
 * Export table data to CSV file
 */
export const handleExportToCSV = (options: ExportOptions): void => {
  const { columns, data, filename = "export" } = options;

  if (!data || data.length === 0) {
    enqueueSnackbar("No data to export", { variant: "warning" });
    return;
  }

  const headers = columns.map((col) => col.header);

  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      const formattedValue = col.formatter
        ? col.formatter(value)
        : String(value);
      // Escape quotes and wrap in quotes for CSV
      return `"${formattedValue.replace(/"/g, '""')}"`;
    })
  );

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  enqueueSnackbar("CSV file downloaded!", { variant: "success" });
};

/**
 * Export table data to Excel file
 */
export const handleExportToExcel = (options: ExportOptions): void => {
  const { columns, data, filename = "export" } = options;

  if (!data || data.length === 0) {
    enqueueSnackbar("No data to export", { variant: "warning" });
    return;
  }

  const headers = columns.map((col) => col.header);

  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      return col.formatter ? col.formatter(value) : String(value);
    })
  );

  // Create HTML table for Excel
  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>${filename}</title></head>
    <body>
      <table border="1">
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${rows
            .map(
              (row) =>
                `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([excelContent], {
    type: "application/vnd.ms-excel;charset=utf-8;",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `${filename}_${new Date().toISOString().split("T")[0]}.xls`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  enqueueSnackbar("Excel file downloaded!", { variant: "success" });
};

/**
 * Print table data
 */
export const handlePrintTable = (
  options: ExportOptions & { title?: string }
): void => {
  const { columns, data, title = "Data Report" } = options;

  if (!data || data.length === 0) {
    enqueueSnackbar("No data to print", { variant: "warning" });
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    enqueueSnackbar("Failed to open print window", { variant: "error" });
    return;
  }

  const headers = columns.map((col) => col.header);

  const printContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f3f4f6; font-weight: 600; color: #374151; }
        tr:nth-child(even) { background-color: #f9fafb; }
        .status-active { color: #059669; font-weight: 600; }
        .status-inactive { color: #dc2626; font-weight: 600; }
        .status-enabled { color: #059669; font-weight: 600; }
        .status-disabled { color: #dc2626; font-weight: 600; }
        @media print {
          body { padding: 10px; }
          th, td { padding: 6px; font-size: 10px; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <p>Total Records: ${data.length}</p>
      <table>
        <thead>
          <tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>
        </thead>
        <tbody>
          ${data
            .map(
              (item) => `
            <tr>
              ${columns
                .map((col) => {
                  const value = item[col.key];
                  const formattedValue = col.formatter
                    ? col.formatter(value)
                    : String(value);
                  return `<td>${formattedValue}</td>`;
                })
                .join("")}
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 250);

  enqueueSnackbar("Opening print dialog...", { variant: "info" });
};
