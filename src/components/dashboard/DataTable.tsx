
import React from "react";
import { Card } from "@/components/ui/card";

interface Column {
  key: string;
  header: string;
  render?: (item: any) => React.ReactNode;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  emptyMessage?: string;
}

const DataTable: React.FC<DataTableProps> = ({ data, columns, emptyMessage = "No data available" }) => {
  if (data.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              {columns.map((column) => (
                <td key={column.key} className="py-4 px-4">
                  {column.render ? column.render(item) : item[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
