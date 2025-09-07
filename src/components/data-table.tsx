'use client';

import * as React from 'react';
import { cn } from '../utils';

export interface DataTableProps {
  data: Record<string, unknown>[];
  columns?: string[];
  className?: string;
  maxRows?: number;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  className,
  maxRows = 100
}) => {
  const displayData = maxRows ? data.slice(0, maxRows) : data;
  
  // Auto-detect columns if not provided
  const tableColumns = columns || (data.length > 0 ? Object.keys(data[0]) : []);

  return (
    <div className={cn('overflow-auto border rounded-md', className)}>
      <table className="w-full text-sm">
        <thead className="bg-muted">
          <tr>
            {tableColumns.map((column) => (
              <th key={column} className="px-4 py-2 text-left font-medium">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, index) => (
            <tr key={index} className="border-t">
              {tableColumns.map((column) => (
                <td key={column} className="px-4 py-2">
                  {String(row[column] || '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {maxRows && data.length > maxRows && (
        <div className="px-4 py-2 text-sm text-muted-foreground bg-muted">
          Showing {maxRows} of {data.length} rows
        </div>
      )}
    </div>
  );
};
