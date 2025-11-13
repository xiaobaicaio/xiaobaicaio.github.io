import { useMemo } from 'react';

export default function ExcelDataTable({
  headers,
  data,
  mergedCells
}: {
  headers: string[];
  data: any[][];
  mergedCells: { [key: string]: { rowSpan: number, colSpan: number } };
}) {
  const tableData = useMemo(() => {
    return data.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        const cellKey = `${rowIndex}-${colIndex}`;
        const mergeInfo = mergedCells[cellKey];

        return {
          value: cell,
          rowSpan: mergeInfo?.rowSpan || 1,
          colSpan: mergeInfo?.colSpan || 1,
          isMerged: !!mergeInfo
        };
      });
    });
  }, [data, mergedCells]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => {
                if (cell.isMerged) return null;

                return (
                  <td
                    key={`${rowIndex}-${colIndex}`}
                    rowSpan={cell.rowSpan}
                    colSpan={cell.colSpan}
                    className={`px-6 py-4 whitespace-nowrap text-sm 
                      ${cell.rowSpan > 1 || cell.colSpan > 1
                        ? 'bg-blue-50 dark:bg-blue-900/30'
                        : 'text-gray-900 dark:text-gray-200'}
                    `}
                  >
                    {cell.value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}